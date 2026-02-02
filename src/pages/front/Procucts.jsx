import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Products() {
  const [products, setProducts] = useState([]);
  const addingByProductId = useSelector(
    (state) => state.cart.addingByProductId,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
        setProducts(res.data.products);
      } catch (error) {
        alert(error.response?.data?.message || "取得產品失敗");
      }
    };
    getProducts();
  }, []);

  const handleView = async (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div className="container py-5">
        <h1 className="mb-4">產品列表</h1>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="p-3">
                  <img
                    src={product.imageUrl}
                    className="rounded object-fit-cover w-100"
                    style={{ height: "350px" }}
                    alt={product.title}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text mb-4">
                    價格：NT${product.price} / {product.unit}
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-50"
                      onClick={() => handleView(product.id)}
                    >
                      查看更多
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary w-50"
                      // onClick={() => addCart(product.id)}
                      onClick={() =>
                        dispatch(addToCart({ productId: product.id, qty: 1 }))
                      }
                      disabled={!!addingByProductId[product.id]}
                    >
                      {addingByProductId[product.id]
                        ? "加入中..."
                        : "加入購物車"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
