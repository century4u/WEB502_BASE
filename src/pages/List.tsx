import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import sampleProducts from "../data/sampleProducts";

type Product = {
  id: number | string;
  name: string;
  price?: number;
  image?: string;
  [key: string]: unknown;
};

export default function List() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, ] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = useMemo(() => {
    const p = Number(searchParams.get("page") || 1);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const PER_PAGE = 8;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get<Product[]>("http://localhost:3000/products", {
          params: { _page: currentPage, _limit: PER_PAGE, q: query || undefined },
        });
        if (!isMounted) return;
        const data = res.data ?? [];
        // If API returns empty and we're on page 1, fall back to sample data
        if (!data.length && currentPage === 1) {
          setProducts(sampleProducts.slice(0, PER_PAGE));
          setTotalItems(sampleProducts.length);
        } else {
          setProducts(data);
          const totalHeader = res.headers?.["x-total-count"] || res.headers?.["X-Total-Count"];
          setTotalItems(totalHeader ? Number(totalHeader) : data.length || 0);
        }
      } catch (err) {
        if (isMounted) {
          // Use sample data when server is unreachable
          setProducts(sampleProducts.slice(0, PER_PAGE));
          setTotalItems(sampleProducts.length);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [currentPage, query]);

  const totalPages = useMemo(() => (totalItems ? Math.max(1, Math.ceil(totalItems / PER_PAGE)) : 1), [totalItems]);

  function goToPage(page: number) {
    const next = Math.min(Math.max(1, page), totalPages);
    const nextParams = new URLSearchParams(searchParams as unknown as string);
    nextParams.set("page", String(next));
    setSearchParams(nextParams, { replace: false });
  }

  function onSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>("input[name=q]");
    const val = (input?.value || "").trim();
    const nextParams = new URLSearchParams(searchParams as unknown as string);
    if (val) nextParams.set("q", val);
    else nextParams.delete("q");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  function handleCardClick(id: Product["id"]) {
    navigate(`/products/${id}`);
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Danh sách sản phẩm</h1>
        <form className="d-flex" onSubmit={onSubmitSearch} role="search">
          <input
            name="q"
            defaultValue={query}
            className="form-control"
            placeholder="Tìm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
          />
          <button type="submit" className="btn btn-primary ms-2">Tìm</button>
        </form>
      </div>

      {!products.length ? (
        <div className="text-center text-muted">
          <h5>Chưa có sản phẩm</h5>
          <p>Hãy thêm sản phẩm mới ở mục "Thêm mới".</p>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {products.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm" role="button" onClick={() => handleCardClick(p.id)}>
                  {p.image ? (
                    <img
                      src={String(p.image)}
                      className="card-img-top"
                      alt={p.name || "Hình ảnh sản phẩm"}
                      style={{ objectFit: "cover", height: 180 }}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 180 }}>
                      <span className="text-muted">Không có ảnh</span>
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1" title={String(p.name)}>{p.name}</h5>
                    {typeof p.price === "number" && (
                      <p className="card-text text-primary fw-semibold mb-2">{p.price.toLocaleString("vi-VN")}₫</p>
                    )}
                    <div className="mt-auto d-flex">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={(e) => { e.stopPropagation(); handleCardClick(p.id); }}>Xem</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={(e) => e.stopPropagation()}>Sửa</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4" aria-label="Pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${(Number(searchParams.get("page") || 1) === 1) ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(Number(searchParams.get("page") || 1) - 1)}>«</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${(Number(searchParams.get("page") || 1) === p) ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${(Number(searchParams.get("page") || 1) === totalPages) ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(Number(searchParams.get("page") || 1) + 1)}>»</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

