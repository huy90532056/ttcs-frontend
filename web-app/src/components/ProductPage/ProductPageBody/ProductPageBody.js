import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaFacebookF,
  FaFacebookMessenger,
  FaPinterestP,
  FaTicketAlt,
  FaGift,
  FaTruck,
  FaShieldAlt
} from "react-icons/fa";
import {
  fetchProductDetail,
  fetchProductVariants,
  fetchMyInfo,
  fetchCartByUserId,
  addCartItem
} from "../../../apis";
import "./ProductPageBody.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Xử lý tất cả các biến thể thành các nhóm riêng biệt
  const variantGroups = {};
  
  // Xử lý variants và nhóm lại
  variants.forEach(variant => {
    // Nếu là default hoặc Basic, bỏ qua
    if (variant.variantName === "default" || variant.variantValue === "Basic") {
      return;
    }
    
    // Nhóm các variants theo variantName
    if (!variantGroups[variant.variantName]) {
      variantGroups[variant.variantName] = [];
    }
    variantGroups[variant.variantName].push(variant);
  });

  // Danh sách các tên nhóm biến thể
  const variantGroupNames = Object.keys(variantGroups);

  // Xử lý tăng giảm số lượng
  const handleQuantity = (type) => {
    if (type === "inc") setQuantity(q => q + 1);
    if (type === "dec") setQuantity(q => (q > 1 ? q - 1 : 1));
  };

  const handleBuyNow = async () => {
  if (!selectedVariantId) {
    toast.error("Vui lòng chọn phân loại sản phẩm!");
    return;
  }
  try {
    const user = await fetchMyInfo();
    const cart = await fetchCartByUserId(user.id);
    await addCartItem({
      quantity,
      variantId: selectedVariantId,
      cartId: cart.cartId
    });
    window.dispatchEvent(new Event("cart-updated"));
    window.location.href = "/cart";
  } catch (err) {
    toast.error("Có lỗi khi thêm vào giỏ hàng!");
  }
};

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
  if (!selectedVariantId) {
    toast.error("Vui lòng chọn phân loại sản phẩm!");
    return;
  }
  try {
    const user = await fetchMyInfo();
    const cart = await fetchCartByUserId(user.id);
    await addCartItem({
      quantity,
      variantId: selectedVariantId,
      cartId: cart.cartId
    });
    // Thông báo cho header cập nhật lại số giỏ hàng
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#2dc258" />
            <polyline
              points="9,17 15,23 23,11"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 500 }}>
          Sản phẩm đã được thêm vào Giỏ hàng
        </span>
      </div>,
      {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        style: {
          background: "rgba(34,34,34,0.92)",
          borderRadius: 10,
          minWidth: 320
        }
      }
    );
  } catch (err) {
    toast.error("Có lỗi khi thêm vào giỏ hàng!");
  }
};

  return (
    <div className="productpage-container">
      <ToastContainer />
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
                    if (found?.variantValue === "Basic") {
                      setSelectedVariantId(null);
                    } else {
                      setSelectedVariantId(found?.variantId || null);
                    }
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
            <span>22,5k Sold</span>
          </div>
          <div className="productpage-flashsale">
            <span className="productpage-flashsale-label">FLASH SALE</span>
            <span className="productpage-flashsale-price">
              {selectedVariant?.price?.toLocaleString() || product.price?.toLocaleString()}₫
            </span>
            <span className="productpage-flashsale-old">
              {(Math.ceil((selectedVariant?.price || product.price) / 0.75 / 1000) * 1000).toLocaleString()}₫
            </span>
            <span className="productpage-flashsale-discount">-25%</span>
            <span className="productpage-flashsale-timer">
              <span>KẾT THÚC TRONG</span>
              <span className="productpage-timer">00 10 21</span>
            </span>
          </div>

          {/* Thông tin bổ sung giống Shopee */}
          <div className="productpage-extra-info">
            <div className="productpage-extra-row">
              <span className="productpage-extra-label">
                <FaTicketAlt style={{ color: "#ee4d2d", marginRight: 6 }} />
                Voucher Của Shop
              </span>
              <span className="productpage-extra-value" style={{ color: "#ee4d2d", fontWeight: 500 }}>Giảm 50%</span>
            </div>
            <div className="productpage-extra-row">
              <span className="productpage-extra-label">
                <FaGift style={{ color: "#ee4d2d", marginRight: 6 }} />
                Combo Khuyến Mãi
              </span>
              <span className="productpage-extra-value">
                <span style={{
                  border: "1px solid #ee4d2d",
                  color: "#ee4d2d",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontWeight: 500,
                  background: "#fff7f7"
                }}>
                  Mua 2 & giảm 45.000
                </span>
              </span>
            </div>
            <div className="productpage-extra-row">
              <span className="productpage-extra-label">
                <FaTruck style={{ color: "#20c997", marginRight: 6 }} />
                Vận Chuyển
              </span>
              <span className="productpage-extra-value">
                <span style={{ color: "#20c997", fontWeight: 500 }}>Miễn phí vận chuyển</span>
              </span>
            </div>
            <div className="productpage-extra-row">
              <span className="productpage-extra-label">
                <FaShieldAlt style={{ color: "#ee4d2d", marginRight: 6 }} />
                An Tâm Mua Sắm Cùng Shopee
              </span>
              <span className="productpage-extra-value">
                Trả hàng miễn phí 15 ngày · Chính hãng 100% · Miễn phí vận chuyển
              </span>
            </div>
          </div>

          {/* Hiển thị tất cả các nhóm biến thể */}
          {variantGroupNames.map((groupName) => (
            <div className="productpage-variant-group" key={groupName}>
              <div className="productpage-variant-label">{groupName}</div>
              <div className="productpage-variant-list">
                {variantGroups[groupName].map((v) => (
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
              max={selectedVariant?.stockQuantity ?? variants[0]?.stockQuantity ?? 0}
              value={quantity}
              onChange={e => {
                const max = selectedVariant?.stockQuantity ?? variants[0]?.stockQuantity ?? 0;
                setQuantity(Math.max(1, Math.min(Number(e.target.value), max)));
              }}
              className="productpage-quantity-input"
            />
            <button 
              className="productpage-quantity-btn" 
              onClick={() => handleQuantity("inc")}
              disabled={quantity >= (selectedVariant?.stockQuantity ?? variants[0]?.stockQuantity ?? 0)}
            >
              +
            </button>
            <span className="productpage-stock">
              {(selectedVariant?.stockQuantity ?? variants[0]?.stockQuantity ?? 0).toLocaleString()} sản phẩm có sẵn
            </span>
          </div>
          <div className="productpage-action-row">
            <button className="productpage-cart-btn" onClick={handleAddToCart}>
              Thêm Vào Giỏ Hàng
            </button>
            <button className="productpage-buy-btn" onClick={handleBuyNow}>
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageBody;