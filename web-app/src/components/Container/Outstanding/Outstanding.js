import React, { useEffect, useState } from "react";
import {
  OutstandingHeaderPicture,
  OutstandingFooterPicture,
} from "../../../assets/images/container";
import "./Outstanding.css";
import { fetchAllProducts, fetchAllInventories } from "../../../apis";
import { Link } from "react-router-dom";

const Outstanding = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const productsData = await fetchAllProducts();
      setProducts(productsData.slice(0, 3));
      const brandsData = await fetchAllInventories();
      setBrands(brandsData.slice(0, 3));
    };
    getData();
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
          {/* Sản phẩm bán chạy */}
          {products.map((item) => (
            <Link
              to={`/product/${item.productId}`}
              key={item.productId}
              className="outstanding-product-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="outstanding-product">
                <div className="outstanding-product-img-wrap">
                  <img src={item.productImage} alt={item.productName} className="outstanding-product-img" />
                </div>
                <div className="outstanding-product-name">{item.productName}</div>
                <div className="outstanding-product-price">
                  {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </div>
              </div>
            </Link>
          ))}
          {/* Thương hiệu nổi bật */}
          {brands.map((brand) => (
            <Link
              to={`/myshop/${brand.inventoryId}`}
              key={brand.inventoryId}
              className="outstanding-brand-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="outstanding-brand">
                <div className="outstanding-brand-img-wrap">
                  <img
                    src={brand.inventoryImagePath}
                    alt={brand.inventoryName || "brand"}
                    className="outstanding-brand-img"
                  />
                </div>
                <div className="outstanding-brand-name">{brand.inventoryName}</div>
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