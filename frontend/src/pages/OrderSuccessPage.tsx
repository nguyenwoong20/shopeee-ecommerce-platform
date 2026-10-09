import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByCode } from '../api/orders';
import type { Order } from '../types';
import './OrderSuccessPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xác nhận', color: 'var(--yellow)', icon: '⏳' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'var(--blue)', icon: '✅' },
  SHIPPING:  { label: 'Đang giao hàng', color: 'var(--brand)', icon: '🚚' },
  DELIVERED: { label: 'Đã giao hàng', color: 'var(--green)', icon: '📦' },
  CANCELLED: { label: 'Đã hủy', color: 'var(--red)', icon: '❌' },
};

export function OrderSuccessPage() {
  const { code } = useParams<{ code: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    getOrderByCode(code)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <main className="page-content">
      <div className="container"><div className="spinner-wrap"><div className="spinner" /></div></div>
    </main>
  );

  if (!order) return (
    <main className="page-content">
      <div className="container">
        <div className="empty-state" style={{ marginTop: 64 }}>
          <span className="empty-state-icon">❓</span>
          <h3>Không tìm thấy đơn hàng</h3>
          <p>Mã đơn hàng không tồn tại hoặc đã bị xóa.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Về trang chủ</Link>
        </div>
      </div>
    </main>
  );

  const statusCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
  const payLabel = order.paymentMethod === 'COD' ? '💰 Tiền mặt khi nhận' : order.paymentMethod === 'VNPAY' ? '🏦 VNPay' : '📱 MoMo';

  return (
    <main className="page-content success-page">
      <div className="container">
        {/* Confetti header */}
        <div className="success-header">
          <div className="success-icon-wrap">
            <span className="success-icon">🎉</span>
          </div>
          <h1 className="success-title">Đặt hàng thành công!</h1>
          <p className="success-sub">Cảm ơn bạn đã tin tưởng Shopeee. Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể.</p>
          <div className="order-code-badge">
            Mã đơn hàng: <strong>{order.orderCode}</strong>
          </div>
        </div>

        <div className="success-layout">
          {/* Order details */}
          <div className="success-main">
            {/* Status */}
            <div className="order-status-card">
              <span className="order-status-icon">{statusCfg.icon}</span>
              <div>
                <p className="order-status-label" style={{ color: statusCfg.color }}>{statusCfg.label}</p>
                <p className="order-status-desc">Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            {/* Items */}
            <div className="order-section">
              <h2 className="order-section-title">📦 Sản phẩm đã đặt</h2>
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.productImage || `https://picsum.photos/seed/${item.productId}/60/60`}
                    alt={item.productName}
                    className="order-item-img"
                    onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.productId + 50}/60/60`; }}
                  />
                  <div className="order-item-info">
                    <p className="order-item-name">{item.productName}</p>
                    <p className="order-item-qty">x{item.quantity} × {fmt(item.unitPrice)}</p>
                  </div>
                  <span className="price">{fmt(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Shipping info */}
            <div className="order-section">
              <h2 className="order-section-title">🚚 Thông tin giao hàng</h2>
              <div className="info-grid">
                <div className="info-row"><span className="info-label">Người nhận</span><span>{order.customerName}</span></div>
                <div className="info-row"><span className="info-label">Điện thoại</span><span>{order.customerPhone}</span></div>
                <div className="info-row"><span className="info-label">Địa chỉ</span><span>{order.shippingAddress}, {order.shippingCity}</span></div>
                <div className="info-row"><span className="info-label">Thanh toán</span><span>{payLabel}</span></div>
                {order.notes && <div className="info-row"><span className="info-label">Ghi chú</span><span>{order.notes}</span></div>}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="success-sidebar">
            <div className="order-summary-card">
              <h2 className="order-section-title">💰 Tổng kết đơn</h2>
              <div className="summary-rows">
                <div className="summary-row"><span>Tạm tính</span><span>{fmt(order.subtotal)}</span></div>
                <div className="summary-row">
                  <span>Vận chuyển</span>
                  <span className={order.shippingFee === 0 ? 'free-ship' : ''}>{order.shippingFee === 0 ? '🎉 Miễn phí' : fmt(order.shippingFee)}</span>
                </div>
                <hr className="divider" />
                <div className="summary-row summary-total">
                  <span>Tổng cộng</span>
                  <span className="price">{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="success-actions">
              <Link to="/orders" className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                📦 Xem đơn hàng của tôi
              </Link>
              <Link to="/" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                🛍 Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
