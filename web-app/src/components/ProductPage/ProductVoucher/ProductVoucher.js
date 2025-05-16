import React, { useEffect, useState } from "react";
import { fetchDiscounts, claimUserDiscount, fetchMyInfo } from "../../../apis";
import "./ProductVoucher.css";

const ProductVoucher = () => {
  const [discounts, setDiscounts] = useState([]);
  const [claimed, setClaimed] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchMyInfo();
      setUserId(user.id);

      const data = await fetchDiscounts();
      
      setDiscounts(data);

      // Nếu muốn load các voucher đã lưu, có thể gọi thêm API ở đây và setClaimed
    };
    fetchData();
  }, []);

  const handleClaim = async (discountId) => {
    if (!userId) return;
    await claimUserDiscount({ userId, discountId });
    setClaimed((prev) => ({ ...prev, [discountId]: true }));
  };

  return (
    <div className="voucher-container">
      <div className="voucher-title">Voucher của Shop</div>
      {discounts.slice(0, 2).map((v, idx) => (
  <div className="voucher-card" key={v.discountId}>
    <div className="voucher-info">
      <div className="voucher-value">
        {/* Ví dụ: 20% off hoặc 20k off */}
        {v.percentageOff
          ? `${v.percentageOff}% giảm giá`
          : "Voucher"}
      </div>
      <div className="voucher-condition">
        Đơn Tối Thiểu ₫50k
      </div>
      <div className="voucher-expiry">
        HSD: {v.validUntil && new Date(v.validUntil).toLocaleDateString("vi-VN")}
      </div>
    </div>
    <div className="voucher-action">
      <div className="voucher-quantity">x 3</div>
      <button
        className={`voucher-btn${claimed[v.discountId] ? " claimed" : ""}`}
        onClick={() => !claimed[v.discountId] && handleClaim(v.discountId)}
        disabled={claimed[v.discountId]}
      >
        {claimed[v.discountId] ? "Dùng ngay" : "Lưu"}
      </button>
    </div>
  </div>
))}
    </div>
  );
};

export default ProductVoucher;