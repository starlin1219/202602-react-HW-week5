import { useEffect, useState } from "react";
import axios from "axios";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductModal({
  modalType,
  templatepProduct,
  getProducts,
  closeModal,
}) {
  const [tempData, setTempData] = useState(templatepProduct);

  useEffect(() => {
    setTempData(templatepProduct);
  }, [templatepProduct]);

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    setTempData((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages[index] = value;

      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      if (
        value === "" &&
        newImages.length > 1 &&
        newImages[newImages.length - 1] === ""
      ) {
        newImages.pop();
      }

      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const handleAddImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.push("");
      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const handleRemoveImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.pop();
      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const updateProduct = async (id) => {
    let url;
    let method;

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    } else if (modalType === "create") {
      url = `${API_BASE}/api/${API_PATH}/admin/product`;
      method = "post";
    }

    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        is_enabled: tempData.is_enabled ? 1 : 0,
        imagesUrl: tempData.imagesUrl.filter((url) => url !== ""),
      },
    };

    try {
      await axios[method](url, productData);
      getProducts();
      closeModal();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (method === "post" ? "產品新增失敗" : "產品更新失敗"),
      );
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "刪除產品失敗");
    }
  };

  const uploadImage = async (e) => {
    const file = e.target?.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTempData((pre) => ({
        ...pre,
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "上傳圖片失敗");
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog ${modalType === "delete" ? "" : "modal-xl"}`}
      >
        <div className="modal-content">
          <div
            className={`modal-header bg-${
              modalType === "delete" ? "danger" : "dark"
            } text-white`}
          >
            <h1 className="modal-title fs-5" id="productModalLabel">
              {modalType === "delete"
                ? "刪除"
                : modalType === "edit"
                  ? "編輯"
                  : "新增"}
              產品
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="fs-4">
                確定要刪除
                <span className="text-danger">{tempData.title}</span>
                嗎？
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        className="form-control"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => uploadImage(e)}
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        value={tempData.imageUrl}
                        placeholder="請輸入圖片連結"
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    {tempData.imageUrl && (
                      <img
                        className="img-fluid mb-3"
                        src={tempData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {tempData.imagesUrl?.map((url, index) => (
                      <div key={index} className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          圖片{index + 1}
                        </label>
                        <input
                          type="url"
                          className="form-control mb-2"
                          value={url}
                          placeholder={`圖片網址${index + 1}`}
                          onChange={(e) =>
                            handleModalImageChange(index, e.target.value)
                          }
                        />
                        {url && (
                          <img
                            className="img-fluid"
                            src={url}
                            alt={`副圖${index + 1}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="d-flex gap-2">
                    {tempData.imagesUrl.length < 5 &&
                      tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          className="btn btn-outline-primary btn-sm d-block w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}

                    {tempData.imagesUrl.length > 0 && (
                      <button
                        className="btn btn-outline-danger btn-sm d-block w-100"
                        onClick={handleRemoveImage}
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      value={tempData.title}
                      placeholder="請輸入標題"
                      onChange={(e) => handleModalInputChange(e)}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        value={tempData.category}
                        placeholder="請輸入分類"
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        value={tempData.unit}
                        placeholder="請輸入單位"
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        value={tempData.origin_price}
                        placeholder="請輸入原價"
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        value={tempData.price}
                        placeholder="請輸入售價"
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      value={tempData.description}
                      placeholder="請輸入產品描述"
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      value={tempData.content}
                      placeholder="請輸入說明內容"
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={tempData.is_enabled}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="deliveryTemperature">
                      配送溫層
                    </label>
                    <select
                      id="deliveryTemperature"
                      name="deliveryTemperature"
                      className="form-select"
                      aria-label="Default select"
                      value={tempData.deliveryTemperature}
                      onChange={(e) => handleModalInputChange(e)}
                    >
                      <option value="">請選擇</option>
                      <option value="room temperature">常溫</option>
                      <option value="chilling">冷藏</option>
                      <option value="freezing">冷凍</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteProduct(tempData.id)}
              >
                刪除
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateProduct(tempData.id)}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
