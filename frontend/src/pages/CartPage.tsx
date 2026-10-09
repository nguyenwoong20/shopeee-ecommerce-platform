import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateQty, removeFromCart, clearCart } from '../api/cart';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { CartSummary, CartItem } from '../types';
import './CartPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

export function CartPage() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<Set<number>>(new Set());
  const { refreshCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function load() {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUpdateQty(item: CartItem, qty: number) {
    if (qty < 1) return;
    try {
      const updated = await updateQty(item.id, qty);
      setCart(updated);
      refreshCount();
    } catch (e: any) {
      showToast(e.message || 'Cập nhật thất bại', 'error');
    }
  }

  async function handleRemove(itemId: number) {
    setRemoving(s => new Set(s).add(itemId));
    try {
      const updated = await removeFromCart(itemId);
      setCart(updated);
      refreshCount();
      showToast('Đã xóa sản phẩm khỏi giỏ', 'success');
    } catch {
      showToast('Xóa thất bại', 'error');
    } finally {
      setRemoving(s => { const n = new Set(s); n.delete(itemId); return n; });
    }
  }

  async function handleClear() {
    if (!confirm('Bạn có muốn xóa tất cả sản phẩm trong giỏ?')) return;
    try {
      await clearCart();
      setCart(null);
      refreshCount();
      showToast('Đã xóa toàn bộ giỏ hàng', 'success');
    } catch {
      showToast('Xóa thất bại', 'error');
    }
  }

  if (loading) {
    return (
      <main className="page-content cart-page">
        <div className="container">
          <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>
          <div className="cart-layout">
            <div className="cart-items">
              {[1, 2, 3].map(i => (
                <div key={i} className="cart-item skeleton-card">
                  <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 8 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className="page-content cart-page">
      <div className="container">
        <div className="cart-header-row">
          <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>
          {!isEmpty && (
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>🗑 Xóa tất cả</button>
          )}
        </div>

        {isEmpty ? (
          <div className="empty-state" style={{ marginTop: 40 }}>
            <span className="empty-state-icon">🛒</span>
            <h3>Giỏ hàng đang trống</h3>
            <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>🛍 Bắt đầu mua sắm</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {/* Table header */}
              <div className="cart-table-head">
                <span style={{ flex: 1 }}>Sản phẩm</span>
                <span style={{ width: 120, textAlign: 'center' }}>Đơn giá</span>
                <span style={{ width: 120, textAlign: 'center' }}>Số lượng</span>
                <span style={{ width: 120, textAlign: 'right' }}>Thành tiền</span>
                <span style={{ width: 40 }} />
              </div>

              {cart!.items.map(item => (
                <div key={item.id} className={`cart-item${removing.has(item.id) ? ' removing' : ''}`}>
                  <Link to={`/products/${item.productId}`} className="cart-item-img">
                    <img
                      src={item.productImage || `https://picsum.photos/seed/${item.productId}/80/80`}
                      alt={item.productName}
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.productId + 50}/80/80`; }}
                    />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/products/${item.productId}`} className="cart-item-name">{item.productName}</Link>
                    <span className="cart-item-price-mobile price">{fmt(item.productPrice)}</span>
                  </div>
                  <span className="cart-item-unit-price price">{fmt(item.productPrice)}</span>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => handleUpdateQty(item, item.quantity - 1)}>−</button>
                    <span className="cart-qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleUpdateQty(item, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-total price">{fmt(item.productPrice * item.quantity)}</span>
                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Xóa"
                    title="Xóa"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h2 className="summary-title">Tóm tắt đơn hàng</h2>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính ({cart!.totalItems} sp)</span>
                  <span>{fmt(cart!.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span className={cart!.shipping === 0 ? 'free-ship' : ''}>
                    {cart!.shipping === 0 ? '🎉 Miễn phí' : fmt(cart!.shipping)}
                  </span>
                </div>
                <hr className="divider" />
                <div className="summary-row summary-total">
                  <span>Tổng cộng</span>
                  <span className="price">{fmt(cart!.total)}</span>
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Tiến hành thanh toán →
              </button>
              <Link to="/products" className="btn btn-ghost btn-sm continue-btn">← Tiếp tục mua sắm</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
