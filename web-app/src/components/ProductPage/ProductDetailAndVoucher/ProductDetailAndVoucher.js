import React from "react";

import "./ProductDetailAndVoucher.css";
import ProductDetail from "../ProductDetail/ProductDetail";
import ProductVoucher from "../ProductVoucher/ProductVoucher";

const ProductDetailAndVoucher = () => (
  <div className="product-page-layout">
    <div className="product-main">
      <ProductDetail />
    </div>
    <div className="product-side">
      <ProductVoucher />
    </div>
  </div>
);

export default ProductDetailAndVoucher;