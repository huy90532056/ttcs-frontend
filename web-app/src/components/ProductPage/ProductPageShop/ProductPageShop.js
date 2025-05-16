import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInventoryIdByProductId, getInventoryById, fetchUserById } from "../../../apis";
import { FaStore, FaRegComments } from "react-icons/fa";
import "./ProductPageShop.css";
import { Link } from "react-router-dom";


const ProductPageShop = () => {
  const { productId } = useParams();
  const [shop, setShop] = useState(null);
  const [shopUser, setShopUser] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        // Lấy inventoryId từ productId
        const inventoryId = await getInventoryIdByProductId(productId);
        // Lấy thông tin shop/inventory
        const inventory = await getInventoryById(inventoryId);
        setShop(inventory);

        // Lấy thông tin user của shop
        if (inventory?.userId) {
          const user = await fetchUserById(inventory.userId);
          setShopUser(user);
        }
      } catch (err) {
        setShop(null);
        setShopUser(null);
      }
    };
    fetchShop();
  }, [productId]);

  if (!shop) return null;

  // Demo số liệu, bạn có thể lấy từ shop hoặc để số giả lập
  const ratingCount = 281500;
  const productCount = shop.productInventories?.length || 0;
  const responseRate = "100%";
  const responseTime = "trong vài giờ";
  const joinTime = "8 năm trước";
  const followerCount = 268800;

  return (
    <div className="productshop-container">
    <div className="productshop-left">
      <Link to={`/myshop/${shop.inventoryId}`}>
        <img
          src={shop.inventoryImagePath}
          alt="Shop"
          className="productshop-avatar"
        />
      </Link>
      <div className="productshop-info">
        <div className="productshop-name">
          {shopUser ? `@${shopUser.username}` : ""}
        </div>
          <div className="productshop-online">Online 17 Phút Trước</div>
          <div className="productshop-actions">
            <button className="productshop-chat">
              <FaRegComments style={{ marginRight: 6 }} />
              Chat Ngay
            </button>
            <Link to={`/myshop/${shop.inventoryId}`}>
                <button className="productshop-view">
                <FaStore style={{ marginRight: 6 }} />
                    Xem Shop
                </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="productshop-divider" />
      <div className="productshop-right">
        <div className="productshop-row">
          <span className="productshop-label">Đánh Giá</span>
          <span className="productshop-value">{ratingCount.toLocaleString("vi-VN")}k</span>
          <span className="productshop-label">Tỉ Lệ Phản Hồi</span>
          <span className="productshop-value">{responseRate}</span>
          <span className="productshop-label">Tham Gia</span>
          <span className="productshop-value">{joinTime}</span>
        </div>
        <div className="productshop-row">
          <span className="productshop-label">Sản Phẩm</span>
          <span className="productshop-value">{productCount}</span>
          <span className="productshop-label">Thời Gian Phản Hồi</span>
          <span className="productshop-value">{responseTime}</span>
          <span className="productshop-label">Người Theo Dõi</span>
          <span className="productshop-value">{followerCount.toLocaleString("vi-VN")}k</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPageShop;