import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviewsByProductId, fetchUserById } from "../../../apis";
import "./ProductReview.css";

const ProductReview = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [userMap, setUserMap] = useState({});
  const [selectedStar, setSelectedStar] = useState(0); // 0: tất cả, 1-5: số sao

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReviewsByProductId(productId);
        setReviews(data);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverage(avg);

          // Lấy danh sách userId duy nhất
          const userIds = [...new Set(data.map(r => r.userId))];
          const userPromises = userIds.map(id => fetchUserById(id));
          const users = await Promise.all(userPromises);
          const map = {};
          users.forEach(u => {
            map[u.id] = u.username;
          });
          setUserMap(map);
        } else {
          setAverage(0);
        }
      } catch {
        setReviews([]);
        setAverage(0);
      }
    };
    fetchData();
  }, [productId]);

  // Đếm số review theo từng số sao
  const starCounts = [5, 4, 3, 2, 1].map(
    star => reviews.filter(r => r.rating === star).length
  );

  // Lọc review theo số sao
  const filteredReviews =
    selectedStar === 0
      ? reviews
      : reviews.filter(r => r.rating === selectedStar);

  return (
    <div className="review-container">
      <h2 className="review-title">ĐÁNH GIÁ SẢN PHẨM</h2>
      <div className="review-summary">
        <div className="review-average">
          <span className="review-average-score">{average.toFixed(1)}</span>
          <span className="review-average-max">trên 5</span>
          <div className="review-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.round(average) ? "star filled" : "star"}>★</span>
            ))}
          </div>
          <div className="review-count">{reviews.length} đánh giá</div>
        </div>
        <div className="review-filter">
          <button
            className={selectedStar === 0 ? "filter-btn active" : "filter-btn"}
            onClick={() => setSelectedStar(0)}
          >
            Tất Cả
          </button>
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <button
              key={star}
              className={selectedStar === star ? "filter-btn active" : "filter-btn"}
              onClick={() => setSelectedStar(star)}
            >
              {star} Sao ({starCounts[idx]})
            </button>
          ))}
        </div>
      </div>
      <div className="review-list">
        {filteredReviews.map((r) => (
          <div className="review-item" key={r.reviewId}>
            <div className="review-user">
              <div className="review-avatar">{userMap[r.userId]?.charAt(0).toUpperCase() || "?"}</div>
              <div>
                <div className="review-username">{userMap[r.userId] || r.userId}</div>
                <div className="review-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r.rating ? "star filled" : "star"}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="review-comment">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReview;