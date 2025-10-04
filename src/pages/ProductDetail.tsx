import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import sampleProducts from "../data/sampleProducts";

type Product = {
  id: number | string;
  name: string;
  price?: number;
  image?: string;
  description?: string;
  [key: string]: unknown;
};

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Product>(`http://localhost:3000/products/${id}`);
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) {
          // fallback: try sampleProducts (useful when json-server is not running)
          const pid = Number(id);
          const found = sampleProducts.find((s) => String(s.id) === String(id) || s.id === pid);
          if (found) {
            setProduct(found as Product);
          } else {
            setError("Không tìm thấy sản phẩm.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return null;

  function addToCart() {
    if (!product) return toast.error("Sản phẩm không tồn tại");
    try {
      const raw = localStorage.getItem("cart:v1");
      const cart: Array<{ id: number | string; qty: number; name?: string; price?: number }> = raw ? JSON.parse(raw) : [];
      const existing = cart.find((c) => String(c.id) === String(product.id));
      if (existing) existing.qty += 1;
      else cart.push({ id: product.id, qty: 1, name: product.name, price: typeof product.price === "number" ? product.price : undefined });
      localStorage.setItem("cart:v1", JSON.stringify(cart));
      toast.success("Đã thêm vào giỏ hàng");
    } catch (e) {
      toast.error("Không thể thêm vào giỏ");
    }
  }

  return (
    <div className="container">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/List">Sản phẩm</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          {product.image ? (
            <img src={String(product.image)} alt={product.name} className="img-fluid rounded border" />
          ) : (
            <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ height: 360 }}>
              <span className="text-muted">Không có ảnh</span>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <h1 className="h3">{product.name}</h1>
          {typeof product.price === "number" && (
            <div className="h4 text-primary mb-3">{product.price.toLocaleString("vi-VN")}₫</div>
          )}
          <p className="text-muted">{product.description || ""}

            <h1>iPhone 16e, iPhone 16, iPhone 17, </h1>
          </p>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" onClick={addToCart}>Thêm vào giỏ</button>
            <Link to="/List" className="btn btn-outline-secondary">Quay lại danh sách</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

