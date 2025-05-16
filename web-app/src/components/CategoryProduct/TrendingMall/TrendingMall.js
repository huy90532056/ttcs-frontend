import React from "react";
import "./TrendingMall.css";

const trendingMallImages = [
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/24bd084d-2a40-4e6e-bf71-3f71614a234c.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/5f515dc0-4b4d-4894-ae0f-03de98058d2c.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/f306bd7b-dba8-4d18-808e-ac78759c4b71.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/a7e0aca2-e893-4c95-8b59-fe79d85b6256.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/1aae567b-36cb-4b06-8713-8019afb991e6.jpg"
];

const TrendingMall = () => {
  return (
    <div className="trending-mall-container">
      <h2 className="trending-mall-title">SIÊU SHOP THỊNH HÀNH - BUNG DEAL SIÊU PHẨM</h2>
      <div className="trending-mall-list">
        {trendingMallImages.map((url, idx) => (
          <div className="trending-mall-item" key={idx}>
            <img src={url} alt={`Trending mall ${idx + 1}`} className="trending-mall-img" />
            {/* Có thể thêm tên shop hoặc giá ở đây nếu muốn */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMall;