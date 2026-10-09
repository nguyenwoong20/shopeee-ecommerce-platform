import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { getSessionId } from '../api/client';
import type { CartSummary, PaymentMethod } from '../types';
import './CheckoutPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

const PAYMENT_OPTS: { value: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng', icon: '💰', desc: 'Trả tiền mặt khi nhận hàng' },
  { value: 'VNPAY', label: 'VNPay', icon: '🏦', desc: 'Thanh toán qua cổng VNPay' },
  { value: 'MOMO', label: 'Ví MoMo', icon: '📱', desc: 'Thanh toán qua ví điện tử MoMo' },
];

const CITIES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Biên Hòa', 'Nha Trang', 'Huế', 'Vũng Tàu', 'Quy Nhơn',
  'Long Xuyên', 'Rạch Giá', 'Buôn Ma Thuột', 'Đà Lạt', 'Bắc Ninh',
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { refreshCount } = useCart();
  const { showToast } = useToast();

  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    shippingCity: 'TP. Hồ Chí Minh',
    notes: '',
    paymentMethod: 'COD' as PaymentMethod,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCart()
      .then(c => {
        if (!c || c.items.length === 0) navigate('/cart');
        else setCart(c);
      })
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false));
  }, [navigate]);

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Vui lòng nhập họ tên';
    if (!/^0\d{9}$/.test(form.customerPhone)) e.customerPhone = 'Số điện thoại không hợp lệ (10 số, bắt đầu 0)';
    if (!form.shippingAddress.trim()) e.shippingAddress = 'Vui lòng nhập địa chỉ';
    if (!form.shippingCity) e.shippingCity = 'Vui lòng chọn tỉnh/thành';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const order = await checkout({
        sessionId: getSessionId(),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        shippingAddress: form.shippingAddress,
        shippingCity: form.shippingCity,
        notes: form.notes || undefined,
        paymentMethod: form.paymentMethod,
      });
      refreshCount();
      if (form.paymentMethod !== 'COD' && order.paymentUrl) {
        window.location.href = order.paymentUrl;
      } else {
        navigate(`/order-success/${order.orderCode}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Đặt hàng thất bại, thử lại sau', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <main className="page-content">
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="spinner-wrap"><div className="spinner" /></div>
      </div>
    </main>
  );

  return (
    <main className="page-content checkout-page">
      <div className="container">
        <h1 className="co-title">📋 Thông tin đặt hàng</h1>
        <form onSubmit={handleSubmit} className="co-layout" noValidate>
          {/* Left: form */}
          <div className="co-form-panel">
            {/* Customer info */}
            <div className="co-section">
              <h2 className="co-section-title">👤 Thông tin người mua</h2>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="co-name">Họ và tên *</label>
                  <input id="co-name" type="text" placeholder="Nguyễn Văn A" value={form.customerName}
                    onChange={e => set('customerName', e.target.value)} className={errors.customerName ? 'err' : ''} />
                  {errors.customerName && <p className="field-err">{errors.customerName}</p>}
                </div>
                <div className="field">
                  <label htmlFor="co-phone">Số điện thoại *</label>
                  <input id="co-phone" type="tel" placeholder="0901234567" value={form.customerPhone}
                    onChange={e => set('customerPhone', e.target.value)} className={errors.customerPhone ? 'err' : ''} />
                  {errors.customerPhone && <p className="field-err">{errors.customerPhone}</p>}
                </div>
              </div>
              <div className="field">
                <label htmlFor="co-email">Email (tùy chọn)</label>
                <input id="co-email" type="email" placeholder="email@example.com" value={form.customerEmail}
                  onChange={e => set('customerEmail', e.target.value)} />
              </div>
            </div>

            {/* Shipping */}
            <div className="co-section">
              <h2 className="co-section-title">🚚 Địa chỉ giao hàng</h2>
              <div className="field">
                <label htmlFor="co-address">Địa chỉ cụ thể *</label>
                <input id="co-address" type="text" placeholder="Số nhà, tên đường, phường/xã..."
                  value={form.shippingAddress}
                  onChange={e => set('shippingAddress', e.target.value)}
                  className={errors.shippingAddress ? 'err' : ''} />
                {errors.shippingAddress && <p className="field-err">{errors.shippingAddress}</p>}
              </div>
              <div className="field">
                <label htmlFor="co-city">Tỉnh / Thành phố *</label>
                <select id="co-city" value={form.shippingCity} onChange={e => set('shippingCity', e.target.value)}
                  className={errors.shippingCity ? 'err' : ''}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.shippingCity && <p className="field-err">{errors.shippingCity}</p>}
              </div>
              <div className="field">
                <label htmlFor="co-notes">Ghi chú đơn hàng</label>
                <textarea id="co-notes" rows={3} placeholder="Ghi chú cho người giao (tùy chọn)..."
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>

            {/* Payment */}
            <div className="co-section">
              <h2 className="co-section-title">💳 Phương thức thanh toán</h2>
              <div className="payment-options">
                {PAYMENT_OPTS.map(opt => (
                  <label key={opt.value} className={`payment-opt${form.paymentMethod === opt.value ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => set('paymentMethod', opt.value)} />
                    <span className="pay-icon">{opt.icon}</span>
                    <div>
                      <p className="pay-label">{opt.label}</p>
                      <p className="pay-desc">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          {cart && (
            <div className="co-summary-panel">
              <div className="co-summary">
                <h2 className="co-section-title">🛒 Đơn hàng ({cart.totalItems} sản phẩm)</h2>
                <div className="co-items">
                  {cart.items.map(item => (
                    <div key={item.id} className="co-item">
                      <img src={item.productImage || `https://picsum.photos/seed/${item.productId}/60/60`} alt={item.productName}
                        className="co-item-img"
                        onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.productId + 50}/60/60`; }}
                      />
                      <div className="co-item-info">
                        <p className="co-item-name">{item.productName}</p>
                        <p className="co-item-qty">x{item.quantity}</p>
                      </div>
                      <span className="price co-item-total">{fmt(item.productPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="co-totals">
                  <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{fmt(cart.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span className={cart.shipping === 0 ? 'free-ship' : ''}>
                      {cart.shipping === 0 ? '🎉 Miễn phí' : fmt(cart.shipping)}
                    </span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row" style={{ fontSize: 18, fontWeight: 800 }}>
                    <span>Tổng cộng</span>
                    <span className="price">{fmt(cart.total)}</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg co-submit-btn" disabled={submitting}>
                  {submitting ? '⏳ Đang xử lý...' : '🎉 Đặt hàng ngay'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
