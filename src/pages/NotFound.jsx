import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const notfoundTimeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(notfoundTimeout);
  }, [navigate]);

  return (
    <>
      <div className="bg-primary-subtle d-flex justify-content-center align-items-center vh-100">
        <h1>Oops 找不到頁面...</h1>
      </div>
    </>
  );
}
