import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaTicketAlt,
  FaUserCircle,
  FaTrash,
  FaEdit,
  FaEye
} from "react-icons/fa";
import {
  fetchMyInfo,
  fetchAllUsers,
  deleteUserById,
  updateUserById,
  fetchAllProducts,
  deleteProductById,
  updateProductById,
  fetchProductVariants,
  deleteProductVariantById,
  updateProductVariant,
  fetchAllOrders,
  deleteOrderById,
  updateOrderById,
  fetchDiscounts,
  updateDiscountById,
  deleteDiscountById,
  fetchProductVariantById
} from "../../apis";
import "./AdminDashboardBody.css";

const adminMenuItems = [
  { key: "users", icon: <FaUsers color="#ee4d2d" />, label: "Quản Lý User" },
  { key: "products", icon: <FaBoxOpen color="#1677ff" />, label: "Quản Lý Sản Phẩm" },
  { key: "orders", icon: <FaClipboardList color="#1677ff" />, label: "Quản Lý Đơn Hàng" },
  { key: "vouchers", icon: <FaTicketAlt color="#fbc02d" />, label: "Quản Lý Voucher" },
];

const AdminDashboardBody = () => {
  const [selected, setSelected] = useState("users");
  const [admin, setAdmin] = useState(null);

  // User state
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  // Product state
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Product variant state
  const [openVariants, setOpenVariants] = useState(null); // productId đang mở variant
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [editVariantData, setEditVariantData] = useState({});

  // Order state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});

  // Voucher state
  const [discounts, setDiscounts] = useState([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editDiscountData, setEditDiscountData] = useState({});

  // Order items (productVariant) state
  const [openOrderItems, setOpenOrderItems] = useState(null);
  const [orderVariantCache, setOrderVariantCache] = useState({});

  // Fetch admin info
  useEffect(() => {
    fetchMyInfo().then(user => setAdmin(user));
  }, []);

  // Fetch all users when selected tab is users
  useEffect(() => {
    if (selected === "users") {
      setLoading(true);
      fetchAllUsers().then(users => {
        setUsers(users);
        setLoading(false);
      });
    }
  }, [selected]);

  // Fetch all products when selected tab is products
  useEffect(() => {
    if (selected === "products") {
      setLoadingProducts(true);
      fetchAllProducts().then(products => {
        setProducts(products);
        setLoadingProducts(false);
      });
    }
  }, [selected]);

  // Fetch all orders when selected tab is orders
  useEffect(() => {
    if (selected === "orders") {
      setLoadingOrders(true);
      fetchAllOrders().then(data => {
        setOrders(data);
        setLoadingOrders(false);
      });
    }
  }, [selected]);

  // Fetch all discounts when selected tab is vouchers
  useEffect(() => {
    if (selected === "vouchers") {
      setLoadingDiscounts(true);
      fetchDiscounts().then(data => {
        setDiscounts(data);
        setLoadingDiscounts(false);
      });
    }
  }, [selected]);

  // Fetch variants when openVariants changes
  useEffect(() => {
    if (openVariants) {
      setLoadingVariants(true);
      fetchProductVariants(openVariants).then(variants => {
        setVariants(variants);
        setLoadingVariants(false);
      });
    } else {
      setVariants([]);
    }
  }, [openVariants]);

  // User handlers
  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      await deleteUserById(userId);
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dob: user.dob || "",
      address: user.address || "",
      roles: user.roles && user.roles.length > 0 ? user.roles.map(r => r.name) : [],
    });
  };

  const handleSave = async (userId) => {
    const ok = window.confirm("Bạn có chắc chắn muốn lưu thay đổi cho user này?");
    if (!ok) return;
    await updateUserById(userId, editData);
    setEditingUser(null);
    // Refresh user list
    const updated = await fetchAllUsers();
    setUsers(updated);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditData({});
  };

  // Product handlers
  const handleEditProduct = (product) => {
    setEditingProduct(product.productId);
    setEditProductData({
      productName: product.productName,
      sku: product.sku,
      price: product.price,
      description: product.description,
      productImage: product.productImage,
      productWeight: product.productWeight,
      published: product.published
    });
  };

  const handleSaveProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi cho sản phẩm này?")) return;
    await updateProductById(productId, editProductData);
    setEditingProduct(null);
    setProducts(await fetchAllProducts());
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setEditProductData({});
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteProductById(productId);
      setProducts(products.filter(p => p.productId !== productId));
    } catch (err) {
      alert("Hãy xóa order liên quan đến product này trước đi!");
    }
  };

  // Variant handlers
  const handleOpenVariants = (productId) => {
    setOpenVariants(openVariants === productId ? null : productId);
    setEditingVariant(null);
    setEditVariantData({});
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant.variantId);
    setEditVariantData({
      variantName: variant.variantName,
      variantValue: variant.variantValue,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
      productId: variant.productId
    });
  };

  const handleSaveVariant = async (variantId) => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi cho biến thể này?")) return;
    await updateProductVariant(variantId, editVariantData);
    setEditingVariant(null);
    setVariants(await fetchProductVariants(openVariants));
  };

  const handleCancelVariant = () => {
    setEditingVariant(null);
    setEditVariantData({});
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
    try {
      await deleteProductVariantById(variantId);
      setVariants(variants.filter(v => v.variantId !== variantId));
    } catch (err) {
      alert("Hãy xóa order liên quan đến biến thể này trước đi!");
    }
  };

  // Order handlers
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    await deleteOrderById(orderId);
    setOrders(orders.filter(o => o.orderId !== orderId));
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order.orderId);
    setEditOrderData({
      status: order.status,
      shipperId: order.shipperId || ""
    });
  };

  const handleSaveOrder = async (orderId) => {
    await updateOrderById(orderId, editOrderData);
    setEditingOrder(null);
    setOrders(await fetchAllOrders());
  };

  const handleCancelEditOrder = () => {
    setEditingOrder(null);
    setEditOrderData({});
  };

  // Order items handlers
  const handleShowOrderItems = async (order) => {
    if (openOrderItems === order.orderId) {
      setOpenOrderItems(null);
      return;
    }
    setOpenOrderItems(order.orderId);

    // Lấy các variantId chưa có trong cache
    const missingIds = (order.items || [])
      .map(item => item.variantId)
      .filter(id => !orderVariantCache[id]);
    if (missingIds.length > 0) {
      const results = await Promise.all(
        missingIds.map(id => fetchProductVariantById(id).then(data => ({ id, data })))
      );
      const newCache = { ...orderVariantCache };
      results.forEach(({ id, data }) => {
        newCache[id] = data;
      });
      setOrderVariantCache(newCache);
    }
  };

  // Voucher handlers
  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount.discountId);
    setEditDiscountData({
      discountCode: discount.discountCode,
      percentageOff: discount.percentageOff,
      validFrom: discount.validFrom,
      validUntil: discount.validUntil
    });
  };

  const handleSaveDiscount = async (discountId) => {
    await updateDiscountById(discountId, editDiscountData);
    setEditingDiscount(null);
    setDiscounts(await fetchDiscounts());
  };

  const handleCancelDiscount = () => {
    setEditingDiscount(null);
    setEditDiscountData({});
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) return;
    await deleteDiscountById(discountId);
    setDiscounts(discounts.filter(d => d.discountId !== discountId));
  };

  // Shipper users for order edit
  const shipperUsers = users.filter(
    u => u.roles && u.roles.some(r => r.name === "SHIPPER")
  );

  return (
    <div className="userpage-body-container">
      <div className="userpage-sidebar">
        <div className="userpage-profile">
          <div className="userpage-avatar">
            <FaUserCircle size={56} color="#cccccc" />
          </div>
          <div className="userpage-username">
            {admin ? admin.username : "admin"}
          </div>
          <div className="userpage-edit-profile">🛠️ Admin Dashboard</div>
        </div>
        <div>
          {adminMenuItems.map(item => (
            <button
              key={item.key}
              className={`userpage-menu-item-btn${selected === item.key ? " selected" : ""}`}
              onClick={() => setSelected(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "16px",
                outline: "none",
                textAlign: "left"
              }}
            >
              {item.icon && <span className="userpage-menu-icon" style={{ marginRight: 8 }}>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="userpage-main-content">
        {selected === "users" && (
          <div className="admin-user-list">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Danh sách User</div>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-user-table">
                  <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Họ</th>
                        <th>Tên</th>
                        <th>Ngày sinh</th>
                        <th>Địa chỉ</th>
                        <th>Role</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>
                            {editingUser === user.id ? (
                            <input
                                type="text"
                                className="admin-user-input"
                                value={editData.lastName}
                                onChange={e => setEditData({ ...editData, lastName: e.target.value })}
                            />
                            ) : (
                            user.lastName
                            )}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                            <input
                                type="text"
                                className="admin-user-input"
                                value={editData.firstName}
                                onChange={e => setEditData({ ...editData, firstName: e.target.value })}
                            />
                            ) : (
                            user.firstName
                            )}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                            <input
                                type="date"
                                className="admin-user-input"
                                value={editData.dob}
                                onChange={e => setEditData({ ...editData, dob: e.target.value })}
                            />
                            ) : (
                            user.dob
                            )}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                            <input
                                type="text"
                                className="admin-user-input"
                                value={editData.address}
                                onChange={e => setEditData({ ...editData, address: e.target.value })}
                            />
                            ) : (
                            user.address || ""
                            )}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                            <input
                                type="text"
                                className="admin-user-input"
                                value={editData.roles[0] || ""}
                                onChange={e => setEditData({ ...editData, roles: [e.target.value] })}
                            />
                            ) : (
                            user.roles && user.roles.length > 0
                                ? user.roles.map(r => r.name).join(", ")
                                : ""
                            )}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                            <>
                                <button className="admin-user-btn save" onClick={() => handleSave(user.id)}>Lưu</button>
                                <button className="admin-user-btn cancel" onClick={handleCancel}>Hủy</button>
                            </>
                            ) : (
                            <>
                                <button className="admin-user-btn edit" onClick={() => handleEdit(user)}>
                                <FaEdit /> Sửa
                                </button>
                                <button className="admin-user-btn delete" onClick={() => handleDelete(user.id)}>
                                <FaTrash /> Xóa
                                </button>
                            </>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selected === "products" && (
          <div className="admin-user-list">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Danh sách Sản Phẩm</div>
            {loadingProducts ? (
              <div>Đang tải...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-user-table">
                  <thead>
  <tr>
    <th>ID</th>
    <th>Ảnh</th>
    <th>Tên sản phẩm</th>
    <th>SKU</th>
    <th>Giá</th>
    <th>Mô tả</th>
    <th>Trạng thái</th>
    <th>Category</th>
    <th>Tag</th>
    <th>Hành động</th>
    <th>Biến thể</th>
  </tr>
</thead>
<tbody>
  {products.map(product => (
    <React.Fragment key={product.productId}>
      <tr>
        <td>{product.productId}</td>
        <td>
          <img src={product.productImage} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
        </td>
        <td>
          {editingProduct === product.productId ? (
            <input
              type="text"
              className="admin-user-input"
              value={editProductData.productName}
              onChange={e => setEditProductData({ ...editProductData, productName: e.target.value })}
            />
          ) : (
            product.productName
          )}
        </td>
        <td>
          {editingProduct === product.productId ? (
            <input
              type="text"
              className="admin-user-input"
              value={editProductData.sku}
              onChange={e => setEditProductData({ ...editProductData, sku: e.target.value })}
            />
          ) : (
            product.sku
          )}
        </td>
        <td>
          {editingProduct === product.productId ? (
            <input
              type="number"
              className="admin-user-input"
              value={editProductData.price}
              onChange={e => setEditProductData({ ...editProductData, price: e.target.value })}
            />
          ) : (
            product.price
          )}
        </td>
        <td>
          {editingProduct === product.productId ? (
            <input
              type="text"
              className="admin-user-input"
              value={editProductData.description}
              onChange={e => setEditProductData({ ...editProductData, description: e.target.value })}
            />
          ) : (
            product.description
          )}
        </td>
        <td>
          {editingProduct === product.productId ? (
            <select
              className="admin-user-input"
              value={editProductData.published}
              onChange={e => setEditProductData({ ...editProductData, published: e.target.value === "true" })}
            >
              <option value="true">Đang bán</option>
              <option value="false">Ẩn</option>
            </select>
          ) : (
            product.published ? "Đang bán" : "Ẩn"
          )}
        </td>
        <td>
          {product.categories && product.categories.length > 0
            ? product.categories.map(c => c.categoryName).join(", ")
            : ""}
        </td>
        <td>
          {product.tags && product.tags.length > 0
            ? product.tags.map((t, idx) => (
                <span key={t.tagId}>
                  {t.tagName}
                  {idx < product.tags.length - 1 ? ", " : ""}
                </span>
              ))
            : ""}
        </td>
        <td>
          {editingProduct === product.productId ? (
            <>
              <button className="admin-user-btn save" onClick={() => handleSaveProduct(product.productId)}>Lưu</button>
              <button className="admin-user-btn cancel" onClick={handleCancelProduct}>Hủy</button>
            </>
          ) : (
            <>
              <button className="admin-user-btn edit" onClick={() => handleEditProduct(product)}>
                <FaEdit /> Sửa
              </button>
              <button className="admin-user-btn delete" onClick={() => handleDeleteProduct(product.productId)}>
                <FaTrash /> Xóa
              </button>
            </>
          )}
        </td>
        <td>
          <button
            className="admin-user-btn"
            onClick={() => handleOpenVariants(product.productId)}
            style={{ background: "#f1f8ff", color: "#1677ff" }}
          >
            <FaEye /> Xem
          </button>
        </td>
      </tr>
                        {/* Hiển thị bảng variant nếu mở */}
                        {openVariants === product.productId && (
                          <tr>
                            <td colSpan={9}>
                              <div style={{ background: "#f8fafd", borderRadius: 8, padding: 12, marginTop: 8 }}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>Biến thể sản phẩm</div>
                                {loadingVariants ? (
                                  <div>Đang tải...</div>
                                ) : (
                                  <table className="admin-user-table" style={{ background: "#f8fafd" }}>
                                    <thead>
                                      <tr>
                                        <th>Tên biến thể</th>
                                        <th>Giá trị</th>
                                        <th>Giá</th>
                                        <th>Kho</th>
                                        <th>Ảnh</th>
                                        <th>Hành động</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {variants.map(variant => (
                                        <tr key={variant.variantId}>
                                          <td>
                                            {editingVariant === variant.variantId ? (
                                              <input
                                                type="text"
                                                className="admin-user-input"
                                                value={editVariantData.variantName}
                                                onChange={e => setEditVariantData({ ...editVariantData, variantName: e.target.value })}
                                              />
                                            ) : (
                                              variant.variantName
                                            )}
                                          </td>
                                          <td>
                                            {editingVariant === variant.variantId ? (
                                              <input
                                                type="text"
                                                className="admin-user-input"
                                                value={editVariantData.variantValue}
                                                onChange={e => setEditVariantData({ ...editVariantData, variantValue: e.target.value })}
                                              />
                                            ) : (
                                              variant.variantValue
                                            )}
                                          </td>
                                          <td>
                                            {editingVariant === variant.variantId ? (
                                              <input
                                                type="number"
                                                className="admin-user-input"
                                                value={editVariantData.price}
                                                onChange={e => setEditVariantData({ ...editVariantData, price: e.target.value })}
                                              />
                                            ) : (
                                              variant.price
                                            )}
                                          </td>
                                          <td>
                                            {editingVariant === variant.variantId ? (
                                              <input
                                                type="number"
                                                className="admin-user-input"
                                                value={editVariantData.stockQuantity}
                                                onChange={e => setEditVariantData({ ...editVariantData, stockQuantity: e.target.value })}
                                              />
                                            ) : (
                                              variant.stockQuantity
                                            )}
                                          </td>
                                          <td>
                                            <img src={variant.productVariantImage} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                                          </td>
                                          <td>
                                            {editingVariant === variant.variantId ? (
                                              <>
                                                <button className="admin-user-btn save" onClick={() => handleSaveVariant(variant.variantId)}>Lưu</button>
                                                <button className="admin-user-btn cancel" onClick={handleCancelVariant}>Hủy</button>
                                              </>
                                            ) : (
                                              <>
                                                <button className="admin-user-btn edit" onClick={() => handleEditVariant(variant)}>
                                                  <FaEdit /> Sửa
                                                </button>
                                                <button className="admin-user-btn delete" onClick={() => handleDeleteVariant(variant.variantId)}>
                                                  <FaTrash /> Xóa
                                                </button>
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selected === "orders" && (
          <div className="admin-user-list">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Danh sách Đơn Hàng</div>
            {loadingOrders ? (
              <div>Đang tải...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Ngày đặt</th>
                      <th>Trạng thái</th>
                      <th>Shipper</th>
                      <th>Thanh toán</th>
                      <th>Vận chuyển</th>
                      <th>Tổng tiền</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <React.Fragment key={order.orderId}>
                        <tr>
                          <td>{order.orderId}</td>
                          <td>{order.userId}</td>
                          <td>{order.orderDate}</td>
                          <td>
                            {editingOrder === order.orderId ? (
                              <select
                                value={editOrderData.status}
                                onChange={e => setEditOrderData({ ...editOrderData, status: e.target.value })}
                                className="admin-user-input"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="REFUNDED">REFUNDED</option>
                              </select>
                            ) : (
                              order.status
                            )}
                          </td>
                          <td>
                            {editingOrder === order.orderId ? (
                              <select
                                value={editOrderData.shipperId}
                                onChange={e => setEditOrderData({ ...editOrderData, shipperId: e.target.value })}
                                className="admin-user-input"
                              >
                                <option value="">Chọn shipper</option>
                                {shipperUsers.map(u => (
                                  <option key={u.id} value={u.id}>
                                    {u.username} ({u.id.slice(0, 6)})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              order.shipperId || ""
                            )}
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td>{order.shippingMethod}</td>
                          <td>{order.amount}</td>
                          <td>
                            {editingOrder === order.orderId ? (
                              <>
                                <button className="admin-user-btn save" onClick={() => handleSaveOrder(order.orderId)}>Lưu</button>
                                <button className="admin-user-btn cancel" onClick={handleCancelEditOrder}>Hủy</button>
                              </>
                            ) : (
                              <>
                                <button className="admin-user-btn edit" onClick={() => handleEditOrder(order)}>
                                  <FaEdit /> Sửa
                                </button>
                                <button className="admin-user-btn delete" onClick={() => handleDeleteOrder(order.orderId)}>
                                  <FaTrash /> Xóa
                                </button>
                                <button
                                  className="admin-user-btn"
                                  style={{ background: "#f1f8ff", color: "#1677ff", marginLeft: 6 }}
                                  onClick={() => handleShowOrderItems(order)}
                                >
                                  Xem sản phẩm
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                        {openOrderItems === order.orderId && (
                          <tr>
                            <td colSpan={9}>
                              <div style={{ background: "#f8fafd", borderRadius: 8, padding: 12, marginTop: 8 }}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>Sản phẩm trong đơn hàng</div>
                                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                                  {(order.items || []).map(item => {
                                    const variant = orderVariantCache[item.variantId];
                                    return (
                                      <div key={item.orderItemId} style={{ minWidth: 180, background: "#fff", borderRadius: 6, padding: 8, boxShadow: "0 1px 4px #eee" }}>
                                        {variant ? (
                                          <>
                                            <img src={variant.productVariantImage} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginBottom: 6 }} />
                                            <div><b>{variant.variantValue}</b></div>
                                            <div>Số lượng: {item.quantity}</div>
                                            <div>Giá: {item.totalPrice}</div>
                                          </>
                                        ) : (
                                          <div>Đang tải...</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {selected === "vouchers" && (
          <div className="admin-user-list">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Danh sách Voucher</div>
            {loadingDiscounts ? (
              <div>Đang tải...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã voucher</th>
                      <th>Phần trăm giảm</th>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map(discount => (
                      <tr key={discount.discountId}>
                        <td>{discount.discountId}</td>
                        <td>
                          {editingDiscount === discount.discountId ? (
                            <input
                              type="text"
                              className="admin-user-input"
                              value={editDiscountData.discountCode}
                              onChange={e => setEditDiscountData({ ...editDiscountData, discountCode: e.target.value })}
                            />
                          ) : (
                            discount.discountCode
                          )}
                        </td>
                        <td>
                          {editingDiscount === discount.discountId ? (
                            <input
                              type="number"
                              className="admin-user-input"
                              value={editDiscountData.percentageOff}
                              onChange={e => setEditDiscountData({ ...editDiscountData, percentageOff: e.target.value })}
                            />
                          ) : (
                            discount.percentageOff
                          )}
                        </td>
                        <td>
                          {editingDiscount === discount.discountId ? (
                            <input
                              type="date"
                              className="admin-user-input"
                              value={editDiscountData.validFrom}
                              onChange={e => setEditDiscountData({ ...editDiscountData, validFrom: e.target.value })}
                            />
                          ) : (
                            discount.validFrom
                          )}
                        </td>
                        <td>
                          {editingDiscount === discount.discountId ? (
                            <input
                              type="date"
                              className="admin-user-input"
                              value={editDiscountData.validUntil}
                              onChange={e => setEditDiscountData({ ...editDiscountData, validUntil: e.target.value })}
                            />
                          ) : (
                            discount.validUntil
                          )}
                        </td>
                        <td>
                          {editingDiscount === discount.discountId ? (
                            <>
                              <button className="admin-user-btn save" onClick={() => handleSaveDiscount(discount.discountId)}>Lưu</button>
                              <button className="admin-user-btn cancel" onClick={handleCancelDiscount}>Hủy</button>
                            </>
                          ) : (
                            <>
                              <button className="admin-user-btn edit" onClick={() => handleEditDiscount(discount)}>
                                <FaEdit /> Sửa
                              </button>
                              <button className="admin-user-btn delete" onClick={() => handleDeleteDiscount(discount.discountId)}>
                                <FaTrash /> Xóa
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardBody;