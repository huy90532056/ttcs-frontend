import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../apis";
import "./FlashSale.css";

const FLASH_SALE_BANNERS = [
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/394ef2d2-ce54-4548-a109-56a93d4ca067.png",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/570d19bd-ed0d-4672-bd67-fc39d60d23e2.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/cc59b686-15ef-4af4-b6bd-1cdde70b1ffa.jpg",
  "https://blasterdpm.s3.ap-southeast-1.amazonaws.com/2f35e1c2-1515-42f5-bedc-0d921fe37607.jpg",
];

const formatPrice = (price) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const FlashSale = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts().then(setProducts);
  }, []);

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-title-row">
        <span className="flash-sale-title">
          <span className="flash-sale-icon">⚡</span>FLASH SALE
        </span>
      </div>
      <div className="flash-sale-products">
        {products.slice(0, 6).map((product) => (
          <a
            href={`/product/${product.productId}`}
            className="flash-sale-product-link"
            key={product.productId}
          >
            <div className="flash-sale-product-card">
              <img
                src={product.productImage}
                alt={product.productName}
                className="flash-sale-product-img"
              />
              <div className="flash-sale-product-name">{product.productName}</div>
              <div className="flash-sale-product-price">
                {formatPrice(product.price).replace("₫", "")}
                <span className="flash-sale-currency"> ₫</span>
              </div>
              <div className="flash-sale-product-sold">
                Đã bán {Math.floor(Math.random() * 200)}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="flash-sale-banners">
        {FLASH_SALE_BANNERS.slice(1).map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Banner ${idx + 1}`}
            className="flash-sale-banner-img"
          />
        ))}
      </div>
    </div>
  );
};

export default FlashSale;