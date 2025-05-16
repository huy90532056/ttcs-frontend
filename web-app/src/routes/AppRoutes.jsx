import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authenticate from "../pages/Authenticate/Authenticate";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home";
import CategoryProductPage from "../pages/CategoryProductPage/CategoryProductPage";
import LoginPage from "../pages/Login";
import ProductPage from "../pages/ProductPage/ProductPage";
import SearchProductPage from "../pages/SearchProductPage/SearchProductPage";
import ShopOwnerPage from "../pages/ShopOwnerPage/ShopOwnerPage";
import CartPage from "../pages/CartPage/CartPage";
import PurchasePage from "../pages/PurchasePage/PurchasePage";

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
        <Route path="/product/searchByName/:keyword" element={<SearchProductPage />} />
        <Route path="/myshop/:inventoryId" element={<ShopOwnerPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/purchase" element={<PurchasePage />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;
