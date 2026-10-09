import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByPhone, cancelOrder } from '../api/orders';
import type { Order } from '../types';
import './OrdersPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:   { label: 'Chờ xác nhận', color: '#b45309', bg: '#fffbeb', icon: '⏳' },
  CONFIRMED: { label: 'Đã xác nhận', color: '#1d4ed8', bg: '#eff6ff', icon: '✅' },
  SHIPPING:  { label: 'Đang giao', color: '#c2410c', bg: '#fff5f3', icon: '🚚' },
  DELIVERED: { label: 'Đã giao', color: '#15803d', bg: '#ecfdf5', icon: '📦' },
  CANCELLED: { label: 'Đã hủy', color: '#dc2626', bg: '#fef2f2', icon: '❌' },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chưa thanh toán', color: 'var(--yellow)' },
  PAID:    { label: 'Đã thanh toán', color: 'var(--green)' },
  FAILED:  { label: 'Thất bại', color: 'var(--red)' },
  REFUNDED:{ label: 'Đã hoàn tiền', color: 'var(--blue)' },
};

export function OrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!/^0\d{9}$/.test(phone)) {
      setError('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await getOrdersByPhone(phone);
      setOrders(data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(order: Order) {
    if (!confirm(`Hủy đơn hàng ${order.orderCode}?`)) return;
    setCancellingId(order.id);
    try {
      const updated = await cancelOrder(order.id);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    } catch (err: any) {
      alert(err.message || 'Hủy đơn thất bại');
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="page-content orders-page">
      <div className="container">
        <h1 className="orders-title">📦 Đơn hàng của tôi</h1>

        {/* Search form */}
        <div className="orders-search-box">
          <p className="orders-search-hint">Nhập số điện thoại để tra cứu đơn hàng</p>
          <form onSubmit={handleSearch} className="orders-search-form">
            <input
              id="orders-phone-input"
              type="tel"
              placeholder="Nhập số điện thoại (VD: 0901234567)"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(''); }}
              className={`orders-phone-input${error ? ' err' : ''}`}
            />
            <button type="submit" className="btn btn-primary orders-search-btn" disabled={loading}>
              {loading ? '⏳ Đang tìm...' : '🔍 Tìm kiếm'}
            </button>
          </form>
          {error && <p className="orders-err">{error}</p>}
        </div>

        {/* Results */}
        {searched && (
          <div className="orders-results">
            {orders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📭</span>
                <h3>Không tìm thấy đơn hàng</h3>
                <p>Không có đơn hàng nào với số điện thoại <strong>{phone}</strong></p>
                <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>🛍 Mua sắm ngay</Link>
              </div>
            ) : (
              <>
                <p className="orders-count">Tìm thấy <strong>{orders.length}</strong> đơn hàng cho SĐT <strong>{phone}</strong></p>
                <div className="orders-list">
                  {orders.map(order => {
                    const st = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
                    const ps = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.PENDING;
                    const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';
                    return (
                      <div key={order.id} className="order-card">
                        {/* Header */}
                        <div className="order-card-head">
                          <div className="order-card-code">
                            <span className="order-label">Mã đơn:</span>
                            <Link to={`/order-success/${order.orderCode}`} className="order-code-link">
                              {order.orderCode}
                            </Link>
                          </div>
                          <div className="order-card-badges">
                            <span className="order-status-badge" style={{ color: st.color, background: st.bg }}>
                              {st.icon} {st.label}
                            </span>
                            <span className="order-pay-badge" style={{ color: ps.color }}>
                              {ps.label}
                            </span>
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="order-items-preview">
                          {order.items.slice(0, 3).map(item => (
                            <div key={item.id} className="order-preview-item">
                              <img
                                src={item.productImage || `https://picsum.photos/seed/${item.productId}/60/60`}
                                alt={item.productName}
                                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.productId + 50}/60/60`; }}
                              />
                              <div>
                                <p className="preview-name">{item.productName}</p>
                                <p className="preview-qty">x{item.quantity} · {fmt(item.lineTotal)}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="order-more-items">+{order.items.length - 3} sản phẩm khác</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="order-card-foot">
                          <div className="order-total-row">
                            <span>Tổng cộng:</span>
                            <span className="price order-total-val">{fmt(order.total)}</span>
                          </div>
                          <div className="order-foot-date">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </div>
                          {canCancel && (
                            <button
                              className="btn btn-ghost btn-sm cancel-btn"
                              disabled={cancellingId === order.id}
                              onClick={() => handleCancel(order)}
                            >
                              {cancellingId === order.id ? '⏳ Đang hủy...' : '❌ Hủy đơn'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
