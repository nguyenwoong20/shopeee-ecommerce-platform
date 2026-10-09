import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { Product } from '../types';
import './ProductDetailPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(Number(id))
      .then(p => {
        setProduct(p);
        setImgIdx(0);
        // fetch related
        fetchProducts(0, 8, 'bestseller').then(r => setRelated(r.content.filter(x => x.id !== p.id).slice(0, 8))).catch(() => {});
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleAddCart() {
    if (!product) return;
    try {
      await addToCart(product.id, qty);
      showToast(`Đã thêm ${qty} sản phẩm vào giỏ!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Thêm vào giỏ thất bại', 'error');
    }
  }

  async function handleBuyNow() {
    if (!product) return;
    try {
      await addToCart(product.id, qty);
      navigate('/cart');
    } catch (e: any) {
      showToast(e.message || 'Có lỗi xảy ra', 'error');
    }
  }

  if (loading) {
    return (
      <main className="page-content">
        <div className="container">
          <div className="pd-layout">
            <div className="skeleton" style={{ height: 420, borderRadius: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[80, 40, 60, 30, 100].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: i === 2 ? 40 : 16, width: `${w}%`, borderRadius: 8 }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const displayPrice = product.flashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
  const hasDiscount = product.originalPrice && product.originalPrice > displayPrice;
  const images = product.imageUrls
    ? product.imageUrls.split(',').map(s => s.trim()).filter(Boolean)
    : [product.imageUrl || `https://picsum.photos/seed/${product.id}/500/500`];

  return (
    <main className="page-content">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>›</span>
          <Link to="/products">Sản phẩm</Link>
          {product.categoryName && <>
            <span>›</span>
            <Link to={`/products?categoryId=${product.categoryId}`}>{product.categoryName}</Link>
          </>}
          <span>›</span>
          <span className="bc-current">{product.name}</span>
        </nav>

        {/* Main layout */}
        <div className="pd-layout">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-img-wrap">
              <img
                src={images[imgIdx] || `https://picsum.photos/seed/${product.id}/500/500`}
                alt={product.name}
                className="pd-main-img"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id + 50}/500/500`; }}
              />
              {product.flashSale && <span className="pd-flash-badge">⚡ Flash Sale</span>}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb${i === imgIdx ? ' active' : ''}`}
                    onClick={() => setImgIdx(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`}
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id + i}/80/80`; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.brand && <p className="pd-brand">{product.brand}</p>}
            <h1 className="pd-name">{product.name}</h1>

            {/* Rating & sold */}
            <div className="pd-meta-row">
              <div className="pd-rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span className="pd-rating-val">{product.rating.toFixed(1)}</span>
                <span className="pd-review-count">({product.reviewCount} đánh giá)</span>
              </div>
              <div className="pd-divider" />
              <span className="pd-sold">Đã bán: <strong>{product.sold.toLocaleString('vi-VN')}</strong></span>
            </div>

            {/* Price */}
            <div className="pd-price-box">
              <span className="pd-price">{fmt(displayPrice)}</span>
              {hasDiscount && (
                <div className="pd-discount-row">
                  <span className="price-original" style={{ fontSize: 16 }}>{fmt(product.originalPrice!)}</span>
                  {product.discountPercent && (
                    <span className="discount-tag" style={{ fontSize: 13, padding: '3px 8px' }}>-{product.discountPercent}%</span>
                  )}
                </div>
              )}
              {product.flashSale && product.flashSaleEnd && (
                <p className="pd-flash-note">⚡ Flash Sale kết thúc lúc {new Date(product.flashSaleEnd).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
              )}
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <div className="pd-stock">
                <span className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
                  {product.stock > 0 ? `✅ Còn hàng (${product.stock} sản phẩm)` : '❌ Hết hàng'}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Số lượng:</span>
              <div className="qty-picker">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input
                  type="number"
                  className="qty-input"
                  value={qty}
                  min={1}
                  max={product.stock || 99}
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                />
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button className="btn btn-outline btn-lg pd-btn-cart" onClick={handleAddCart}>
                🛒 Thêm vào giỏ
              </button>
              <button className="btn btn-primary btn-lg pd-btn-buy" onClick={handleBuyNow}>
                Mua ngay
              </button>
            </div>

            {/* Perks */}
            <div className="pd-perks">
              {[
                { icon: '🚚', text: 'Miễn phí vận chuyển đơn từ 150k' },
                { icon: '🔄', text: 'Đổi trả trong 15 ngày' },
                { icon: '✅', text: 'Hàng chính hãng 100%' },
              ].map(p => (
                <div key={p.text} className="perk-item">
                  <span>{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="pd-desc-box">
            <h2 className="pd-section-title">📋 Mô tả sản phẩm</h2>
            <p className="pd-desc-text">{product.description}</p>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-section-title">🛍 Sản phẩm liên quan</h2>
            <div className="grid-products">
              {related.map(p => {
                const dp = p.flashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
                return (
                  <Link to={`/products/${p.id}`} key={p.id} className="product-card-pl" onClick={() => window.scrollTo(0, 0)}>
                    <div className="product-img-wrap">
                      <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/300/300`} alt={p.name} className="product-img" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.id + 100}/300/300`; }}
                      />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <span className="price">{fmt(dp)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
