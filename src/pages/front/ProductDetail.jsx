import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../store/slices/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const addingByProductId = useSelector(
    (state) => state.cart.addingByProductId,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        alert(error.response?.data?.message);
      }
    };
    getProduct(id);
  }, [id]);

  return (
    <>
      <div className="container py-5">
        <h1 className="mb-4">產品詳情</h1>
        {!product ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <div className="card mb-3">
              <div className="row g-0">
                <div className="col-lg-4">
                  <div className="p-3">
                    <img
                      src={product.imageUrl}
                      className="img-fluid rounded object-fit-cover w-100"
                      style={{ height: "500px" }}
                      alt={product.title}
                    />
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card-body">
                    <h2 className="card-title">{product.title}</h2>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      價格：NT${product.price} / {product.unit}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
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
          </>
        )}
      </div>
    </>
  );
}
