import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import ProductModal from "../components/ProductModal";
import Pagination from "../components/Pagination";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  deliveryTemperature: "",
};

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [templatepProduct, setTemplateProduct] = useState(
    INITIAL_TEMPLATE_DATA,
  );
  const [pagination, setPagination] = useState({});
  const [modalType, setModalType] = useState("");

  const productModalRef = useRef(null);

  const getProducts = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );

      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert(error.response?.data.message || "取得產品失敗");
    }
  }, []);

  useEffect(() => {
    (async () => await getProducts())();

    productModalRef.current = new Modal("#productModal", {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    const modalElement = document.querySelector("#productModal");
    const modalHandler = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };
    modalElement?.addEventListener("hide.bs.modal", modalHandler);

    return () => {
      modalElement?.removeEventListener("hide.bs.modal", modalHandler);
    };
  }, [getProducts]);

  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });

    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-3">產品列表</h2>
        <div className="text-end mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>
        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">分類</th>
              <th scope="col">產品名稱</th>
              <th scope="col">原價</th>
              <th scope="col">售價</th>
              <th scope="col">是否啟用</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td className={`${product.is_enabled && "text-success"}`}>
                  {product.is_enabled ? "啟用" : "未啟用"}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal("delete", product)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>

      {/* Modal */}
      <ProductModal
        modalType={modalType}
        templatepProduct={templatepProduct}
        getProducts={getProducts}
        closeModal={closeModal}
      />
    </>
  );
}
