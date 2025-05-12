import React, { useState } from "react";
import "./Banner.css";

const banners = [
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/d2880dde-3de7-481d-a868-fcda57daead0.png",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/5ac5bbae-0ac2-462f-a706-27e681fa2bb9.jpg"
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  return (
    <div className="banner-slider-wrapper">
      <button className="banner-arrow left" onClick={prev}>&lt;</button>
      <img src={banners[current]} alt={`banner-${current}`} className="banner-img" />
      <button className="banner-arrow right" onClick={next}>&gt;</button>
      <div className="banner-dots">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`banner-dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;