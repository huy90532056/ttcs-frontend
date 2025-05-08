import React from "react";
import {
  OutstandingHeaderPicture,
  OutstandingBodyPicture,
  OutstandingFooterPicture,
} from "../../../assets/images/container";
import "./Outstanding.css";

const products = [
  {
    img: "https://cf.shopee.vn/file/1.jpg",
    name: "Trà sữa trân châu",
    price: "₫135.000",
    discount: "27%",
  },
  {
    img: "https://cf.shopee.vn/file/4.jpg",
    name: "P&G Beauty",
    price: "GIẢM 50%",
    discount: "",
  },
  {
    img: "https://cf.shopee.vn/file/3.jpg",
    name: "Ốp lưng awifi",
    price: "₫9.000",
    discount: "84%",
  },
  {
    img: "https://cf.shopee.vn/file/4.jpg",
    name: "P&G Beauty",
    price: "GIẢM 50%",
    discount: "",
  },
  {
    img: "https://cf.shopee.vn/file/5.jpg",
    name: "Lock&Lock",
    price: "GIẢM 50%",
    discount: "",
  },
  {
    img: "https://cf.shopee.vn/file/6.jpg",
    name: "Maybelline",
    price: "GIẢM 50%",
    discount: "",
  },
];

const Outstanding = () => (
  <div className="outstanding-container">
    <div className="outstanding-header">
      <img src={OutstandingHeaderPicture} alt="Header" />
    </div>
    <div className="outstanding-body">
      <div className="outstanding-body-top">
        <span className="outstanding-title">SẢN PHẨM BÁN CHẠY</span>
        <span className="outstanding-title outstanding-title--brand">THƯƠNG HIỆU NỔI BẬT</span>
      </div>
      <div className="outstanding-products">
        {products.map((item, idx) => (
          <div className="outstanding-product" key={idx}>
            {item.discount && <div className="outstanding-discount">{item.discount} GIẢM</div>}
            <img src={item.img} alt={item.name} />
            <div className="outstanding-product-name">{item.name}</div>
            <div className="outstanding-product-price">{item.price}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="outstanding-footer">
      <img src={OutstandingFooterPicture} alt="Footer" />
    </div>
  </div>
);

export default Outstanding;