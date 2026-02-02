import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;

export default function Login() {
  const { setIsAuth } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, data);
      console.log(res.data);

      const { token, expired } = res.data;
      console.log(token, expired);

      /* eslint-disable react-hooks/immutability */
      document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;

      setIsAuth(true);
      reset();
    } catch (error) {
      setIsAuth(false);
      alert(error.response?.data?.message || "登入失敗");
    }
  };

  return (
    <>
      <section className="bg-primary-subtle">
        <div className="container">
          <div className="login mx-auto d-flex align-items-center">
            <div className="card p-4 w-100">
              <div className="card-body">
                <h1>請先登入</h1>
                <form onSubmit={handleSubmit(handleLogin)}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      name="username"
                      id="username"
                      placeholder="name@example.com"
                      {...register("username", {
                        required: "請輸入您的電子信箱",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "電子信箱格式不正確",
                        },
                      })}
                    />
                    <label htmlFor="username">Email address</label>
                    <div className="invalid-feedback">
                      {errors.username?.message}
                    </div>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      name="password"
                      id="password"
                      placeholder="Password"
                      {...register("password", { required: "請輸入您的密碼" })}
                    />
                    <label htmlFor="password">Password</label>
                    <div className="invalid-feedback">
                      {errors.password?.message}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    登入
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
