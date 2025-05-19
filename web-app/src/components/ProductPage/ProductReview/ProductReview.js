import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviewsByProductId, fetchUserById, createReview, fetchMyInfo, deleteReviewById } from "../../../apis";
import "./ProductReview.css";

const ProductReview = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [userMap, setUserMap] = useState({});
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [myInfo, setMyInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReviewsByProductId(productId);
        setReviews(data);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverage(avg);
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

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const info = await fetchMyInfo();
        setMyInfo(info);
      } catch {
        setMyInfo(null);
      }
    };
    fetchMe();
  }, []);

  const starCounts = [5, 4, 3, 2, 1].map(
    star => reviews.filter(r => r.rating === star).length
  );

  const filteredReviews =
    selectedStar === 0
      ? reviews
      : reviews.filter(r => r.rating === selectedStar);

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const myInfo = await fetchMyInfo();
      const userId = myInfo.id;
      if (!userId) {
        alert("Bạn cần đăng nhập để đánh giá!");
        setSubmitting(false);
        return;
      }
      await createReview({
        userId,
        productId: Number(productId),
        comment,
        rating
      });
      setComment("");
      setRating(5);
      const data = await fetchReviewsByProductId(productId);
      setReviews(data);
    } catch (err) {
      alert("Gửi đánh giá thất bại!");
    }
    setSubmitting(false);
  };

  // Hàm xóa review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await deleteReviewById(reviewId);
      setReviews(reviews.filter(r => r.reviewId !== reviewId));
    } catch (err) {
      alert("Xóa đánh giá thất bại!");
    }
  };

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
            <div className="review-comment">
              {r.comment}
              {myInfo && r.userId === myInfo.id && (
                <button
                  className="admin-user-btn delete"
                  style={{ marginLeft: 12, fontSize: 13, padding: "2px 10px" }}
                  onClick={() => handleDeleteReview(r.reviewId)}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Form tạo review - Đặt dưới danh sách review */}
      <div className="review-form" style={{ margin: "32px 0", padding: 16, background: "#fffbe6", borderRadius: 8 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Viết đánh giá của bạn:</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              style={{ cursor: "pointer", color: star <= rating ? "#faad14" : "#ccc", fontSize: 22 }}
              onClick={() => setRating(star)}
            >★</span>
          ))}
          <span>{rating} sao</span>
        </div>
        <textarea
          className="admin-user-input"
          style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
          placeholder="Nhập bình luận..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          className="admin-user-btn save"
          disabled={submitting || !comment.trim()}
          onClick={handleSubmitReview}
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
};

export default ProductReview;