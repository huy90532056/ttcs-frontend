import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductDetail, fetchProductsByCategory } from "../../../apis";
import "./SimilarProduct.css";

const SimilarProduct = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
  window.scrollTo(0, 0); // Thêm dòng này để cuộn lên đầu trang
  const fetchData = async () => {
    // Lấy chi tiết sản phẩm để lấy categoryId
    const product = await fetchProductDetail(productId);
    const category = product.categories?.[0];
    if (category) {
      setCategoryId(category.categoryId);
      // Lấy danh sách sản phẩm cùng category
      const productList = await fetchProductsByCategory(category.categoryId);
      // Lọc bỏ sản phẩm hiện tại khỏi danh sách
      setProducts(productList.filter(p => p.productId !== Number(productId)));
    }
  };
  fetchData();
}, [productId]);

  return (
    <div className="similar-product-container">
      <h3 className="similar-product-title">CÓ THỂ BẠN CŨNG THÍCH</h3>
      <div className="similar-product-list">
        {products.map(product => (
          <Link
            to={`/product/${product.productId}`}
            className="similar-product-card"
            key={product.productId}
          >
            <img
              src={product.productImage}
              alt={product.productName}
              className="similar-product-img"
            />
            <div className="similar-product-name">{product.productName}</div>
            <div className="similar-product-price">
              {product.price.toLocaleString()}₫
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProduct;