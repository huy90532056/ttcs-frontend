import React, { useState, useEffect } from "react";
import { FaBell, FaUser, FaClipboardList, FaTicketAlt, FaCoins, FaUserCircle } from "react-icons/fa";
import "./UserPageBody.css";
import {
  fetchMyInfo,
  fetchNotificationsByUserId,
  fetchOrdersByUserId,
  fetchProductVariantById,
  updateUserById,
  fetchUserVouchers,
  fetchDiscountById,
} from "../../apis";
import { useNavigate } from "react-router-dom";

const getToken = () => localStorage.getItem("accessToken");

const menuItems = [
  { key: "notification", icon: <FaBell color="#ee4d2d" />, label: "Thông Báo" },
  { key: "account", icon: <FaUser color="#1677ff" />, label: "Tài Khoản Của Tôi" },
  { key: "orders", icon: <FaClipboardList color="#1677ff" />, label: "Đơn Mua" },
  { key: "voucher", icon: <FaTicketAlt color="#ee4d2d" />, label: "Kho Voucher" },
  { key: "coin", icon: <FaCoins color="#fbc02d" />, label: "Shopee Xu" },
];

const NOTI_PAGE_SIZE = 5;
const ORDER_PAGE_SIZE = 2;
const VOUCHER_PAGE_SIZE = 3;

