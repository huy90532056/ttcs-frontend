import React, { useEffect, useState } from "react";
import {
  fetchMyInfo,
  fetchCartByUserId,
  fetchProductVariantById,
  fetchUserVouchers,
  fetchDiscountById,
  createOrder,
  createOrderItem,
  applyUserDiscount,
} from "../../../apis";
import { FaTicketAlt, FaCoins, FaCheckCircle } from "react-icons/fa";
import "./PurchasePageBody.css";

const PurchasePageBody = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cart, setCart] = useState(null);
  const [variantsMap, setVariantsMap] = useState({});
  const [userVouchers, setUserVouchers] = useState([]);
  const [voucherDetails, setVoucherDetails] = useState([]);
  const [shippingFee, setShippingFee] = useState(28700);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchMyInfo();
      setUserInfo(user);

      const cartData = await fetchCartByUserId(user.id);
      setCart(cartData);

      // Lấy thông tin variant cho từng item
      const variants = {};
      if (cartData && cartData.cartItems) {
        await Promise.all(
          cartData.cartItems.map(async (item) => {
            const variant = await fetchProductVariantById(item.variantId);
            variants[item.variantId] = variant;
          })
        );
      }
      setVariantsMap(variants);

      // Lấy voucher user
      const vouchers = await fetchUserVouchers(user.id);
      setUserVouchers(vouchers);

      // Lấy chi tiết voucher từ API fetchDiscountById
      if (vouchers && vouchers.length > 0) {
        const details = await Promise.all(
          vouchers.map(async (voucher) => {
            if (
              voucher.percentageOff &&
              voucher.minimumOrderValue &&
              voucher.validUntil &&
              voucher.discountCode
            ) {
              return voucher;
            }
            if (voucher.discountId) {
              const detail = await fetchDiscountById(voucher.discountId);
              return { ...voucher, ...detail };
            }
            return voucher;
          })
        );
        setVoucherDetails(details);
      } else {
        setVoucherDetails([]);
      }
    };
    fetchData();
  }, []);

  // Tính tổng tiền hàng
  const totalProductPrice =
    cart?.cartItems?.reduce((sum, item) => {
      const variant = variantsMap[item.variantId];
      return sum + (variant ? variant.price * item.quantity : 0);
    }, 0) || 0;

  // Tính giảm giá nếu có voucher
  const discountPercent = selectedVoucher?.percentageOff || 0;
  const discountAmount = discountPercent
    ? Math.floor((totalProductPrice * discountPercent) / 100)
    : 0;

  // Tổng thanh toán
  const totalPayment = totalProductPrice - discountAmount + shippingFee;

  // Xử lý chọn voucher
  const handleUseVoucher = async (voucher) => {
    try {
      await applyUserDiscount(voucher.id);
      setSelectedVoucher(voucher);
      setShowVoucherModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
      // Cập nhật lại voucherDetails để ẩn voucher vừa dùng
      setVoucherDetails((prev) =>
        prev.map((v) =>
          v.id === voucher.id ? { ...v, isUsed: true } : v
        )
      );
    } catch (err) {
      alert("Có lỗi khi sử dụng voucher!");
    }
  };

  // Xử lý đặt hàng
  const handleOrder = async () => {
    if (!userInfo || !cart || !cart.cartItems?.length) return;
    setIsOrdering(true);
    try {
      // 1. Tạo đơn hàng
      const order = await createOrder({
        userId: userInfo.id,
        orderDate: new Date().toISOString().slice(0, 10),
        status: "PENDING",
        shippingMethod: "Vận chuyển đường bộ",
        paymentMethod: "Thanh toán khi nhận hàng",
        amount: totalPayment,
      });

      // 2. Tạo từng order item
      await Promise.all(
        cart.cartItems.map((item) =>
          createOrderItem({
            variantId: item.variantId,
            quantity: item.quantity,
            totalPrice: variantsMap[item.variantId]?.price * item.quantity,
            orderId: order.orderId,
          })
        )
      );

      setShowOrderModal(true); // Hiện modal đặt hàng thành công
    } catch (err) {
      alert("Có lỗi khi đặt hàng!");
    }
    setIsOrdering(false);
  };

  // Xử lý chuyển hướng
  const handleGoHome = () => {
    window.location.href = "/";
  };
  const handleGoOrders = () => {
    window.location.href = "/orders";
  };

  return (
    <div className="purchase-container">
      {/* Địa chỉ nhận hàng */}
      <div className="purchase-address">
        <div className="purchase-address-title">
          <span>Địa Chỉ Nhận Hàng</span>
        </div>
        <div className="purchase-address-info">
          <b>{userInfo?.username || "Chưa có tên"}</b>
          <span> {userInfo?.address || "Chưa có địa chỉ"}</span>
          <button className="purchase-address-change">Thay Đổi</button>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="purchase-products">
        <div className="purchase-products-header">
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
        </div>
        {cart?.cartItems?.map((item) => {
          const variant = variantsMap[item.variantId];
          return (
            <div className="purchase-product-item" key={item.id}>
              <img
                src={variant?.productVariantImage || ""}
                alt={variant?.variantValue || ""}
                className="purchase-product-img"
              />
              <div className="purchase-product-info">
                <div className="purchase-product-name">
                  {variant?.variantValue}
                </div>
                <div className="purchase-product-desc">
                  Loại: {variant?.variantValue}
                </div>
              </div>
              <div className="purchase-product-price">
                {variant?.price?.toLocaleString("vi-VN")} ₫
              </div>
              <div className="purchase-product-qty">{item.quantity}</div>
              <div className="purchase-product-total">
                {(variant?.price * item.quantity)?.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          );
        })}
        <div className="purchase-products-total">
          <span>
            Tổng số tiền ({cart?.cartItems?.length || 0} sản phẩm):
          </span>
          <span className="purchase-products-total-value">
            {totalPayment?.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      {/* Shopee Voucher */}
      <div className="purchase-voucher">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaTicketAlt style={{ color: "#ee4d2d" }} /> Shopee Voucher
        </span>
        <button
          className="purchase-voucher-btn"
          onClick={() => setShowVoucherModal(true)}
        >
          Xem mã của bạn
        </button>
      </div>

      {/* Modal voucher */}
      {showVoucherModal && (
        <div className="voucher-modal-overlay">
          <div className="voucher-modal">
            <div className="voucher-modal-header">
              <span>Danh sách Shopee Voucher của bạn</span>
              <button
                className="voucher-modal-close"
                onClick={() => setShowVoucherModal(false)}
              >
                ×
              </button>
            </div>
            <div className="voucher-modal-list">
              {voucherDetails.filter(v => !v.isUsed).length === 0 && (
                <div
                  style={{
                    padding: 24,
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Bạn chưa có voucher nào.
                </div>
              )}
              <div className="voucher-modal-grid voucher-modal-grid-single">
                {voucherDetails
                  .filter(voucher => !voucher.isUsed)
                  .map((voucher, idx) => (
                  <div className="voucher-card" key={voucher.id || idx}>
                    <div className="voucher-card-left">
                      <div className="voucher-card-percent">
                        {voucher.percentageOff
                          ? `${voucher.percentageOff}% off`
                          : "Voucher"}
                      </div>
                      <div className="voucher-card-condition">
                        Đơn Tối Thiểu{" "}
                        {voucher.minimumOrderValue
                          ? voucher.minimumOrderValue.toLocaleString("vi-VN") +
                            "₫"
                          : "Không có"}
                      </div>
                      <div className="voucher-card-expiry">
                        HSD:{" "}
                        {voucher.validUntil
                          ? new Date(
                              voucher.validUntil
                            ).toLocaleDateString("vi-VN")
                          : "Không xác định"}
                      </div>
                    </div>
                    <div className="voucher-card-right">
                      <button
                        className="voucher-card-save"
                        onClick={() => handleUseVoucher(voucher)}
                      >
                        {voucher.discountCode || "Không có mã"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="voucher-modal-footer">
              <button
                className="voucher-modal-ok"
                onClick={() => setShowVoucherModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopee Xu */}
      <div className="purchase-coin">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaCoins style={{ color: "#fbc02d" }} /> Shopee Xu
        </span>
      </div>
      {/* Phương thức thanh toán */}
      <div
        className="purchase-payment"
        style={{
          background: "#fffdfa",
          borderRadius: 6,
          margin: "32px 0 0 0",
          padding: 0,
          border: "none",
          boxShadow: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "32px 36px 0 36px",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          <span>Phương thức thanh toán</span>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontWeight: 400, fontSize: 16 }}>
              Thanh toán khi nhận hàng
            </span>
            <button
              className="purchase-payment-change"
              style={{
                color: "#1677ff",
                background: "none",
                border: "none",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
                padding: 0,
              }}
            >
              THAY ĐỔI
            </button>
          </div>
        </div>
        <div
          style={{
            margin: "32px 0 0 0",
            padding: "0 36px",
            background: "#fffdfa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 340,
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#888", fontSize: 16 }}>
                Tổng tiền hàng
              </span>
              <span style={{ fontSize: 16 }}>
                {totalProductPrice?.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            {selectedVoucher && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 340,
                  marginBottom: 12,
                }}
              >
                <span style={{ color: "#ee4d2d", fontSize: 16 }}>
                  Giảm giá ({selectedVoucher.percentageOff}%)
                </span>
                <span style={{ color: "#ee4d2d", fontSize: 16 }}>
                  -{discountAmount?.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 340,
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#888", fontSize: 16 }}>
                Tổng tiền phí vận chuyển
              </span>
              <span style={{ fontSize: 16 }}>
                {shippingFee?.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 340,
                alignItems: "center",
                marginBottom: 0,
              }}
            >
              <span style={{ color: "#888", fontSize: 16 }}>
                Tổng thanh toán
              </span>
              <span
                style={{
                  color: "#ee4d2d",
                  fontWeight: 500,
                  fontSize: 32,
                }}
              >
                {totalPayment?.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "0 36px 36px 36px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            background: "#fffdfa",
          }}
        >
          <span style={{ color: "#888", fontSize: 15, marginRight: "auto" }}>
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Shopee
          </span>
          <button
            className="purchase-order-btn"
            style={{
              background: "#ee4d2d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "12px 48px",
              fontWeight: 500,
              fontSize: 18,
              cursor: isOrdering ? "not-allowed" : "pointer",
              marginLeft: 24,
              opacity: isOrdering ? 0.7 : 1,
              transition: "background 0.2s, filter 0.2s",
              filter: isOrdering ? "brightness(0.95)" : undefined,
            }}
            disabled={isOrdering}
            onClick={handleOrder}
            onMouseOver={e => {
              if (!isOrdering) e.currentTarget.style.background = "#ff6a39";
            }}
            onMouseOut={e => {
              if (!isOrdering) e.currentTarget.style.background = "#ee4d2d";
            }}
          >
            {isOrdering ? "Đang đặt..." : "Đặt hàng"}
          </button>
        </div>
      </div>

      {/* Toast thông báo voucher thành công */}
      {showSuccessToast && (
        <div className="shopee-toast-success">
          <FaCheckCircle className="shopee-toast-success-icon" />
          <span>Áp dụng voucher thành công!</span>
        </div>
      )}

      {/* Modal đặt hàng thành công */}
      {showOrderModal && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="order-modal-header">
              <span className="order-modal-icon">!</span>
              <span className="order-modal-title">Đặt hàng thành công</span>
            </div>
            <div className="order-modal-desc">
              Cùng Shopee bảo vệ quyền lợi của bạn - Thường xuyên kiểm tra tin nhắn từ Người bán tại Shopee Chat / 
              Chi nhận & thanh toán khi đơn mua ở trạng thái "Đang giao hàng".
            </div>
            <div className="order-modal-actions">
              <button className="order-modal-btn" onClick={handleGoHome}>Trang chủ</button>
              <button className="order-modal-btn" onClick={handleGoOrders}>Đơn mua</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasePageBody;