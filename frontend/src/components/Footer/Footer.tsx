import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-logo">
              <span>🛍</span>
              <span className="footer-logo-text">Shopeee</span>
            </Link>
            <p className="footer-desc">
              Sàn thương mại điện tử hàng đầu Việt Nam. Mua sắm tiện lợi, giá tốt mỗi ngày với hàng triệu sản phẩm chính hãng.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Facebook">📘</a>
              <a href="#" className="social-btn" aria-label="Instagram">📷</a>
              <a href="#" className="social-btn" aria-label="YouTube">📺</a>
              <a href="#" className="social-btn" aria-label="TikTok">🎵</a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h4 className="footer-heading">Chăm sóc khách hàng</h4>
            <ul className="footer-links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Shopeee Blog</a></li>
              <li><a href="#">Shopeee Mall</a></li>
              <li><a href="#">Cách mua hàng</a></li>
              <li><a href="#">Giao hàng & vận chuyển</a></li>
              <li><a href="#">Đổi trả & hoàn tiền</a></li>
              <li><a href="#">Liên hệ Shopeee</a></li>
            </ul>
          </div>

          {/* About */}
          <div className="footer-col">
            <h4 className="footer-heading">Về Shopeee</h4>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu về Shopeee</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản Shopeee</a></li>
              <li><a href="#">Flash Sale</a></li>
              <li><a href="#">Kênh người bán</a></li>
              <li><a href="#">Liên hệ truyền thông</a></li>
            </ul>
          </div>

          {/* Payment & Shipping */}
          <div className="footer-col">
            <h4 className="footer-heading">Thanh toán</h4>
            <div className="payment-logos">
              {['💳 Thẻ tín dụng', '🏧 ATM nội địa', '💰 COD', '📱 MoMo', '🏦 VNPay'].map(p => (
                <span key={p} className="payment-chip">{p}</span>
              ))}
            </div>
            <h4 className="footer-heading" style={{ marginTop: '16px' }}>Đơn vị vận chuyển</h4>
            <div className="payment-logos">
              {['🚚 Giao hàng nhanh', '📦 Giao hàng tiết kiệm', '⚡ Hỏa tốc'].map(s => (
                <span key={s} className="payment-chip">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 Shopeee. Tất cả các quyền được bảo lưu.</p>
          <p>Địa chỉ: Tầng 18, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Q.10, TP.HCM</p>
        </div>
      </div>
    </footer>
  );
}
