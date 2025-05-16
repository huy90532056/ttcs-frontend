import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../../../apis";
import "./CartPageSimilarProduct.css";

const CartPageSimilarProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts || []);
    };
    fetchData();
  }, []);

  return (
    <div className="cartpage-similar-container">
      <h2 className="cartpage-similar-title">GỢI Ý CHO BẠN</h2>
      <div className="cartpage-similar-list">
        {products.map((product) => (
          <Link
            to={`/product/${product.productId}`}
            className="cartpage-similar-item"
            key={product.productId}
          >
            <img
              src={product.productImage}
              alt={product.productName}
              className="cartpage-similar-img"
            />
            <div className="cartpage-similar-name">{product.productName}</div>
            <div className="cartpage-similar-price">
              {product.price?.toLocaleString()}₫
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CartPageSimilarProduct;