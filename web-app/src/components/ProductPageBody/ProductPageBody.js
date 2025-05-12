import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetail, fetchProductVariants } from "../../apis";
import { FaStar, FaHeart, FaFacebookF, FaFacebookMessenger, FaPinterestP } from "react-icons/fa";import "./ProductPageBody.css";

const ProductPageBody = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetchProductDetail(productId);
      setProduct(res);
    };
    const getVariants = async () => {
      const res = await fetchProductVariants(productId);
      setVariants(res || []);
    };
    getProduct();
    getVariants();
  }, [productId]);

  if (!product) return <div className="product-loading">Đang tải...</div>;

  // Lấy variant đang chọn
  const selectedVariant = variants.find(v => v.variantId === selectedVariantId);
  const mainImage = selectedVariant?.productVariantImage || product.productImage;

  // Nhóm variant theo tên (ví dụ: Màu, Size)
  const groupVariants = (name) => variants.filter(v => v.variantName === name);

  // Lấy các nhóm variant duy nhất
  const variantNames = [...new Set(variants.map(v => v.variantName).filter(Boolean))];

  // Xử lý tăng giảm số lượng
  const handleQuantity = (type) => {
    if (type === "inc") setQuantity(q => q + 1);
    if (type === "dec") setQuantity(q => (q > 1 ? q - 1 : 1));
  };

  return (
    <div className="productpage-container">
      <div className="productpage-main">
        {/* Left: Ảnh sản phẩm */}
        <div className="productpage-images">
          <img className="productpage-main-img" src={mainImage} alt={product.productName} />
          <div className="productpage-thumb-list">
            {[product.productImage, ...variants.map(v => v.productVariantImage)]
              .filter((img, idx, arr) => img && arr.indexOf(img) === idx)
              .map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumb"
                  className={`productpage-thumb-img${mainImage === img ? " active" : ""}`}
                  onClick={() => {
                    const found = variants.find(v => v.productVariantImage === img);
                    setSelectedVariantId(found?.variantId || null);
                  }}
                />
              ))}
          </div>
          <div className="productpage-share">
            <span>Chia sẻ:</span>
            <FaFacebookMessenger className="productpage-share-icon" />
            <FaFacebookF className="productpage-share-icon" />
            <FaPinterestP className="productpage-share-icon" />
            <span className="productpage-like">
              <FaHeart style={{ color: "#ee4d2d", marginRight: 4 }} />
              Đã thích (2,1k)
            </span>
          </div>
        </div>
        {/* Right: Thông tin sản phẩm */}
        <div className="productpage-info">
          <div className="productpage-title">
            <span className="productpage-label">Yêu Thích+</span>
            <span>{product.productName}</span>
          </div>
          <div className="productpage-rating">
            <span className="productpage-rating-star">
              4.9 <FaStar color="#FFD600" />
            </span>
            <span className="productpage-rating-divider"></span>
            <span>2,4k Đánh Giá</span>
            <span className="productpage-rating-divider"></span>
            <span>13,5k Sold</span>
          </div>
          <div className="productpage-flashsale">
            <span className="productpage-flashsale-label">FLASH SALE</span>
            <span className="productpage-flashsale-price">
              {selectedVariant?.price?.toLocaleString() || product.price?.toLocaleString()}₫
            </span>
            <span className="productpage-flashsale-old">189.000</span>
            <span className="productpage-flashsale-discount">-50%</span>
            <span className="productpage-flashsale-timer">
              <span>KẾT THÚC TRONG</span>
              <span className="productpage-timer">00 10 21</span>
            </span>
          </div>
          <div className="productpage-desc">{product.description}</div>
          {/* Hiển thị các nhóm variant */}
          {variantNames.map((name) => (
            <div className="productpage-variant-group" key={name}>
              <div className="productpage-variant-label">{name}</div>
              <div className="productpage-variant-list">
                {groupVariants(name).map((v) => (
                  <button
                    key={v.variantId}
                    className={`productpage-variant-btn${selectedVariantId === v.variantId ? " selected" : ""}`}
                    onClick={() => setSelectedVariantId(v.variantId)}
                  >
                    {v.variantValue}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {/* Số lượng và nút mua */}
          <div className="productpage-quantity-row">
            <span>Số Lượng</span>
            <button className="productpage-quantity-btn" onClick={() => handleQuantity("dec")}>-</button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="productpage-quantity-input"
            />
            <button className="productpage-quantity-btn" onClick={() => handleQuantity("inc")}>+</button>
            <span className="productpage-stock">
              {(selectedVariant?.stockQuantity ?? variants[0]?.stockQuantity ?? 0).toLocaleString()} sản phẩm có sẵn
            </span>
          </div>
          <div className="productpage-action-row">
            <button className="productpage-cart-btn">
              Thêm Vào Giỏ Hàng
            </button>
            <button className="productpage-buy-btn">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageBody;