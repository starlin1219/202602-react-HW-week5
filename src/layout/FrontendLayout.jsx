import { Outlet } from "react-router";
import BaseHeader from "../components/BaseHeader";
import BaseFooter from "../components/BaseFooter";

export default function FrontendLayout() {
  return (
    <>
      <div className="front-layout-container">
        <BaseHeader />
        <main className="page-content">
          <Outlet />
        </main>
        <BaseFooter />
      </div>
    </>
  );
}
