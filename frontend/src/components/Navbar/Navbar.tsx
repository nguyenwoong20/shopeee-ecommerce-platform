import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css';

export function Navbar() {
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { count, refreshCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => { refreshCount(); }, [refreshCount]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍</span>
          <span className="logo-text">Shopeee</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            id="search-input"
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Tìm kiếm">
            🔍
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/orders" className="nav-action-btn" id="orders-btn" title="Đơn hàng">
            📦
            <span className="nav-action-label">Đơn hàng</span>
          </Link>
          <Link to="/cart" className="nav-action-btn cart-btn" id="cart-btn" title="Giỏ hàng">
            🛒
            {count > 0 && <span className="cart-badge">{count > 99 ? '99+' : count}</span>}
            <span className="nav-action-label">Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* Category bar */}
      <div className="navbar-cats">
        <div className="container">
          <nav className="cats-nav">
            {[['/', 'Trang chủ'], ['/products?sort=newest', '🆕 Hàng mới'], ['/products?sort=bestseller', '🔥 Bán chạy'],
              ['/products/flash-sale', '⚡ Flash Sale'], ['/products?categoryId=1', '📱 Điện tử'],
              ['/products?categoryId=2', '👗 Thời trang'], ['/products?categoryId=3', '💄 Làm đẹp'],
              ['/products?categoryId=4', '🍎 Thực phẩm']].map(([href, label]) => (
              <Link key={href} to={href} className="cat-link">{label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
