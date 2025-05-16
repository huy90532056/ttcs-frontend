import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductsBySearch, fetchCategories, fetchProductsBySearchAndSort } from "../../../apis";
import "./SearchProductItems.css";

const sortOptions = [
  { label: "Phổ Biến", value: "popular" },
  { label: "Mới Nhất", value: "newest" },
  { label: "Bán Chạy", value: "bestseller" },
  { label: "Giá", value: "price" },
];

const SearchProductItems = () => {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("popular");
  const [priceOrder, setPriceOrder] = useState("asc");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  // Lấy danh mục
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetchCategories();
      setCategories(res || []);
    };
    getCategories();
  }, []);

  // Lấy sản phẩm theo từ khóa tìm kiếm và sort
  useEffect(() => {
    const getProductsAndTags = async () => {
      let res;
      if (sort === "price") {
        res = await fetchProductsBySearchAndSort({
          pageNo: 1,
          pageSize: 20,
          sortDir: priceOrder,
          search: decodeURIComponent(keyword || ""),
        });
      } else {
        res = await fetchProductsBySearch({
          pageNo: 1,
          pageSize: 20,
          search: decodeURIComponent(keyword || ""),
        });
      }
      setProducts(res?.items || []);

      // Tổng hợp tag từ sản phẩm
      if (Array.isArray(res?.items)) {
        const tagMap = {};
        res.items.forEach((product) => {
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
    };
    getProductsAndTags();
  }, [keyword, sort, priceOrder]);

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

  // Lọc sản phẩm theo tag nếu có chọn tag
  const displayedProducts = selectedTag
    ? products.filter((p) =>
        Array.isArray(p.tags) && p.tags.some((t) => t.tagId === selectedTag)
      )
    : products;

  return (
    <div className="catprod-container">
      {/* Sidebar */}
      <aside className="catprod-sidebar">
        <div className="catprod-sidebar-title">Tất Cả Danh Mục</div>
        <ul className="catprod-sidebar-list">
          {displayedCategories.map((cat) => (
            <li
              key={cat.categoryId}
              onClick={() => navigate(`/category/${cat.categoryId}`)}
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
          {displayedProducts.map((product) => (
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

export default SearchProductItems;