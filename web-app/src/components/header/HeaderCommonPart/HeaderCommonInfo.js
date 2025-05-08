import React from "react";
import shopeeLogiImg from "../../../assets/images/header/header__cart/image-white-logo.jpg";
import { FaFacebookF, FaInstagram, FaBell, FaQuestionCircle, FaShoppingCart } from "react-icons/fa";
import "./HeaderCommonInfo.css"; 
import { handleLogoutAPI } from "../../../apis";

const HeaderCommonInfo = () => {
    const handleLogout = () => {
        handleLogoutAPI();
        window.location.href = "/login";
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
          <FaFacebookF className="header-icon"/>
          <FaInstagram className="header-icon" />
        </div>
        <div className="header-top-right">
          <FaBell className="header-icon" />
          <a href="#">Thông Báo</a>
          <FaQuestionCircle className="header-icon" />
          <a href="#">Hỗ Trợ</a>
          {/* <a href="#" className="header-link-bold">Đăng Nhập</a> */}
          <span>|</span>
          <a href="#" className="header-link-bold" onClick={handleLogout}>
            Đăng Xuất
          </a>
        </div>
      </div>
      <div className="header-main">
        <div className="header-logo">
          <img src={shopeeLogiImg} alt="Shopee" />
        </div>
        <div className="header-search">
          <input type="text" placeholder="VOUCHER HOÀN 999K XU - SĂN NGAY" />
          <button>
            <svg width="20" height="20" fill="#fff"><circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="2" fill="none"/><line x1="15" y1="15" x2="19" y2="19" stroke="#fff" strokeWidth="2"/></svg>
          </button>
        </div>
        <div className="header-cart">
          <FaShoppingCart size={28} />
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