import React, { useEffect, useState } from "react";
import { FaUserCircle, FaTruck, FaEye } from "react-icons/fa";
import { fetchMyInfo, fetchAllOrders, updateOrderById, fetchProductVariantById } from "../../apis";
import "./ShipperDashboardBody.css";

const shipperMenuItems = [
  { key: "orders", icon: <FaTruck color="#1677ff" />, label: "Quản lý đơn hàng" }
];

const ShipperDashboardBody = () => {
  const [shipperInfo, setShipperInfo] = useState(null);
  const [selected, setSelected] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [orderVariants, setOrderVariants] = useState({}); // { orderId: [variantInfo, ...] }
  const [loadingVariants, setLoadingVariants] = useState(false);

  useEffect(() => {
    fetchMyInfo().then(info => setShipperInfo(info));
  }, []);

  useEffect(() => {
    if (shipperInfo?.id) {
      fetchAllOrders().then(data => setOrders(data));
    }
  }, [shipperInfo]);

  // Lọc đơn của shipper hiện tại
  const myOrders = orders.filter(
    order => order.shipperId === shipperInfo?.id
  );

  const handleShipOrder = async (orderId) => {
    if (!shipperInfo?.id) return;
    setLoadingOrderId(orderId);
    await updateOrderById(orderId, {
      status: "SHIPPED",
      shipperId: shipperInfo.id
    });
    // Refresh orders list
    const updated = await fetchAllOrders();
    setOrders(updated);
    setLoadingOrderId(null);
  };

  // Xem sản phẩm trong đơn hàng
  const handleShowOrderItems = async (order) => {
    if (openOrderId === order.orderId) {
      setOpenOrderId(null);
      return;
    }
    setOpenOrderId(order.orderId);
    if (orderVariants[order.orderId]) return; // đã có cache
    setLoadingVariants(true);
    const variants = await Promise.all(
      order.items.map(async (item) => {
        const variant = await fetchProductVariantById(item.variantId);
        return {
          ...variant,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        };
      })
    );
    setOrderVariants(prev => ({ ...prev, [order.orderId]: variants }));
    setLoadingVariants(false);
  };

  return (
    <div className="shipper-body-container">
      <div className="shipper-sidebar">
        <div className="shipper-profile">
          <div className="shipper-avatar">
            <FaUserCircle size={56} color="#cccccc" />
          </div>
          <div className="shipper-username">
            {shipperInfo ? shipperInfo.username : "Shipper"}
          </div>
          <div className="shipper-dashboard-title">🚚 Shipper Dashboard</div>
        </div>
        <div>
          {shipperMenuItems.map(item => (
            <button
              key={item.key}
              className={`shipper-menu-item-btn${selected === item.key ? " selected" : ""}`}
              onClick={() => setSelected(item.key)}
            >
              <span className="shipper-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="shipper-main-content">
        <div className="shipper-main-title">
          Quản lý đơn hàng
        </div>
        <div className="shipper-orders-table-wrapper">
          <table className="shipper-orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Phương thức giao</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
                <th>Sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#aaa" }}>
                    Không có đơn hàng nào của bạn
                  </td>
                </tr>
              ) : (
                myOrders.map(order => (
                  <React.Fragment key={order.orderId}>
                    <tr>
                      <td>{order.orderId}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.status}</td>
                      <td>{order.shippingMethod}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.amount.toLocaleString()}₫</td>
                      <td>
                        {order.status === "PENDING" ? (
                          <button
                            className="shipper-accept-btn"
                            onClick={() => handleShipOrder(order.orderId)}
                            disabled={loadingOrderId === order.orderId}
                          >
                            {loadingOrderId === order.orderId ? "Đang giao..." : "Giao hàng"}
                          </button>
                        ) : (
                          <span style={{ color: "#1677ff", fontWeight: 500 }}>Đã giao</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="shipper-view-btn"
                          onClick={() => handleShowOrderItems(order)}
                          style={{ padding: "4px 10px", fontSize: 14 }}
                        >
                          <FaEye /> Xem sản phẩm
                        </button>
                      </td>
                    </tr>
                    {openOrderId === order.orderId && (
                      <tr>
                        <td colSpan={8} style={{ background: "#f8fafd" }}>
                          {loadingVariants ? (
                            <div style={{ padding: 16 }}>Đang tải sản phẩm...</div>
                          ) : (
                            <table className="shipper-order-items-table" style={{ width: "100%", background: "#fff", marginTop: 8 }}>
                              <thead>
                                <tr>
                                  <th>Ảnh</th>
                                  <th>Tên sản phẩm</th>
                                  <th>Giá trị</th>
                                  <th>Số lượng</th>
                                  <th>Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(orderVariants[order.orderId] || []).map((variant, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <img src={variant.productVariantImage} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                                    </td>
                                    <td>{variant.variantName}</td>
                                    <td>{variant.variantValue}</td>
                                    <td>{variant.quantity}</td>
                                    <td>{variant.totalPrice.toLocaleString()}₫</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboardBody;