import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCartByUserId,
  fetchProductVariantById,
  fetchMyInfo,
  updateCartItem,
  deleteCartItem,
  fetchUserVouchers,
  fetchDiscountById,
} from "../../../apis";
import "./CartPageBody.css";
import { FaTicketAlt } from "react-icons/fa";

const CartPageBody = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [variantsMap, setVariantsMap] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null });
  const [userVouchers, setUserVouchers] = useState([]);
  const [user, setUser] = useState(null);
  const [voucherDetails, setVoucherDetails] = useState([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Reload cart and variants
  const reloadCart = async () => {
    setLoading(true);
    const userInfo = await fetchMyInfo();
    setUser(userInfo);
    if (!userInfo?.id) return;
    const cartData = await fetchCartByUserId(userInfo.id);
    setCart(cartData);

    const map = {};
    await Promise.all(
      (cartData.cartItems || []).map(async (item) => {
        const variant = await fetchProductVariantById(item.variantId);
        map[item.variantId] = variant;
      })
    );
    setVariantsMap(map);
    setSelectedItems((cartData.cartItems || []).map((item) => item.cartItemId));
    setLoading(false);
  };

  useEffect(() => {
    reloadCart();
    // Lấy voucher của user
    const fetchVouchers = async () => {
      const userInfo = await fetchMyInfo();
      setUser(userInfo);
      if (userInfo?.id) {
        const vouchers = await fetchUserVouchers(userInfo.id);
        setUserVouchers(vouchers || []);
      }
    };
    fetchVouchers();
  }, []);

  // Lấy chi tiết voucher
  useEffect(() => {
    const fetchAllVoucherDetails = async () => {
      if (!userVouchers.length) {
        setVoucherDetails([]);
        return;
      }
      // Lấy chi tiết từng voucher (không gộp)
      const details = await Promise.all(
  userVouchers.map(async (v) => {
    const info = await fetchDiscountById(v.discountId);
    return { ...info, id: v.id, isUsed: v.isUsed }; // Thêm isUsed vào đây
  })
);
      setVoucherDetails(details);
    };
    fetchAllVoucherDetails();
  }, [userVouchers]);

  // Tăng/giảm số lượng
  const handleChangeQuantity = async (item, delta) => {
    if (item.quantity === 1 && delta === -1) {
      setConfirmDelete({ open: true, item });
      return;
    }
    // Gọi API update
    const updated = await updateCartItem(item.cartItemId, item.quantity + delta);
    // Cập nhật lại cart state tại chỗ, không reload toàn bộ
    setCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart.cartItems.map((ci) =>
        ci.cartItemId === item.cartItemId
          ? { ...ci, quantity: updated.quantity }
          : ci
      ),
    }));
  };

  // Xác nhận xóa
  const handleDelete = async () => {
    if (confirmDelete.item) {
      await deleteCartItem(confirmDelete.item.cartItemId);
      setConfirmDelete({ open: false, item: null });
      // Cập nhật lại cart state tại chỗ, không reload toàn bộ
      setCart((prevCart) => ({
        ...prevCart,
        cartItems: prevCart.cartItems.filter(
          (ci) => ci.cartItemId !== confirmDelete.item.cartItemId
        ),
      }));
      setSelectedItems((prev) =>
        prev.filter((id) => id !== confirmDelete.item.cartItemId)
      );
    }
  };

  if (loading || !cart)
    return <div>Đang tải giỏ hàng...</div>;

  // Tính tổng tiền
  const total = (cart.cartItems || [])
    .filter((item) => selectedItems.includes(item.cartItemId))
    .reduce((sum, item) => {
      const variant = variantsMap[item.variantId];
      return sum + (variant?.price || 0) * item.quantity;
    }, 0);

  return (
    <div className="cartpage-container">
      {/* Modal xác nhận xóa */}
      {confirmDelete.open && (
        <div className="cartpage-modal-overlay">
          <div className="cartpage-modal">
            <div className="cartpage-modal-title">
              Bạn chắc chắn muốn bỏ sản phẩm này?
            </div>
            <div className="cartpage-modal-desc">
              {variantsMap[confirmDelete.item.variantId]?.variantValue}
            </div>
            <div className="cartpage-modal-actions">
              <button className="cartpage-modal-confirm" onClick={handleDelete}>
                Có
              </button>
              <button
                className="cartpage-modal-cancel"
                onClick={() => setConfirmDelete({ open: false, item: null })}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
  <div className="voucher-modal-overlay">
    <div className="voucher-modal">
      <div className="voucher-modal-header">
        <span>Danh sách Shopee Voucher của bạn</span>
        <button className="voucher-modal-close" onClick={() => setShowVoucherModal(false)}>×</button>
      </div>
      <div className="voucher-modal-list">
        {voucherDetails.filter(v => !v.isUsed).length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
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
                    {voucher.percentageOff}% off
                  </div>
                  <div className="voucher-card-condition">
                    Đơn Tối Thiểu đk
                  </div>
                  <div className="voucher-card-expiry">
                    , HSD: {new Date(voucher.validUntil).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="voucher-card-right">
                  <button className="voucher-card-save" disabled>
                    {voucher.discountCode}
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
      <div className="voucher-modal-footer">
        <button className="voucher-modal-ok" onClick={() => setShowVoucherModal(false)}>
          Đóng
        </button>
      </div>
    </div>
  </div>
)}

      <div className="cartpage-table">
        <div className="cartpage-header-row">
          <div className="cartpage-col cartpage-col-checkbox">
            Tất Cả Sản Phẩm
          </div>
          <div className="cartpage-col">Đơn Giá</div>
          <div className="cartpage-col">Số Lượng</div>
          <div className="cartpage-col">Số Tiền</div>
          <div className="cartpage-col">Thao Tác</div>
        </div>
        {(cart.cartItems || []).map((item) => {
          const variant = variantsMap[item.variantId];
          return (
            <div className="cartpage-item-row" key={item.cartItemId}>
              <div className="cartpage-col cartpage-col-checkbox">
                <Link to={`/product/${variant?.productId}`}>
                  <img
                    src={variant?.productVariantImage}
                    alt="sp"
                    className="cartpage-item-img"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
                <div className="cartpage-item-info">
                  <div className="cartpage-item-title">
                    {variant?.variantValue}
                  </div>
                  <div className="cartpage-item-sku">
                    Phân Loại Hàng: {variant?.variantName}
                  </div>
                </div>
              </div>
              <div className="cartpage-col">
                <span className="cartpage-item-oldprice">
                  {variant?.oldPrice
                    ? variant.oldPrice.toLocaleString() + "₫"
                    : ""}
                </span>
                <span className="cartpage-item-price">
                  {variant?.price?.toLocaleString()}₫
                </span>
              </div>
              <div className="cartpage-col">
                <div className="cartpage-qty-group">
                  <button
                    className="cartpage-qty-btn"
                    onClick={async (e) => {
                      e.currentTarget.blur();
                      await handleChangeQuantity(item, -1);
                    }}
                  >
                    -
                  </button>
                  <input
                    className="cartpage-qty-input"
                    type="text"
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    className="cartpage-qty-btn"
                    onClick={async (e) => {
                      e.currentTarget.blur();
                      await handleChangeQuantity(item, 1);
                    }}
                    disabled={item.quantity >= (variant?.stockQuantity || 0)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cartpage-col">
                <span className="cartpage-item-total">
                  {(variant?.price * item.quantity).toLocaleString()}₫
                </span>
              </div>
              <div className="cartpage-col">
                <button
                  className="cartpage-item-remove"
                  onClick={() => setConfirmDelete({ open: true, item })}
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cartpage-footer">
        <div className="cartpage-footer-left">
          <div className="cartpage-voucher-bar">
            <span className="cartpage-voucher-icon"><FaTicketAlt style={{ color: "#ee4d2d" }} /> Shopee Voucher</span>
            <a
              className="cartpage-voucher-link"
              href="#"
              onClick={e => {
                e.preventDefault();
                setShowVoucherModal(true);
              }}
            >
              Xem mã của bạn
            </a>
          </div>
        </div>
        <div className="cartpage-footer-right">
          <span>
            Tổng cộng ({cart.cartItems?.length || 0} sản phẩm):{" "}
            <span className="cartpage-footer-total">
              {total.toLocaleString()}₫
            </span>
          </span>
          <button
            className="cartpage-footer-buy"
            onClick={() => navigate("/purchase")}
          >
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPageBody;