import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isFaq = location.pathname === "/faq";
  const isInspiration = location.pathname === "/inspiration";
  const isAbout = location.pathname === "/about";
  const isAuth = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password"].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${isHome || isAuth || isFaq || isInspiration || isAbout ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      {!isAuth && <Footer />}
    </div>
  );
};

export default Layout;
