import React, { useEffect, useState } from "react";
import { fetchAllInventories } from "../../../apis";
import "./ShopeeMall.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStore } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SHOPEEMALL_BANNERS = [
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/07777d1d-5bda-4112-9c88-587db9209e14.png",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/74d6e1b4-cfed-4412-bb6f-b6d2b9f91c79.png",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/42247c47-b55d-42a9-b466-64a4eb8933aa.png",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/5cf19174-58ac-43e9-b9ca-d6149294b6a5.png",
];

const SHOPEEMALL_LABELS = [
  "Mua là có quà",
  "Mua là có quà",
  "Siêu sale lớn của năm",
  "Mua 1 được 2",
  "Ưu đãi 30%",
  "Siêu sale nhất năm",
  "Giảm đến 50%",
  "Siêu ưu đãi đến 50%",
];

const PAGE_SIZE = 8;

const ShopeeMall = () => {
  const [inventories, setInventories] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [inventoryPage, setInventoryPage] = useState(0);

  useEffect(() => {
    fetchAllInventories().then(setInventories);
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentBanner((prev) =>
      prev === SHOPEEMALL_BANNERS.length - 1 ? 0 : prev + 1
    );
  }, 5000); // đổi banner mỗi 4 giây, có thể chỉnh lại số ms
  return () => clearInterval(timer);
  },[]);

  // Banner slider handlers
  const handlePrevBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? SHOPEEMALL_BANNERS.length - 1 : prev - 1
    );
  };
  const handleNextBanner = () => {
    setCurrentBanner((prev) =>
      prev === SHOPEEMALL_BANNERS.length - 1 ? 0 : prev + 1
    );
  };

  // Inventory paging
  const totalInventoryPages = Math.ceil(inventories.length / PAGE_SIZE);
  const handlePrevInventory = () => {
    setInventoryPage((prev) => (prev === 0 ? totalInventoryPages - 1 : prev - 1));
  };
  const handleNextInventory = () => {
    setInventoryPage((prev) => (prev === totalInventoryPages - 1 ? 0 : prev + 1));
  };
  const inventoryToShow = inventories.slice(
    inventoryPage * PAGE_SIZE,
    inventoryPage * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="shopeemall-container">
      <div className="shopeemall-header">
        <span className="shopeemall-title">
          <FaStore style={{ color: "#ee4d2d", marginRight: 8 }} />
          SHOPEE MALL
        </span>
      </div>
      <div className="shopeemall-content">
        {/* Banner slider bên trái */}
        <div className="shopeemall-banner-slider">
          <img
            src={SHOPEEMALL_BANNERS[currentBanner]}
            alt="ShopeeMall Banner"
            className="shopeemall-banner-img-large"
          />
          <button className="shopeemall-banner-arrow left" onClick={handlePrevBanner}>
            <FaChevronLeft />
          </button>
          <button className="shopeemall-banner-arrow right" onClick={handleNextBanner}>
            <FaChevronRight />
          </button>
          <div className="shopeemall-banner-dots">
            {SHOPEEMALL_BANNERS.map((_, idx) => (
              <span
                key={idx}
                className={
                  "shopeemall-banner-dot" +
                  (idx === currentBanner ? " active" : "")
                }
                onClick={() => setCurrentBanner(idx)}
              />
            ))}
          </div>
        </div>
        {/* Inventory grid bên phải */}
        <div className="shopeemall-grid-wrapper">
          <button className="shopeemall-inv-arrow left" onClick={handlePrevInventory}>
            <FaChevronLeft />
          </button>
          <div className="shopeemall-grid">
  {inventoryToShow.map((item, idx) => (
    <Link
      to={`/myshop/${item.inventoryId}`}
      className="shopeemall-item"
      key={item.inventoryId}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="shopeemall-item-img-wrapper">
        <img
          src={item.inventoryImagePath}
          alt={`Mall ${idx + 1}`}
          className="shopeemall-item-img"
        />
      </div>
      <div className="shopeemall-item-label">
        {SHOPEEMALL_LABELS[idx % SHOPEEMALL_LABELS.length] || "Ưu đãi"}
      </div>
    </Link>
  ))}
</div>
          <button className="shopeemall-inv-arrow right" onClick={handleNextInventory}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopeeMall;