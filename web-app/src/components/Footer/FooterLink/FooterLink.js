import React from "react";
import "./FooterLink.css";

import {
    FooterLinkPaymentImage,
    FooterLinkTransportImage,
    HeaderAppGalleryIcon,
    HeaderAppStoreIcon,
    HeaderGooglePlayIcon,
    HeaderQRCodeImage,
} from "../../../assets/images";

export default function FooterLink() {
  return (
    <div className="footer-link">
      <div className="footer-link__top">
        <div className="footer-link__col">
          <div className="footer-link__title">CHĂM SÓC KHÁCH HÀNG</div>
          <ul>
            <li>Trung Tâm Trợ Giúp</li>
            <li>Shopee Blog</li>
            <li>Shopee Mall</li>
            <li>Hướng Dẫn Mua Hàng</li>
            <li>Hướng Dẫn Bán Hàng</li>
            <li>Thanh Toán</li>
            <li>Shopee Xu</li>
            <li>Vận Chuyển</li>
            <li>Trả Hàng & Hoàn Tiền</li>
            <li>Chăm Sóc Khách Hàng</li>
            <li>Chính Sách Bảo Hành</li>
          </ul>
        </div>
        <div className="footer-link__col">
          <div className="footer-link__title">VỀ SHOPEE</div>
          <ul>
            <li>Giới Thiệu Về Shopee Việt Nam</li>
            <li>Tuyển Dụng</li>
            <li>Điều Khoản Shopee</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Chính Hãng</li>
            <li>Kênh Người Bán</li>
            <li>Flash Sales</li>
            <li>Chương Trình Tiếp Thị Liên Kết Shopee</li>
            <li>Liên Hệ Với Truyền Thông</li>
          </ul>
        </div>
        <div className="footer-link__col">
          <div className="footer-link__title">THANH TOÁN</div>
          <div className="footer-link__payment">
            {Array.isArray(FooterLinkPaymentImage)
              ? FooterLinkPaymentImage.map((img, idx) => (
                  <img src={img} alt={`payment-${idx}`} key={idx} />
                ))
              : <img src={FooterLinkPaymentImage} alt="payment" />}
          </div>
          <div className="footer-link__title" style={{ marginTop: 16 }}>ĐƠN VỊ VẬN CHUYỂN</div>
          <div className="footer-link__shipping">
            {Array.isArray(FooterLinkTransportImage)
              ? FooterLinkTransportImage.map((img, idx) => (
                  <img src={img} alt={`shipping-${idx}`} key={idx} />
                ))
              : <img src={FooterLinkTransportImage} alt="shipping" />}
          </div>
        </div>
        <div className="footer-link__col">
          <div className="footer-link__title">THEO DÕI CHÚNG TÔI TRÊN</div>
          <ul className="footer-link__social">
            <li>
              <i className="fab fa-facebook"></i> Facebook
            </li>
            <li>
              <i className="fab fa-instagram"></i> Instagram
            </li>
            <li>
              <i className="fab fa-linkedin"></i> Linked
            </li>
          </ul>
        </div>
        <div className="footer-link__col">
          <div className="footer-link__title">TẢI ỨNG DỤNG SHOPEE NGAY THÔI</div>
          <div className="footer-link__apps">
            <img
              src={HeaderQRCodeImage}
              alt="QR"
              className="footer-link__qr"
            />
            <div className="footer-link__app-links">
              <img src={HeaderAppStoreIcon} alt="App Store" />
              <img src={HeaderGooglePlayIcon} alt="Google Play" />
              <img src={HeaderAppGalleryIcon} alt="App Gallery" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-link__bottom">
        <div className="footer-link__copyright">
          ©2021 Shopee. Tất cả các quyền được bảo lưu.
        </div>
        <div className="footer-link__countries">
          Quốc gia & Khu vực: Singapore | Indonesia | Đài Loan | Thái Lan | Malaysia | Việt Nam | Philippines | Brazil | México | Colombia | Chile
        </div>
      </div>
    </div>
  );
}