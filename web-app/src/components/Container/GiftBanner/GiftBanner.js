import React from "react";
import { GiftBannerImage } from "../../../assets/images";
import "./GiftBanner.css";

const GiftBanner = () => (
  <div className="gift-banner">
    <img src={GiftBannerImage} alt="Gift Banner" />
  </div>
);

export default GiftBanner;