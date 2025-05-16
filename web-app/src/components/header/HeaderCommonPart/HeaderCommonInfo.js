import React, { useState, useEffect } from "react";
import shopeeLogiImg from "../../../assets/images/header/header__cart/image-white-logo.jpg";
import { FaFacebookF, FaInstagram, FaBell, FaQuestionCircle, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "./HeaderCommonInfo.css";
import { handleLogoutAPI, fetchMyInfo, fetchCartByUserId, fetchProductVariantById } from "../../../apis";

const HeaderCommonInfo = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [cartPreview, setCartPreview] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      const encoded = encodeURIComponent(searchValue.trim());
      window.location.href = `/product/searchByName/${encoded}`;
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchMyInfo().then(async user => {
          if (user && user.username) setUsername(user.username);
          if (user && user.id) {
            const cart = await fetchCartByUserId(user.id);
            setCartCount(cart?.cartItems?.length || 0);
          }
        });
      }
    };

    fetchCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleLogout = async () => {
    await handleLogoutAPI();
    window.location.href = "/login";
  };

  // Xử lý hover vào icon giỏ hàng
  const handleCartHover = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const user = await fetchMyInfo();
      if (user && user.id) {
        const cart = await fetchCartByUserId(user.id);
        const items = cart?.cartItems || [];
        // Lấy thông tin variant cho từng cartItem
        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const variant = await fetchProductVariantById(item.variantId);
            return {
              ...item,
              variant
            };
          })
        );
        setCartPreview(detailedItems);
        setShowCartPreview(true);
      }
    }
  };

  const handleCartLeave = () => {
    setShowCartPreview(false);
  };

  return (
    <header className="header-common">
      <div className="header-top">
        <div className="header-top-left">
          <a href="#">Kênh Người Bán</a>
          <span>|</span>
          <a href="#">Trở Thành Người Bán Shopee</a>
          <span>|</span>
          <a href="#">Tải Ứng Dụng</a>
          <span>|</span>
          <a href="#">Kết Nối</a>
          <FaFacebookF className="header-icon" />
          <FaInstagram className="header-icon" />
        </div>
        <div className="header-top-right">
          <FaBell className="header-icon" />
          <a href="#">Thông Báo</a>
          <FaQuestionCircle className="header-icon" />
          <a href="#">Hỗ Trợ</a>
          <span>|</span>
          <div className="header-user-dropdown">
            <span
              className="header-link-bold"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                padding: "0 8px",
                borderRadius: "2px",
                background: showMenu ? "#f5f5f5" : "transparent",
                color: showMenu ? "#ee4d2d" : "#fff"
              }}
            >
              <FaUserCircle style={{ marginRight: 4 }} />
              {username || "guest"}
            </span>
            <div className="dropdown-menu">
              <a href="/profile">Tài Khoản Của Tôi</a>
              <a href="/orders">Đơn Mua</a>
              <a href="#" onClick={handleLogout}>Đăng Xuất</a>
            </div>
          </div>
        </div>
      </div>
      <div className="header-main">
        <div className="header-logo">
          <a href="/">
            <img src={shopeeLogiImg} alt="Shopee" />
          </a>
        </div>
        <div className="header-search">
          <input
            type="text"
            placeholder="VOUCHER HOÀN 999K XU - SĂN NGAY"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch}>
            <svg width="20" height="20" fill="#fff">
              <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="2" fill="none" />
              <line x1="15" y1="15" x2="19" y2="19" stroke="#fff" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <div
  className="header-cart-wrapper"
  style={{ position: "relative", display: "inline-block" }}
  onMouseEnter={handleCartHover}
  onMouseLeave={handleCartLeave}
>
  <div className="header-cart">
    <FaShoppingCart size={28} />
    <span className="cart-badge">{cartCount}</span>
  </div>
  {showCartPreview && cartPreview.length > 0 && (
    <div className="cart-preview-popup">
      <div className="cart-preview-title">Sản Phẩm Mới Thêm</div>
      {cartPreview.map((item, idx) => (
        <div className="cart-preview-item" key={item.cartItemId || idx}>
          <img
            src={item.variant.productVariantImage}
            alt={item.variant.variantValue}
            className="cart-preview-img"
          />
          <span className="cart-preview-name">{item.variant.variantValue}</span>
          <span className="cart-preview-price">
            {item.variant.price?.toLocaleString()}₫
          </span>
        </div>
      ))}
      <a href="/cart" className="cart-preview-btn">Xem Giỏ Hàng</a>
    </div>
  )}
</div>
      </div>
      <div className="header-suggest">
        <a href="#">Giày đá bóng nam</a>
        <a href="#">Giá đỡ laptop</a>
        <a href="#">Kệ để laptop</a>
        <a href="#">Kệ tản nhiệt laptop</a>
        <a href="#">Sạc laptop asus</a>
        <a href="#">Giá đỡ laptop gỗ</a>
        <a href="#">Kệ macbook</a>
      </div>
    </header>
  );
};

export default HeaderCommonInfo;