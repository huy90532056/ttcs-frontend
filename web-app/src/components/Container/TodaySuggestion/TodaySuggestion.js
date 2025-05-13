import React, { useEffect, useState } from 'react';
import headingLabel from '../../../assets/images/container/today-suggestion/heading-label.png';
import { fetchAllProducts } from '../../../apis';
import './TodaySuggestion.css';
import { useNavigate } from 'react-router-dom';

const TodaySuggestion = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts().then(setProducts);
  }, []);

  return (
    <div className="today-suggestion-container">
      <div className="today-suggestion-header">
        <span className="today-suggestion-title">GỢI Ý HÔM NAY</span>
        <img src={headingLabel} alt="heading label" className="today-suggestion-label" />
      </div>
      <div className="today-suggestion-underline" />
      <div className="today-suggestion-products">
        {products.map(product => (
          <div
            className="today-suggestion-product-card"
            key={product.productId}
            onClick={() => navigate(`/product/${product.productId}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="today-suggestion-product-img-wrap">
              <img src={product.productImage} alt={product.productName} className="today-suggestion-product-img" />
            </div>
            <div className="today-suggestion-product-name">{product.productName}</div>
            <div className="today-suggestion-product-price">
              ₫{product.price.toLocaleString('vi-VN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySuggestion;