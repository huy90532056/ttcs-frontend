import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../apis";
import { Link } from "react-router-dom";
import "./TopSearch.css";

const TopSearch = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchAllProducts();
      setProducts(data.slice(0, 6)); // Lấy top 6 sản phẩm
    };
    getProducts();
  }, []);

  const getFirstThreeWords = (name) => {
    return name.split(" ").slice(0, 3).join(" ");
  };

  return (
    <div className="top-search-container">
      <h2 className="top-search-title">TÌM KIẾM HÀNG ĐẦU</h2>
      <div className="top-search-list">
        {products.map((product) => (
          <Link
            to={`/product/searchByName/${getFirstThreeWords(product.productName)}`}            className="top-search-item"
            key={product.productId}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="top-search-card">
              <div className="top-search-badge">TOP</div>
              <img
                src={product.productImage}
                alt={product.productName}
                className="top-search-img"
              />
              <div className="top-search-sold">
                Bán 126000+ / tháng
              </div>
              <div className="top-search-name">{getFirstThreeWords(product.productName)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopSearch;
