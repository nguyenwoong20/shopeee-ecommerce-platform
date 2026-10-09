import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { fetchFeatured, fetchFlashSale, fetchCategories, fetchProducts } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { Product, Category } from '../types';

// ─── Price formatter ───────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

// ─── ProductCard mini ─────────────────────────────────────────────────────────
function ProductCard({ p }: { p: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  async function handleAdd() {
    try {
      await addToCart(p.id, 1);
      showToast(`Đã thêm "${p.name}" vào giỏ!`, 'success');
    } catch {
      showToast('Thêm vào giỏ thất bại', 'error');
    }
  }

  const displayPrice = p.flashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
  const hasDiscount = p.originalPrice && p.originalPrice > displayPrice;

  return (
    <Link to={`/products/${p.id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={p.imageUrl || `https://picsum.photos/seed/${p.id}/300/300`}
          alt={p.name}
          className="product-img"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.id + 100}/300/300`; }}
        />
        {p.flashSale && <span className="badge badge-brand flash-badge">⚡ Flash Sale</span>}
        {p.discountPercent && !p.flashSale && (
          <span className="badge badge-brand flash-badge">-{p.discountPercent}%</span>
        )}
      </div>
      <div className="product-info">
        <p className="product-name">{p.name}</p>
        <div className="product-price-row">
          <span className="price">{fmt(displayPrice)}</span>
          {hasDiscount && <span className="price-original">{fmt(p.originalPrice!)}</span>}
        </div>
        <div className="product-meta">
          <span className="stars">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
          <span className="sold-count">Đã bán {p.sold > 999 ? `${(p.sold / 1000).toFixed(1)}k` : p.sold}</span>
        </div>
        <button
          className="btn btn-primary btn-sm add-cart-btn"
          onClick={e => { e.preventDefault(); handleAdd(); }}
        >
          🛒 Thêm
        </button>
      </div>
    </Link>
  );
}

// ─── FlashSale countdown ───────────────────────────────────────────────────────
function Countdown({ end }: { end: string }) {
  const calc = useCallback(() => {
    const diff = new Date(end).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  }, [end]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span className="countdown">
      <span className="cd-block">{pad(time.h)}</span>
      <span className="cd-sep">:</span>
      <span className="cd-block">{pad(time.m)}</span>
      <span className="cd-sep">:</span>
      <span className="cd-block">{pad(time.s)}</span>
    </span>
  );
}

// ─── Hero Banner ───────────────────────────────────────────────────────────────
const BANNERS = [
  { bg: 'linear-gradient(135deg,#EE4D2D,#FF8C42)', emoji: '🛍', title: 'Mua Sắm Mỗi Ngày', sub: 'Flash Sale giảm đến 80%', cta: 'Mua ngay', href: '/products/flash-sale' },
  { bg: 'linear-gradient(135deg,#667eea,#764ba2)', emoji: '📱', title: 'Điện Tử Chính Hãng', sub: 'iPhone, Samsung, Laptop...', cta: 'Khám phá', href: '/products?categoryId=1' },
  { bg: 'linear-gradient(135deg,#11998e,#38ef7d)', emoji: '💄', title: 'Làm Đẹp & Skincare', sub: 'Hàng nội địa Hàn, Nhật', cta: 'Xem ngay', href: '/products?categoryId=3' },
];

function HeroBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[idx];
  return (
    <div className="hero-banner" style={{ background: b.bg }}>
      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-sub">{b.sub}</p>
          <h1 className="hero-title">{b.title}</h1>
          <Link to={b.href} className="btn btn-lg hero-btn">{b.cta} →</Link>
        </div>
        <div className="hero-emoji">{b.emoji}</div>
      </div>
      <div className="hero-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === idx ? ' active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Category icons ────────────────────────────────────────────────────────────
const CAT_ICONS: Record<string, string> = {
  'Điện tử': '📱', 'Thời trang': '👗', 'Làm đẹp': '💄', 'Thực phẩm': '🍎',
  'Nhà cửa': '🏠', 'Thể thao': '⚽', 'Sách': '📚', 'Đồ chơi': '🎮',
};

// ─── HomePage ─────────────────────────────────────────────────────────────────
export function HomePage() {
  const [flashItems, setFlashItems] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [flashEnd] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 3);
    return d.toISOString();
  });

  useEffect(() => {
    fetchFlashSale().then(setFlashItems).catch(() => {});
    fetchFeatured().then(setFeatured).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
    fetchProducts(0, 10, 'newest').then(r => setNewArrivals(r.content)).catch(() => {});
  }, []);

  return (
    <main className="page-content home-page">
      {/* Hero */}
      <HeroBanner />

      <div className="container home-sections">
        {/* Categories */}
        {categories.length > 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">🗂 <span className="accent">Danh mục</span> nổi bật</h2>
              <Link to="/products" className="section-link">Xem tất cả →</Link>
            </div>
            <div className="cat-grid">
              {categories.slice(0, 8).map(c => (
                <Link key={c.id} to={`/products?categoryId=${c.id}`} className="cat-item">
                  <span className="cat-icon">{CAT_ICONS[c.name] || c.icon || '📦'}</span>
                  <span className="cat-name">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Flash Sale */}
        {flashItems.length > 0 && (
          <section className="home-section flash-section">
            <div className="section-header">
              <h2 className="section-title flash-title">
                ⚡ <span className="accent">Flash Sale</span>
                <Countdown end={flashEnd} />
              </h2>
              <Link to="/products/flash-sale" className="section-link">Xem thêm →</Link>
            </div>
            <div className="scroll-row">
              {flashItems.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">🔥 <span className="accent">Sản phẩm</span> nổi bật</h2>
              <Link to="/products?sort=bestseller" className="section-link">Xem thêm →</Link>
            </div>
            <div className="grid-products">
              {featured.slice(0, 10).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* New arrivals */}
        {newArrivals.length > 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">🆕 <span className="accent">Hàng mới</span> về</h2>
              <Link to="/products?sort=newest" className="section-link">Xem thêm →</Link>
            </div>
            <div className="grid-products">
              {newArrivals.slice(0, 10).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* If no data yet, show skeleton */}
        {flashItems.length === 0 && featured.length === 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">🔥 <span className="accent">Sản phẩm</span> nổi bật</h2>
            </div>
            <div className="grid-products">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="product-card skeleton-card">
                  <div className="skeleton" style={{ height: 180 }} />
                  <div className="product-info">
                    <div className="skeleton" style={{ height: 14, marginBottom: 8, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust bar */}
        <section className="trust-bar">
          {[
            { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 150k' },
            { icon: '✅', title: 'Hàng chính hãng', desc: 'Cam kết 100% authentic' },
            { icon: '🔄', title: 'Đổi trả dễ dàng', desc: '15 ngày đổi trả miễn phí' },
            { icon: '🔒', title: 'Thanh toán an toàn', desc: 'Bảo mật SSL 256-bit' },
          ].map(item => (
            <div key={item.title} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div>
                <p className="trust-title">{item.title}</p>
                <p className="trust-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
