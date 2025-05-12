import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductsByCategory,
  fetchCategories,
  fetchProductsSortedByPrice,
  fetchProductsByTag
} from "../../../apis";
import "./CategoryProduct.css";

const sortOptions = [
  { label: "Phổ Biến", value: "popular" },
  { label: "Mới Nhất", value: "newest" },
  { label: "Bán Chạy", value: "bestseller" },
  { label: "Giá", value: "price" },
];

const CategoryProductItems = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("popular");
  const [priceOrder, setPriceOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  // Lấy danh mục
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetchCategories();
      setCategories(res || []);
    };
    getCategories();
  }, []);

  // Lấy sản phẩm và tổng hợp tag từ sản phẩm trong category
  useEffect(() => {
    const getProductsAndTags = async () => {
      let res = [];
      if (selectedTag) {
        res = await fetchProductsByTag(selectedTag);
      } else if (sort === "price") {
        res = await fetchProductsSortedByPrice(1, 20, priceOrder);
      } else {
        res = await fetchProductsByCategory(categoryId);
      }
      setProducts(res || []);

      // Tổng hợp tag từ sản phẩm (chỉ khi không lọc theo tag)
      if (!selectedTag && Array.isArray(res)) {
        const tagMap = {};
        res.forEach((product) => {
          if (Array.isArray(product.tags)) {
            product.tags.forEach((tag) => {
              if (tag && tag.tagId && !tagMap[tag.tagId]) {
                tagMap[tag.tagId] = tag;
              }
            });
          }
        });
        setTags(Object.values(tagMap));
      }
      // Nếu đang lọc theo tag thì giữ nguyên tags cũ
    };
    getProductsAndTags();
    // eslint-disable-next-line
  }, [categoryId, sort, priceOrder, selectedTag]);

  const handleSort = (value) => {
    setSort(value);
    setSelectedTag(null);
    if (value !== "price") setPriceOrder("asc");
  };

  const handlePriceSort = () => {
    setSort("price");
    setSelectedTag(null);
    setPriceOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleTagClick = (tagId) => {
    setSelectedTag(tagId === selectedTag ? null : tagId);
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="catprod-container">
      {/* Sidebar */}
      <aside className="catprod-sidebar">
        <div className="catprod-sidebar-title">Tất Cả Danh Mục</div>
        <ul className="catprod-sidebar-list">
          {displayedCategories.map((cat) => (
            <li
              key={cat.categoryId}
              className={cat.categoryId === categoryId ? "active" : ""}
              onClick={() => {
                setSelectedTag(null);
                navigate(`/category/${cat.categoryId}`);
              }}
              style={{ cursor: "pointer" }}
            >
              {cat.categoryName}
            </li>
          ))}
          {!showAllCategories && categories.length > 6 && (
            <li
              className="catprod-sidebar-more"
              style={{ cursor: "pointer", color: "#888" }}
              onClick={() => setShowAllCategories(true)}
            >
              Thêm <span style={{ fontSize: 12 }}>▼</span>
            </li>
          )}
          {showAllCategories && categories.length > 6 && (
            <li
              className="catprod-sidebar-more"
              style={{ cursor: "pointer", color: "#888" }}
              onClick={() => setShowAllCategories(false)}
            >
              Thu gọn <span style={{ fontSize: 12 }}>▲</span>
            </li>
          )}
        </ul>
        <div className="catprod-filter-title">BỘ LỌC TÌM KIẾM</div>
        <div className="catprod-filter-group">
          <div className="catprod-filter-label">Theo Tag</div>
          {tags.length === 0 && <div style={{ color: "#888" }}>Không có tag nào</div>}
          {tags.map((tag) => (
            <div key={tag.tagId}>
              <input
                type="checkbox"
                checked={selectedTag === tag.tagId}
                onChange={() => handleTagClick(tag.tagId)}
                id={`tag-${tag.tagId}`}
              />
              <label htmlFor={`tag-${tag.tagId}`}>{tag.tagName}</label>
            </div>
          ))}
        </div>
        <div className="catprod-filter-group">
          <div className="catprod-filter-label">Nơi Bán</div>
          <div><input type="checkbox" /> Hà Nội</div>
          <div><input type="checkbox" /> TP. Hồ Chí Minh</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="catprod-main">
        <div className="catprod-sortbar">
          {sortOptions.map((opt) =>
            opt.value === "price" ? (
              <button
                key={opt.value}
                className={`catprod-sort-btn${sort === opt.value ? " active" : ""}`}
                onClick={handlePriceSort}
              >
                Giá
                {sort === "price" && (
                  <span style={{ marginLeft: 4 }}>
                    {priceOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </button>
            ) : (
              <button
                key={opt.value}
                className={`catprod-sort-btn${sort === opt.value ? " active" : ""}`}
                onClick={() => handleSort(opt.value)}
              >
                {opt.label}
              </button>
            )
          )}
          <span className="catprod-sort-paging">1/1</span>
          <button className="catprod-sort-arrow" disabled>&lt;</button>
          <button className="catprod-sort-arrow" disabled>&gt;</button>
        </div>
        <div className="catprod-grid">
          {products.map((product) => (
            <div className="catprod-item" key={product.productId}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="catprod-img"
                />
                <div className="catprod-name">{product.productName}</div>
              </div>
              <div className="catprod-price">{product.price.toLocaleString()}₫</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryProductItems;