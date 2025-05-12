import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../../apis/index";
import "./Directory.css";
import { useNavigate } from "react-router-dom";


const ITEMS_PER_PAGE = 16; // 2 hàng x 8 cột

const Directory = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories();
        // Sắp xếp cố định theo tên để không bị thay đổi vị trí khi chuyển trang
        setCategories(
          [...res].sort((a, b) => a.categoryName.localeCompare(b.categoryName))
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    getCategories();
  }, []);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, categories.length - ITEMS_PER_PAGE)
    );
  };

  const visibleCategories = categories.slice(startIdx, startIdx + ITEMS_PER_PAGE);

   return (
    <div className="directory-container">
      <div className="directory-title">DANH MỤC</div>
      <div className="directory-carousel">
        <div style={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {startIdx > 0 && (
            <button className="directory-arrow left" onClick={handlePrev}>
              &#8592;
            </button>
          )}
        </div>
        <div className="directory-grid">
          {visibleCategories.map((cat) => (
            <div
              className="directory-item"
              key={cat.categoryId}
              onClick={() => navigate(`/category/${cat.categoryId}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="directory-img-wrapper">
                <img src={cat.categoryImagePath} alt={cat.categoryName} className="directory-img" />
              </div>
              <div className="directory-name">{cat.categoryName}</div>
            </div>
          ))}
        </div>
        <div style={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {startIdx + ITEMS_PER_PAGE < categories.length && (
            <button className="directory-arrow right" onClick={handleNext}>
              &#8594;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;