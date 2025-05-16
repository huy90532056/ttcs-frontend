import React, { useEffect, useState } from "react";
import { fetchDiscounts, claimUserDiscount, fetchMyInfo } from "../../../apis";
import "./ShopOwnerVoucher.css";

const ShopOwnerVoucher = () => {
  const [discounts, setDiscounts] = useState([]);
  const [claimed, setClaimed] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchMyInfo();
      setUserId(user.id);

      const data = await fetchDiscounts();
      setDiscounts(data);
    };
    fetchData();
  }, []);

  const handleClaim = async (discountId) => {
    if (!userId) return;
    await claimUserDiscount({ userId, discountId });
    setClaimed((prev) => ({ ...prev, [discountId]: true }));
  };

  return (
    <div className="shop-voucher-container">
      <div className="shop-voucher-title">VOUCHER</div>
      <div className="shop-voucher-list">
        {discounts.slice(0, 3).map((v) => (
          <div className="shop-voucher-card" key={v.discountId}>
            <div className="shop-voucher-info">
              <div className="shop-voucher-value">
                {v.amountOff
                  ? `₫${v.amountOff}k off`
                  : v.percentageOff
                  ? `${v.percentageOff}% off`
                  : "Voucher"}
              </div>
              <div className="shop-voucher-condition">
                Đơn Tối Thiểu ₫{v.minOrder}k
              </div>
              <div className="shop-voucher-progress">
                <div
                  className="shop-voucher-progress-bar"
                  style={{ width: `${v.usedPercent || 0}%` }}
                ></div>
              </div>
              <div className="shop-voucher-status">
                {v.usedPercent ? `Đã dùng ${v.usedPercent}%` : ""} 
                {v.validUntil && `, HSD: ${new Date(v.validUntil).toLocaleDateString("vi-VN")}`}
              </div>
            </div>
            <div className="shop-voucher-action">
              <div className="shop-voucher-quantity">x{v.quantity || 3}</div>
              <button
                className={`shop-voucher-btn${claimed[v.discountId] ? " claimed" : ""}`}
                onClick={() => !claimed[v.discountId] && handleClaim(v.discountId)}
                disabled={claimed[v.discountId]}
              >
                {claimed[v.discountId] ? "Dùng Ngay" : "Lưu"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopOwnerVoucher;