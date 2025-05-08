import React from "react";
import {
    FooterPolicyTermsCertificate1,
    FooterPolicyTermsCertificate2,
    FooterPolicyTermsCertificate3
} from "../../../assets/images";
import "./FooterPolicyAndTerms.css";

export default function FooterPolicyAndTerms() {
  return (
    <div className="footer-policy-terms">
      <div className="footer-policy-terms__links">
        <a href="#">CHÍNH SÁCH BẢO MẬT</a>
        <span>|</span>
        <a href="#">QUY CHẾ HOẠT ĐỘNG</a>
        <span>|</span>
        <a href="#">CHÍNH SÁCH VẬN CHUYỂN</a>
        <span>|</span>
        <a href="#">CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</a>
      </div>
      <div className="footer-policy-terms__certs">
        <img src={FooterPolicyTermsCertificate1} alt="Chứng nhận 1" />
        <img src={FooterPolicyTermsCertificate2} alt="Chứng nhận 2" />
        <img src={FooterPolicyTermsCertificate3} alt="Chứng nhận 3" />
      </div>
      <div className="footer-policy-terms__company">
        Công ty TNHH Shopee
      </div>
      <div className="footer-policy-terms__desc">
        Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn<br />
        Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)<br />
        Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015<br />
        © 2015 - Bản quyền thuộc về Công ty TNHH Shopee
      </div>
    </div>
  );
}