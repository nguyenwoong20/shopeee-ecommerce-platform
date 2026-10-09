import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, fetchFlashSale, searchProducts, fetchByCategory } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { Product } from '../types';
import './ProductListPage.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

const SORT_OPTIONS = [
  { value: 'bestseller', label: '🔥 Bán chạy' },
  { value: 'newest', label: '🆕 Mới nhất' },
  { value: 'price_asc', label: '💰 Giá tăng dần' },
  { value: 'price_desc', label: '💰 Giá giảm dần' },
  { value: 'rating', label: '⭐ Đánh giá cao' },
];

export function ProductListPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'bestseller';
  const categoryId = params.get('categoryId') ? Number(params.get('categoryId')) : null;
  const isFlashSale = location.pathname === '/products/flash-sale';

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setPage(0);
  }, [q, sort, categoryId]);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        if (isFlashSale) {
          setProducts(await fetchFlashSale());
          setTotalPages(1);
        } else if (q) {
          const r = await searchProducts(q, page, 20);
          setProducts(r.content);
          setTotalPages(r.totalPages);
        } else if (categoryId) {
          const r = await fetchByCategory(categoryId, page, 20, sort);
          setProducts(r.content);
          setTotalPages(r.totalPages);
        } else {
          const r = await fetchProducts(page, 20, sort);
          setProducts(r.content);
          setTotalPages(r.totalPages);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isFlashSale, q, sort, categoryId, page]);

  async function handleAdd(e: React.MouseEvent, p: Product) {
    e.preventDefault();
    try {
      await addToCart(p.id, 1);
      showToast(`Đã thêm "${p.name}" vào giỏ!`, 'success');
    } catch {
      showToast('Thêm vào giỏ thất bại', 'error');
    }
  }

  function setSort(s: string) {
    setParams(prev => { prev.set('sort', s); return prev; });
  }

  const pageTitle = isFlashSale
    ? '⚡ Flash Sale'
    : q
      ? `Kết quả tìm kiếm: "${q}"`
      : sort === 'newest'
        ? '🆕 Hàng mới về'
        : sort === 'bestseller'
          ? '🔥 Bán chạy nhất'
          : '🛒 Tất cả sản phẩm';

  return (
    <main className="page-content product-list-page">
      <div className="container">
        {/* Header */}
        <div className="pl-header">
          <h1 className="pl-title">{pageTitle}</h1>
          <p className="pl-count">{products.length > 0 ? `${products.length}+ sản phẩm` : ''}</p>
        </div>

        {/* Sort bar */}
        <div className="sort-bar">
          <span className="sort-label">Sắp xếp:</span>
          <div className="sort-tabs">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`sort-tab${sort === opt.value ? ' active' : ''}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid-products">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="product-card-pl skeleton-card">
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 12, width: '85%' }} />
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử từ khóa khác hoặc xem sản phẩm nổi bật của chúng tôi.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>Xem tất cả sản phẩm</Link>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(p => {
              const displayPrice = p.flashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
              const hasDiscount = p.originalPrice && p.originalPrice > displayPrice;
              return (
                <Link to={`/products/${p.id}`} key={p.id} className="product-card-pl">
                  <div className="product-img-wrap">
                    <img
                      src={p.imageUrl || `https://picsum.photos/seed/${p.id}/300/300`}
                      alt={p.name}
                      className="product-img"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.id + 100}/300/300`; }}
                    />
                    {p.flashSale && <span className="badge badge-brand flash-badge">⚡ Sale</span>}
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
                      <span className="stars">{'★'.repeat(Math.round(p.rating))}</span>
                      <span className="sold-count">Đã bán {p.sold > 999 ? `${(p.sold / 1000).toFixed(1)}k` : p.sold}</span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm add-cart-btn"
                      onClick={e => handleAdd(e, p)}
                    >
                      🛒 Thêm vào giỏ
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Trước</button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const pg = totalPages <= 7 ? i : Math.max(0, page - 3) + i;
              if (pg >= totalPages) return null;
              return (
                <button
                  key={pg}
                  className={`btn btn-sm ${pg === page ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setPage(pg)}
                >
                  {pg + 1}
                </button>
              );
            })}
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Tiếp →</button>
          </div>
        )}
      </div>
    </main>
  );
}