const UserPageBody = () => {
  const [selected, setSelected] = useState("notification");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notiPage, setNotiPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [variantCache, setVariantCache] = useState({});
  const [profile, setProfile] = useState(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);

  // Voucher state
  const [vouchers, setVouchers] = useState([]);
  const [voucherPage, setVoucherPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
      setCheckingAuth(false);
      return;
    }
    fetchMyInfo().then(userData => {
      setUser(userData);
      setCheckingAuth(false);
    });
  }, [navigate]);

  // Hàm handle khi click menu
  const handleMenuClick = async (key) => {
    setSelected(key);
    setNotiPage(1);
    setOrderPage(1);
    setVoucherPage(1);
    if (key === "notification" && user && (user.userId || user.id)) {
      const userId = user.userId || user.id;
      const noti = await fetchNotificationsByUserId(userId);
      setNotifications(noti);
    }
    if (key === "orders" && user && (user.userId || user.id)) {
      setLoadingOrders(true);
      const userId = user.userId || user.id;
      const orders = await fetchOrdersByUserId(userId);
      setOrders(orders);
      setLoadingOrders(false);
    }
    if (key === "account") {
      const userInfo = await fetchMyInfo();
      setProfile(userInfo);
      setEditing(false);
    }
    if (key === "voucher" && user && (user.userId || user.id)) {
      const userId = user.userId || user.id;
      const userVouchers = await fetchUserVouchers(userId);
      // Lấy chi tiết từng voucher, loại bỏ voucher đã dùng
      const details = await Promise.all(
        userVouchers
          .filter(v => !v.isUsed)
          .map(async (v) => {
            const info = await fetchDiscountById(v.discountId);
            // Dùng key giống bên CartPageBody.js
            return {
              ...info,
              id: v.id,
              isUsed: v.isUsed,
              percentageOff: info.percentageOff,
              discountCode: info.discountCode,
              validUntil: info.validUntil,
              minOrder: info.minOrder,
            };
          })
      );
      setVouchers(details);
    }
  };

  useEffect(() => {
    if (selected === "notification" && user && (user.userId || user.id)) {
      const userId = user.userId || user.id;
      fetchNotificationsByUserId(userId).then(setNotifications);
    }
    if (selected === "orders" && user && (user.userId || user.id)) {
      setLoadingOrders(true);
      const userId = user.userId || user.id;
      fetchOrdersByUserId(userId).then(orders => {
        setOrders(orders);
        setLoadingOrders(false);
      });
    }
    if (selected === "account") {
      fetchMyInfo().then(userInfo => {
        setProfile(userInfo);
        setEditing(false);
      });
    }
    if (selected === "voucher" && user && (user.userId || user.id)) {
      const userId = user.userId || user.id;
      fetchUserVouchers(userId).then(async userVouchers => {
        const details = await Promise.all(
          userVouchers
            .filter(v => !v.isUsed)
            .map(async (v) => {
              const info = await fetchDiscountById(v.discountId);
              // Dùng key giống bên CartPageBody.js
              return {
                ...info,
                id: v.id,
                isUsed: v.isUsed,
                percentageOff: info.percentageOff,
                discountCode: info.discountCode,
                validUntil: info.validUntil,
                minOrder: info.minOrder,
              };
            })
        );
        setVouchers(details);
      });
    }
  }, [user, selected]);

  // Fetch variant info for all items in paged orders
  useEffect(() => {
    if (selected !== "orders" || orders.length === 0) return;
    const pagedOrders = orders.slice(0, orderPage * ORDER_PAGE_SIZE);
    const variantIds = [];
    pagedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!variantCache[item.variantId]) {
          variantIds.push(item.variantId);
        }
      });
    });
    if (variantIds.length === 0) return;
    // Fetch all missing variants
    Promise.all(
      variantIds.map(variantId =>
        fetchProductVariantById(variantId).then(data => ({ variantId, data }))
      )
    ).then(results => {
      const newCache = { ...variantCache };
      results.forEach(({ variantId, data }) => {
        newCache[variantId] = data;
      });
      setVariantCache(newCache);
    });
    // eslint-disable-next-line
  }, [orders, orderPage, selected]);

    useEffect(() => {
        const selectedTab = localStorage.getItem("userpage_selected");
        if (selectedTab) {
            setSelected(selectedTab);
            localStorage.removeItem("userpage_selected");
        }
    }, []);

  if (checkingAuth) return null;

  // Lấy danh sách notification theo trang
  const pagedNotifications = notifications.slice(0, notiPage * NOTI_PAGE_SIZE);
  const hasMoreNoti = notifications.length > pagedNotifications.length;

  // Lấy danh sách order theo trang
  const pagedOrders = orders.slice(0, orderPage * ORDER_PAGE_SIZE);
  const hasMoreOrder = orders.length > pagedOrders.length;

  // Lấy danh sách voucher theo trang
  const pagedVouchers = vouchers.slice(0, voucherPage * VOUCHER_PAGE_SIZE);
  const hasMoreVoucher = vouchers.length > pagedVouchers.length;

  return (
    <div className="userpage-body-container">
      <div className="userpage-sidebar">
        <div className="userpage-profile">
          <div className="userpage-avatar">
            <FaUserCircle size={56} color="#cccccc" />
          </div>
          <div className="userpage-username">
            {user ? user.username : "Loading..."}
          </div>
          <div className="userpage-edit-profile">✏️ Sửa Hồ Sơ</div>
        </div>
        <div>
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`userpage-menu-item-btn${selected === item.key ? " selected" : ""}`}
              onClick={() => handleMenuClick(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "16px",
                outline: "none",
                textAlign: "left"
              }}
            >
              {item.icon && <span className="userpage-menu-icon" style={{ marginRight: 8 }}>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="userpage-main-content">
        {selected === "account" ? (
          <div className="userpage-profile-main">
            <div className="userpage-profile-form">
              <div className="userpage-profile-title">Hồ Sơ Của Tôi</div>
              <div className="userpage-profile-desc">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
              <div className="userpage-profile-content">
                <div className="userpage-profile-left">
                  <div className="userpage-profile-row">
                    <label>ID</label>
                    <span>{profile?.id || ""}</span>
                  </div>
                  <div className="userpage-profile-row">
                    <label>Tên đăng nhập</label>
                    <span>{profile?.username || ""}</span>
                  </div>
                  {!editing ? (
                    <>
                      <div className="userpage-profile-row">
                        <label>Họ</label>
                        <span>{profile?.lastName || "Chưa cập nhật"}</span>
                      </div>
                      <div className="userpage-profile-row">
                        <label>Tên</label>
                        <span>{profile?.firstName || "Chưa cập nhật"}</span>
                      </div>
                      <div className="userpage-profile-row">
                        <label>Địa chỉ</label>
                        <span>{profile?.address || "Chưa cập nhật"}</span>
                      </div>
                      <div className="userpage-profile-row">
                        <label>Ngày sinh</label>
                        <span>{profile?.dob || "Chưa cập nhật"}</span>
                      </div>
                      <div className="userpage-profile-row">
                        <label>Role</label>
                        <span>
                          {profile?.roles && profile.roles.length > 0
                            ? profile.roles.map(r => r.name).join(", ")
                            : "Chưa có"}
                        </span>
                      </div>
                      <button
                        className="userpage-profile-save-btn"
                        style={{ marginTop: 18 }}
                        onClick={() => {
                          setEditData({
                            firstName: profile?.firstName || "",
                            lastName: profile?.lastName || "",
                            dob: profile?.dob || "",
                            roles: profile?.roles ? profile.roles.map(r => r.name) : []
                          });
                          setEditing(true);
                        }}
                      >
                        Chỉnh sửa
                      </button>
                    </>
                  ) : (
                    <form
                      onSubmit={async e => {
                        e.preventDefault();
                        setUpdating(true);
                        try {
                          await updateUserById(profile.id, editData);
                          const userInfo = await fetchMyInfo();
                          setProfile(userInfo);
                          setEditing(false);
                        } finally {
                          setUpdating(false);
                        }
                      }}
                      style={{ marginTop: 18 }}
                    >
                      <div className="userpage-profile-row">
                        <label>Họ</label>
                        <input
                          value={editData.lastName}
                          onChange={e => setEditData({ ...editData, lastName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="userpage-profile-row">
                        <label>Tên</label>
                        <input
                          value={editData.firstName}
                          onChange={e => setEditData({ ...editData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="userpage-profile-row">
                        <label>Ngày sinh</label>
                        <input
                          type="date"
                          value={editData.dob}
                          onChange={e => setEditData({ ...editData, dob: e.target.value })}
                        />
                      </div>
                      <div className="userpage-profile-row">
                        <label>Role</label>
                        <input
                          value={editData.roles[0] || ""}
                          onChange={e => setEditData({ ...editData, roles: [e.target.value] })}
                          required
                        />
                      </div>
                      <button className="userpage-profile-save-btn" type="submit" disabled={updating}>
                        {updating ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        type="button"
                        className="userpage-profile-save-btn"
                        style={{ background: "#ccc", color: "#222", marginLeft: 12 }}
                        onClick={() => setEditing(false)}
                        disabled={updating}
                      >
                        Hủy
                      </button>
                    </form>
                  )}
                </div>
                <div className="userpage-profile-right">
                  <div className="userpage-profile-avatar-big">
                    <FaUserCircle size={100} color="#cccccc" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selected === "notification" ? (
          <div className="userpage-notification-list">
            {pagedNotifications.length === 0 ? (
              <div className="userpage-empty-state">
                <FaBell size={48} color="#cccccc" style={{ marginBottom: 16 }} />
                <div>Chưa có thông báo nào</div>
              </div>
            ) : (
              <>
                {pagedNotifications.map(noti => (
                  <div key={noti.notificationId} className="userpage-notification-card">
                    <div className="userpage-notification-avatar">
                      <FaBell size={36} />
                    </div>
                    <div className="userpage-notification-content">
                      <div className="userpage-notification-message">{noti.message}</div>
                      {noti.detail && (
                        <div className="userpage-notification-detail">{noti.detail}</div>
                      )}
                      <div className="userpage-notification-time">
                        {noti.createdAt ? noti.createdAt : ""}
                      </div>
                    </div>
                    <div className="userpage-notification-action">
                      <button className="userpage-notification-detail-btn">Xem Chi Tiết</button>
                    </div>
                  </div>
                ))}
                {hasMoreNoti && (
                  <button
                    className="userpage-notification-more-btn"
                    onClick={() => setNotiPage(notiPage + 1)}
                  >
                    Xem thêm
                  </button>
                )}
              </>
            )}
          </div>
        ) : selected === "orders" ? (
          <div className="userpage-orders-list">
            {loadingOrders ? (
              <div>Đang tải đơn hàng...</div>
            ) : pagedOrders.length === 0 ? (
              <div className="userpage-empty-state">
                <FaClipboardList size={48} color="#cccccc" style={{ marginBottom: 16 }} />
                <div>Chưa có đơn hàng nào</div>
              </div>
            ) : (
              <>
                {pagedOrders.map(order => (
                  <div key={order.orderId} className="userpage-order-card">
                    <div className="userpage-order-header">
                      <span><b>Mã đơn:</b> {order.orderId}</span>
                      <span><b>Ngày đặt:</b> {order.orderDate}</span>
                      <span><b>Trạng thái:</b> {order.status}</span>
                    </div>
                    <div className="userpage-order-body">
                      <div><b>Phương thức vận chuyển:</b> {order.shippingMethod}</div>
                      <div><b>Thanh toán:</b> {order.paymentMethod}</div>
                      <div><b>Tổng tiền:</b> {order.amount.toLocaleString()}đ</div>
                      <div className="userpage-order-items">
                        <b>Sản phẩm:</b>
                        <ul>
                          {order.items.map(item => {
                            const variant = variantCache[item.variantId];
                            return (
                              <li key={item.orderItemId} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", background: "#f7f7f7", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {variant && variant.productVariantImage ? (
                                    <img src={variant.productVariantImage} alt={variant.variantValue} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  ) : (
                                    <FaClipboardList size={28} color="#ccc" />
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 500, color: "#222" }}>
                                    {variant ? variant.variantValue : "Đang tải..."}
                                  </div>
                                  <div style={{ fontSize: 14, color: "#666" }}>
                                    SL: {item.quantity} | Tổng: {item.totalPrice.toLocaleString()}đ
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreOrder && (
                  <button
                    className="userpage-notification-more-btn"
                    onClick={() => setOrderPage(orderPage + 1)}
                  >
                    Xem thêm
                  </button>
                )}
              </>
            )}
          </div>
        ) : selected === "voucher" ? (
          <div className="userpage-voucher-list">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Danh sách Shopee Voucher của bạn</div>
            {pagedVouchers.length === 0 ? (
              <div className="userpage-empty-state" style={{ marginTop: 32 }}>
                <FaTicketAlt size={48} color="#cccccc" style={{ marginBottom: 16 }} />
                <div>Chưa có voucher nào</div>
              </div>
            ) : (
              <>
                {pagedVouchers.map((voucher, idx) => (
                  <div className="userpage-voucher-card">
                    <div>
                        <div className="voucher-title">
                        {voucher.percentageOff ? `${voucher.percentageOff}% off` : "Voucher"}
                        </div>
                        <div className="voucher-minorder">
                        Đơn Tối Thiểu {voucher.minOrder ? voucher.minOrder.toLocaleString() + "đ" : "dk"}
                        </div>
                        <div className="voucher-expiry">
                        , HSD: {voucher.validUntil ? new Date(voucher.validUntil).toLocaleDateString("vi-VN") : ""}
                        </div>
                    </div>
                    <div>
                        <div className="voucher-code">{voucher.discountCode}</div>
                    </div>
                    </div>
                ))}
                {hasMoreVoucher && (
                  <button
                    className="userpage-notification-more-btn"
                    style={{ marginTop: 12 }}
                    onClick={() => setVoucherPage(voucherPage + 1)}
                  >
                    Xem thêm
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="userpage-empty-state">
            <FaClipboardList size={48} color="#cccccc" style={{ marginBottom: 16 }} />
            <div>Chưa có cập nhật đơn hàng</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPageBody;