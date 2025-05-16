import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../../apis';
import { FiRefreshCw } from 'react-icons/fi';
import './SearchingTrend.css';
import { Link } from 'react-router-dom';

const SearchingTrend = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    getCategories();
  }, []);

  return (
    <div className="searching-trend-container">
      <div className="searching-trend-header">
        <span className="searching-trend-title">XU HƯỚNG TÌM KIẾM</span>
        <a href="#" className="searching-trend-more">
          <FiRefreshCw style={{ marginRight: 4 }} />
          Xem thêm
        </a>
      </div>
      <div className="searching-trend-list">
  {categories.slice(0, 5).map((category, idx) => (
    <Link
      to={`/category/${category.categoryId}`}
      key={category.categoryId}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className={`searching-trend-item${idx === 3 ? ' highlight-green' : ''}${idx === 4 ? ' highlight-red' : ''}`}
      >
        <img
          src={category.categoryImagePath}
          alt={category.categoryName}
          className="searching-trend-img"
        />
        <div className="searching-trend-name" title={category.categoryName}>
          {category.categoryName}
        </div>
        <div className="searching-trend-desc">Sản phẩm nổi bật</div>
        {idx === 4 && (
          <span className="searching-trend-label">MỚI</span>
        )}
      </div>
    </Link>
  ))}
</div>
    </div>
  );
};

export default SearchingTrend;