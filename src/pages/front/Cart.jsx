import { useEffect } from "react";
import { currency } from "../../utils/filter";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../../store/slices/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Cart() {
  // const [cart, setCart] = useState([]);
  const cart = useSelector((state) => state.cart.cartData);
  const updatingByCartId = useSelector((state) => state.cart.updatingByCartId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleUpdateCart = async (e, cartId, productId) => {
    if (updatingByCartId[cartId]) return;

    try {
      const value = Number(e.target.value);
      const safeQty = value < 1 ? 1 : value;
      e.target.value = safeQty;
      await dispatch(
        updateCartItem({ cartId, productId, qty: safeQty }),
      ).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="container py-5">
        <h1 className="mb-4">購物車列表</h1>
        <div className="text-end mb-3">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => dispatch(clearCart())}
            disabled={cart.carts.length === 0}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">單價</th>
              <th scope="col">數量/單位</th>
              <th scope="col" className="text-end">
                小計
              </th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center">
                  購物車目前還沒有商品
                </td>
              </tr>
            ) : (
              <>
                {cart?.carts?.map((cartItem) => (
                  <tr key={cartItem.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          dispatch(deleteCartItem({ cartId: cartItem.id }))
                        }
                        disabled={!!updatingByCartId[cartItem.id]}
                      >
                        刪除
                      </button>
                    </td>
                    <th scope="row">{cartItem.product.title}</th>
                    <th scope="row">{cartItem.product.price}</th>
                    <td>
                      <div className="input-group input-group-sm mb-3">
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={cartItem.qty}
                          min="1"
                          onChange={(e) =>
                            handleUpdateCart(
                              e,
                              cartItem.id,
                              cartItem.product.id,
                            )
                          }
                        />
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-sm"
                        >
                          {cartItem.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      {currency(cartItem.final_total)}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="4">
                總計
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
