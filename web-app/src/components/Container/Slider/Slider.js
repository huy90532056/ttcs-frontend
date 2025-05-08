import React, { useState } from "react";
import {
  SliderFavouriteSelectionsIcon1,
  SliderFavouriteSelectionsIcon2,
  SliderFavouriteSelectionsIcon3,
  SliderFavouriteSelectionsIcon4,
  SliderFavouriteSelectionsIcon5,
  SliderFavouriteSelectionsIcon6,
  SliderFavouriteSelectionsIcon7,
  SliderFavouriteSelectionsIcon8,
  SliderFavouriteSelectionsIcon9,
  SliderFavouriteSelectionsIcon10,
  SliderMotionBanner1,
  SliderMotionBanner2,
  SliderMotionBanner3,
  SliderMotionBanner4,
  SliderMotionBanner5,
  SliderMotionBanner6,
  SliderMotionBanner7,
  SliderMotionBanner8,
  SliderMotionBanner9,
  SliderMotionBanner10,
  SliderNoMotionBanner1,
  SliderNoMotionBanner2,
} from "../../../assets/images/container";
import "./Slider.css";

const bannerImages = [
  SliderMotionBanner1,
  SliderMotionBanner2,
  SliderMotionBanner3,
  SliderMotionBanner4,
  SliderMotionBanner5,
  SliderMotionBanner6,
  SliderMotionBanner7,
  SliderMotionBanner8,
  SliderMotionBanner9,
  SliderMotionBanner10,
];

const sideBanners = [SliderNoMotionBanner1, SliderNoMotionBanner2];

const favouriteIcons = [
  { icon: SliderFavouriteSelectionsIcon1, label: "Shopee Số Gì Đây" },
  { icon: SliderFavouriteSelectionsIcon2, label: "Ở Nhà Không Khó" },
  { icon: SliderFavouriteSelectionsIcon3, label: "Tech Zone - Siêu Thị Điện Tử" },
  { icon: SliderFavouriteSelectionsIcon4, label: "Gì Cũng Rẻ - Từ 1K" },
  { icon: SliderFavouriteSelectionsIcon5, label: "Hoàn Xu 20% - Đơn Từ 0Đ" },
  { icon: SliderFavouriteSelectionsIcon6, label: "Nạp Thẻ, Dịch Vụ & Phim" },
  { icon: SliderFavouriteSelectionsIcon7, label: "Freeship Xtra - Deal giảm tới..." },
  { icon: SliderFavouriteSelectionsIcon8, label: "Hàng Hiệu -50%" },
  { icon: SliderFavouriteSelectionsIcon9, label: "Hàng Quốc Tế" },
  { icon: SliderFavouriteSelectionsIcon10, label: "Shopee Premium" },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="slider-container">
      <div className="slider-banner-section">
        <div className="slider-banner-main">
          <button className="slider-arrow left" onClick={prevSlide}>&lt;</button>
          <img
            src={bannerImages[current]}
            alt={`banner-${current + 1}`}
            className="slider-banner-img"
          />
          <button className="slider-arrow right" onClick={nextSlide}>&gt;</button>
          <div className="slider-dots">
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`slider-dot${idx === current ? " active" : ""}`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
        <div className="slider-banner-side">
          <img src={sideBanners[0]} alt="side-1" className="slider-side-img" />
          <img src={sideBanners[1]} alt="side-2" className="slider-side-img" />
        </div>
      </div>
      <div className="slider-favourite-section">
        {favouriteIcons.map((item, idx) => (
          <div className="slider-favourite-item" key={idx}>
            <img src={item.icon} alt={item.label} className="slider-favourite-icon" />
            <div className="slider-favourite-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;