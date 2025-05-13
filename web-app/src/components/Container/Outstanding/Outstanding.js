import React, { useEffect, useState } from "react";
import {
  OutstandingHeaderPicture,
  OutstandingFooterPicture,
} from "../../../assets/images/container";
import "./Outstanding.css";
import { fetchAllProducts } from "../../../apis";
import { Link } from "react-router-dom";

const Outstanding = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div className="outstanding-container">
      <div className="outstanding-header">
        <img src={OutstandingHeaderPicture} alt="Header" />
      </div>
      <div className="outstanding-body">
        <div className="outstanding-body-top">
          <span className="outstanding-title">SẢN PHẨM BÁN CHẠY</span>
          <span className="outstanding-title outstanding-title--brand">THƯƠNG HIỆU NỔI BẬT</span>
        </div>
        <div className="outstanding-products">
          {products.map((item) => (
            <Link
              to={`/product/${item.productId}`}
              key={item.productId}
              className="outstanding-product-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="outstanding-product">
                {/* Nếu có discount thì hiển thị */}
                {/* <div className="outstanding-discount">{item.discount}% GIẢM</div> */}
                <img src={item.productImage} alt={item.productName} />
                <div className="outstanding-product-name">{item.productName}</div>
                <div className="outstanding-product-price">
                  {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="outstanding-footer">
        <img src={OutstandingFooterPicture} alt="Footer" />
      </div>
    </div>
  );
};

export default Outstanding;