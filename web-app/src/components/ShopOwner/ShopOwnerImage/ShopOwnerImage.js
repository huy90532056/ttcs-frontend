import React, { useState, useEffect } from "react";
import "./ShopOwnerImage.css";

const images = [
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/c9295e77-1644-4a1b-9c02-b59adcc1d29f.webp", // 1
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/be6dc645-c4bd-41c7-8e6c-9d7dcc6ad7c7.webp", // 2
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/7a654291-e5f9-4144-b298-81d2daf9b3b1.webp", // 3
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/72c0525d-2334-43b3-a946-27856257fcfd.webp"  // 4
];

const slideImages = [images[1], images[2]];

const ShopOwnerImage = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="shopowner-banner-vertical">
      <img src={images[0]} alt="top" className="banner-img vertical-top" />
      <div className="banner-carousel-row">
        <button className="carousel-arrow left" onClick={prevSlide}>&lt;</button>
        <img
          src={slideImages[current]}
          alt={`slide-${current + 1}`}
          className="banner-img main"
        />
        <button className="carousel-arrow right" onClick={nextSlide}>&gt;</button>
      </div>
      <div className="carousel-dots">
        {slideImages.map((_, idx) => (
          <span
            key={idx}
            className={`carousel-dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
      <img src={images[3]} alt="bottom" className="banner-img vertical-bottom" />
    </div>
  );
};

export default ShopOwnerImage;