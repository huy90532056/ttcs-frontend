import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authenticate from "../pages/Authenticate/Authenticate";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home";
import CategoryProductPage from "../pages/CategoryProductPage/CategoryProductPage";
import LoginPage from "../pages/Login";
import ProductPage from "../pages/ProductPage/ProductPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category/:categoryId" element={<CategoryProductPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
