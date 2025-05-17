import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaTags
} from "react-icons/fa";
import {
  fetchMyInfo,
  fetchInventoryByUserId,
  fetchProductVariants,
  deleteProductById,
  deleteProductVariantById,
  updateProductById,
  updateProductVariant,
  createProduct,
  createProductVariant,
  addProductToInventory,
  fetchCategories,
  addCategoryToProduct,
  fetchTags,
  addTagToProduct,
  fetchProductDetail,
  createCategory,
  deleteCategoryById,
  createTag,
  deleteTagById
} from "../../apis";
import "./ShopDashboardBody.css";

const shopMenuItems = [
  { key: "products", icon: <FaBoxOpen color="#1677ff" />, label: "Quản Lý Sản Phẩm" },
  { key: "categories", icon: <FaTags color="#1677ff" />, label: "Quản Lý Category" },
  { key: "tags", icon: <FaTags color="#1677ff" />, label: "Quản Lý Tag" }
];

const ShopDashboardBody = () => {
  const [selected, setSelected] = useState("products");
  const [shopInfo, setShopInfo] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [products, setProducts] = useState([]);
  const [openVariants, setOpenVariants] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // State cho edit sản phẩm
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({});

  // State cho edit variant
  const [editingVariant, setEditingVariant] = useState(null);
  const [editVariantData, setEditVariantData] = useState({});

  // State cho modal thêm sản phẩm/biến thể
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState({}); // { [productId]: true/false }

  // State cho form thêm sản phẩm
  const [addProductData, setAddProductData] = useState({
    productName: "",
    sku: "",
    price: "",
    description: "",
    productImageFile: null,
    productWeight: "",
    published: "true"
  });

  // State cho form thêm biến thể
  const [addVariantData, setAddVariantData] = useState({}); // { [productId]: { ...fields } }

  // State cho category
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(null); // productId hoặc null
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // State cho tag
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(null); // productId hoặc null
  const [selectedTagId, setSelectedTagId] = useState("");

  // State cho quản lý category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryData, setAddCategoryData] = useState({
    categoryName: "",
    categoryDescription: "",
    active: true,
    categoryImage: null
  });

  // State cho quản lý tag
  const [showAddTagModal, setShowAddTagModal] = useState(false);
 const [addTagData, setAddTagData] = useState({ tagName: "" });

  useEffect(() => {
    fetchMyInfo().then(async info => {
      setShopInfo(info);
      // Lấy inventory theo userId
      const inventories = await fetchInventoryByUserId(info.id);
      if (inventories && inventories.length > 0) {
        setInventory(inventories[0]);
        // Lấy tất cả product từ productInventories
        const productList = inventories[0].productInventories.map(pi => ({
          ...pi.product,
          quantity: pi.quantity
        }));
        // Lấy tag cho từng sản phẩm
        const productWithTags = await Promise.all(
          productList.map(async (p) => {
            try {
              const detail = await fetchProductDetail(p.productId);
              return { ...p, tags: detail.tags || [] };
            } catch {
              return { ...p, tags: [] };
            }
          })
        );
        setProducts(productWithTags);
      }
    });
    // Fetch tất cả category
    fetchCategories().then(setCategories);
    // Fetch tất cả tag
    fetchTags().then(setTags);
  }, []);

  // Xem biến thể sản phẩm
  const handleOpenVariants = async (productId) => {
    setOpenVariants(openVariants === productId ? null : productId);
    if (openVariants !== productId) {
      setLoadingVariants(true);
      const data = await fetchProductVariants(productId);
      setVariants(data || []);
      setLoadingVariants(false);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProductById(productId);
        setProducts(products.filter(p => p.productId !== productId));
      } catch (error) {
        alert("Vui lòng xóa order trước khi xóa sản phẩm");
      }
    }
  };

  // Xóa variant
  const handleDeleteVariant = async (variantId) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này?")) {
      try {
        await deleteProductVariantById(variantId);
        setVariants(variants.filter(v => v.variantId !== variantId));
      } catch (error) {
        alert("Vui lòng xóa order trước khi xóa sản phẩm");
      }
    }
  };

  // Sửa sản phẩm
  const handleEditProduct = (product) => {
    setEditingProduct(product.productId);
    setEditProductData({
      productName: product.productName,
      sku: product.sku,
      price: product.price,
      description: product.description,
      published: product.published,
      productWeight: product.productWeight,
    });
  };

  const handleSaveProduct = async (productId) => {
    const oldProduct = products.find(p => p.productId === productId);
    const body = { ...oldProduct, ...editProductData };
    await updateProductById(productId, body);
    setProducts(products.map(p =>
      p.productId === productId ? { ...p, ...body } : p
    ));
    setEditingProduct(null);
    setEditProductData({});
  };

  const handleCancelEditProduct = () => {
    setEditingProduct(null);
    setEditProductData({});
  };

  // Sửa variant
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
    const oldVariant = variants.find(v => v.variantId === variantId);
    const body = { ...oldVariant, ...editVariantData };
    await updateProductVariant(variantId, body);
    setVariants(variants.map(v =>
      v.variantId === variantId ? { ...v, ...body } : v
    ));
    setEditingVariant(null);
    setEditVariantData({});
  };

  const handleCancelEditVariant = () => {
    setEditingVariant(null);
    setEditVariantData({});
  };

  // Thêm sản phẩm
  const handleAddProductChange = e => {
    const { name, value, files } = e.target;
    setAddProductData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleCreateProduct = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(addProductData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const product = await createProduct(formData);
      // Thêm vào inventory
      await addProductToInventory({
        productId: product.productId,
        inventoryId: inventory.inventoryId,
        quantity: 999
      });
      // Lấy chi tiết sản phẩm để lấy tag
      const detail = await fetchProductDetail(product.productId);
      setProducts([...products, { ...product, tags: detail.tags || [], quantity: 999 }]);
      setShowAddProduct(false);
      setAddProductData({
        productName: "",
        sku: "",
        price: "",
        description: "",
        productImageFile: null,
        productWeight: "",
        published: "true"
      });
      alert("Tạo sản phẩm thành công!");
    } catch (err) {
      alert("Có lỗi khi tạo sản phẩm!");
    }
  };

  // Thêm biến thể
  const handleAddVariantChange = (e, productId) => {
    const { name, value, files } = e.target;
    setAddVariantData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [name]: files ? files[0] : value
      }
    }));
  };

  const handleCreateVariant = async (e, productId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const data = addVariantData[productId] || {};
      formData.append("variantName", data.variantName || "");
      formData.append("variantValue", data.variantValue || "");
      formData.append("price", data.price || "");
      formData.append("stockQuantity", data.stockQuantity || "");
      formData.append("productId", productId);
      if (data.productVariantImageFile) {
        formData.append("productVariantImageFile", data.productVariantImageFile);
      }
      await createProductVariant(formData);
      setShowAddVariant({ ...showAddVariant, [productId]: false });
      setAddVariantData(prev => ({ ...prev, [productId]: {} }));
      alert("Tạo biến thể thành công!");
      // Có thể reload lại biến thể nếu muốn
    } catch (err) {
      alert("Có lỗi khi tạo biến thể!");
    }
  };

  // Hiển thị modal chọn category để add vào product
  const handleShowAddCategory = (productId) => {
    setShowCategoryModal(productId);
    setSelectedCategoryId("");
  };

  // Thêm category vào product
  const handleAddCategoryToProduct = async () => {
    if (!selectedCategoryId) return;
    try {
      await addCategoryToProduct(showCategoryModal, selectedCategoryId);
      setProducts(products =>
        products.map(p =>
          p.productId === showCategoryModal
            ? {
                ...p,
                categories: [
                  ...(p.categories || []),
                  categories.find(c => c.categoryId === selectedCategoryId)
                ]
              }
            : p
        )
      );
      setShowCategoryModal(null);
      setSelectedCategoryId("");
      alert("Thêm category thành công!");
    } catch (err) {
      alert("Có lỗi khi thêm category!");
    }
  };

  // Hiển thị modal chọn tag để add vào product
  const handleShowAddTag = (productId) => {
    setShowTagModal(productId);
    setSelectedTagId("");
  };

  // Thêm tag vào product
  const handleAddTagToProduct = async () => {
    if (!selectedTagId) return;
    try {
      await addTagToProduct(showTagModal, selectedTagId);
      // Lấy lại chi tiết sản phẩm để cập nhật tag mới nhất
      const updatedProduct = await fetchProductDetail(showTagModal);
      setProducts(products =>
        products.map(p =>
          p.productId === showTagModal
            ? { ...p, tags: updatedProduct.tags || [] }
            : p
        )
      );
      setShowTagModal(null);
      setSelectedTagId("");
      alert("Thêm tag thành công!");
    } catch (err) {
      alert("Có lỗi khi thêm tag!");
    }
  };

  // Quản lý category
  const handleAddCategoryChange = e => {
    const { name, value, files, type, checked } = e.target;
    setAddCategoryData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (files ? files[0] : value)
    }));
  };

  const handleCreateCategory = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("categoryName", addCategoryData.categoryName);
      formData.append("categoryDescription", addCategoryData.categoryDescription);
      formData.append("active", addCategoryData.active ? "true" : "false");
      if (addCategoryData.categoryImage) {
        formData.append("categoryImage", addCategoryData.categoryImage);
      }
      await createCategory(formData);
      setShowAddCategory(false);
      setAddCategoryData({
        categoryName: "",
        categoryDescription: "",
        active: true,
        categoryImage: null
      });
      fetchCategories().then(setCategories);
      alert("Tạo category thành công!");
    } catch (err) {
      alert("Có lỗi khi tạo category!");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc muốn xóa category này?")) {
      try {
        await deleteCategoryById(categoryId);
        setCategories(categories.filter(c => c.categoryId !== categoryId));
      } catch (err) {
        alert("Không thể xóa category này!");
      }
    }
  };

  // Quản lý tag
  const handleAddTagChange = e => {
  const { name, value } = e.target;
  setAddTagData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleCreateTag = async e => {
    e.preventDefault();
    try {
      await createTag(addTagData);
      setShowAddTagModal(false);
      setAddTagData({ tagName: "" });      
      fetchTags().then(setTags);
      alert("Tạo tag thành công!");
    } catch (err) {
      alert("Có lỗi khi tạo tag!");
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm("Bạn có chắc muốn xóa tag này?")) {
      try {
        await deleteTagById(tagId);
        setTags(tags.filter(t => t.tagId !== tagId));
      } catch (err) {
        alert("Không thể xóa tag này!");
      }
    }
  };


  return (
    <div className="userpage-body-container">
      <div className="userpage-sidebar">
        <div className="userpage-profile">
          <div className="userpage-avatar">
            <FaUserCircle size={56} color="#cccccc" />
          </div>
          <div className="userpage-username">
            {shopInfo ? shopInfo.username : "shop"}
          </div>
          <div className="userpage-edit-profile">🛒 Shop Dashboard</div>
        </div>
        <div>
          {shopMenuItems.map(item => (
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
        {selected === "products" && (
          <div className="admin-user-list">
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Danh sách Sản Phẩm</span>
              <button
                className="admin-user-btn"
                style={{ background: "#1677ff", color: "#fff" }}
                onClick={() => setShowAddProduct(true)}
              >
                + Thêm sản phẩm
              </button>
            </div>
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
                    <th>Kho</th>
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
                            product.description && product.description.length > 40
                              ? product.description.slice(0, 40) + "..."
                              : product.description
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
                          <button
                            className="admin-user-btn"
                            style={{ marginLeft: 8, padding: "2px 8px" }}
                            onClick={() => handleShowAddCategory(product.productId)}
                            title="Thêm category"
                          >
                            <FaPlus /> Thêm
                          </button>
                        </td>
                        <td>
                          {product.tags && product.tags.length > 0 && (
                            <span>
                              {product.tags.map((t, idx) => (
                                <span key={t.tagId}>
                                  {t.tagName}
                                  {idx < product.tags.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          )}
                          <button
                            className="admin-user-btn"
                            style={{ marginLeft: 8, padding: "2px 8px" }}
                            onClick={() => handleShowAddTag(product.productId)}
                            title="Thêm tag"
                          >
                            <FaPlus /> Thêm
                          </button>
                        </td>
                        <td>{product.quantity}</td>
                        <td>
                          {editingProduct === product.productId ? (
                            <>
                              <button className="admin-user-btn save" onClick={() => handleSaveProduct(product.productId)}>Lưu</button>
                              <button className="admin-user-btn cancel" onClick={handleCancelEditProduct}>Hủy</button>
                            </>
                          ) : (
                            <div className="action-btn-group">
                              <button
                                className="admin-user-btn"
                                onClick={() => setShowAddVariant({ ...showAddVariant, [product.productId]: true })}
                              >
                                add biến thể
                              </button>
                              <button className="admin-user-btn edit" onClick={() => handleEditProduct(product)}>
                                <FaEdit /> Sửa
                              </button>
                              <button className="admin-user-btn delete" onClick={() => handleDeleteProduct(product.productId)}>
                                <FaTrash /> Xóa
                              </button>
                            </div>
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
                      {/* Modal thêm category */}
                      {showCategoryModal === product.productId && (
                        <tr>
                          <td colSpan={12}>
                            <div className="modal" style={{ display: "flex", justifyContent: "center" }}>
                              <div className="modal-content" style={{ minWidth: 320 }}>
                                <h4>Thêm category cho sản phẩm</h4>
                                <select
                                  className="admin-user-input"
                                  value={selectedCategoryId}
                                  onChange={e => setSelectedCategoryId(e.target.value)}
                                >
                                  <option value="">Chọn category</option>
                                  {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                      {cat.categoryName}
                                    </option>
                                  ))}
                                </select>
                                <div style={{ marginTop: 12 }}>
                                  <button
                                    className="admin-user-btn save"
                                    onClick={handleAddCategoryToProduct}
                                    disabled={!selectedCategoryId}
                                  >
                                    Thêm
                                  </button>
                                  <button
                                    className="admin-user-btn cancel"
                                    style={{ marginLeft: 8 }}
                                    onClick={() => setShowCategoryModal(null)}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* Modal thêm tag */}
                      {showTagModal === product.productId && (
                        <tr>
                          <td colSpan={12}>
                            <div className="modal" style={{ display: "flex", justifyContent: "center" }}>
                              <div className="modal-content" style={{ minWidth: 320 }}>
                                <h4>Thêm tag cho sản phẩm</h4>
                                <select
                                  className="admin-user-input"
                                  value={selectedTagId}
                                  onChange={e => setSelectedTagId(e.target.value)}
                                >
                                  <option value="">Chọn tag</option>
                                  {tags.map(tag => (
                                    <option key={tag.tagId} value={tag.tagId}>
                                      {tag.tagName}
                                    </option>
                                  ))}
                                </select>
                                <div style={{ marginTop: 12 }}>
                                  <button
                                    className="admin-user-btn save"
                                    onClick={handleAddTagToProduct}
                                    disabled={!selectedTagId}
                                  >
                                    Thêm
                                  </button>
                                  <button
                                    className="admin-user-btn cancel"
                                    style={{ marginLeft: 8 }}
                                    onClick={() => setShowTagModal(null)}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* Modal thêm biến thể */}
                      {showAddVariant[product.productId] && (
                        <tr>
                          <td colSpan={12}>
                            <div className="modal">
                              <div className="modal-content">
                                <h4>Thêm biến thể cho sản phẩm</h4>
                                <form
                                  onSubmit={e => handleCreateVariant(e, product.productId)}
                                >
                                  <input
                                    name="variantName"
                                    placeholder="Tên biến thể"
                                    required
                                    className="admin-user-input"
                                    value={addVariantData[product.productId]?.variantName || ""}
                                    onChange={e => handleAddVariantChange(e, product.productId)}
                                  />
                                  <input
                                    name="variantValue"
                                    placeholder="Giá trị biến thể"
                                    required
                                    className="admin-user-input"
                                    value={addVariantData[product.productId]?.variantValue || ""}
                                    onChange={e => handleAddVariantChange(e, product.productId)}
                                  />
                                  <input
                                    name="price"
                                    type="number"
                                    placeholder="Giá"
                                    required
                                    className="admin-user-input"
                                    value={addVariantData[product.productId]?.price || ""}
                                    onChange={e => handleAddVariantChange(e, product.productId)}
                                  />
                                  <input
                                    name="stockQuantity"
                                    type="number"
                                    placeholder="Kho"
                                    required
                                    className="admin-user-input"
                                    value={addVariantData[product.productId]?.stockQuantity || ""}
                                    onChange={e => handleAddVariantChange(e, product.productId)}
                                  />
                                  <input
                                    name="productVariantImageFile"
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="admin-user-input"
                                    onChange={e => handleAddVariantChange(e, product.productId)}
                                  />
                                  <div style={{ marginTop: 12 }}>
                                    <button className="admin-user-btn save" type="submit">Tạo</button>
                                    <button className="admin-user-btn cancel" type="button" onClick={() => setShowAddVariant({ ...showAddVariant, [product.productId]: false })}>Hủy</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* Modal thêm biến thể end */}
                      {openVariants === product.productId && (
                        <tr>
                          <td colSpan={12}>
                            <div style={{ background: "#f8fafd", borderRadius: 8, padding: 12, marginTop: 8 }}>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>Biến thể sản phẩm</div>
                              {loadingVariants ? (
                                <div>Đang tải...</div>
                              ) : (
                                <table className="admin-user-table" style={{ background: "#f8fafd" }}>
                                  <thead>
                                    <tr>
                                      <th>ID</th>
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
                                        <td>{variant.variantId}</td>
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
                                              <button className="admin-user-btn cancel" onClick={handleCancelEditVariant}>Hủy</button>
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
            {/* Modal thêm sản phẩm */}
            {showAddProduct && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Thêm sản phẩm mới</h3>
                  <form onSubmit={handleCreateProduct}>
                    <input
                      name="productName"
                      placeholder="Tên sản phẩm"
                      required
                      className="admin-user-input"
                      value={addProductData.productName}
                      onChange={handleAddProductChange}
                    />
                    <input
                      name="sku"
                      placeholder="SKU"
                      required
                      className="admin-user-input"
                      value={addProductData.sku}
                      onChange={handleAddProductChange}
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="Giá"
                      required
                      className="admin-user-input"
                      value={addProductData.price}
                      onChange={handleAddProductChange}
                    />
                    <textarea
                      name="description"
                      placeholder="Mô tả"
                      className="admin-user-input"
                      value={addProductData.description}
                      onChange={handleAddProductChange}
                    />
                    <input
                      name="productImageFile"
                      type="file"
                      accept="image/*"
                      required
                      className="admin-user-input"
                      onChange={handleAddProductChange}
                    />
                    <input
                      name="productWeight"
                      type="number"
                      placeholder="Khối lượng"
                      required
                      className="admin-user-input"
                      value={addProductData.productWeight}
                      onChange={handleAddProductChange}
                    />
                    <select
                      name="published"
                      className="admin-user-input"
                      value={addProductData.published}
                      onChange={handleAddProductChange}
                    >
                      <option value="true">Đang bán</option>
                      <option value="false">Ẩn</option>
                    </select>
                    <div style={{ marginTop: 12 }}>
                      <button className="admin-user-btn save" type="submit">Tạo</button>
                      <button className="admin-user-btn cancel" type="button" onClick={() => setShowAddProduct(false)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {selected === "categories" && (
          <div className="admin-user-list">
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Danh sách Category</span>
              <button
                className="admin-user-btn"
                style={{ background: "#1677ff", color: "#fff" }}
                onClick={() => setShowAddCategory(true)}
              >
                + Thêm category
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên category</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.categoryId}>
                      <td>
                        <img src={cat.categoryImagePath} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                      </td>
                      <td>{cat.categoryName}</td>
                      <td>{cat.categoryDescription}</td>
                      <td>
                        {cat.active ? (
                          <span style={{ color: "#1677ff", fontWeight: 500 }}>Hoạt động</span>
                        ) : (
                          <span style={{ color: "#aaa" }}>Ẩn</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="admin-user-btn delete"
                          onClick={() => handleDeleteCategory(cat.categoryId)}
                        >
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal thêm category */}
            {showAddCategory && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Thêm category mới</h3>
                  <form onSubmit={handleCreateCategory}>
                    <input
                      name="categoryName"
                      placeholder="Tên category"
                      required
                      className="admin-user-input"
                      value={addCategoryData.categoryName}
                      onChange={handleAddCategoryChange}
                    />
                    <input
                      name="categoryDescription"
                      placeholder="Mô tả"
                      required
                      className="admin-user-input"
                      value={addCategoryData.categoryDescription}
                      onChange={handleAddCategoryChange}
                    />
                    <input
                      name="categoryImage"
                      type="file"
                      accept="image/*"
                      required
                      className="admin-user-input"
                      onChange={handleAddCategoryChange}
                    />
                    <label style={{ marginTop: 8, display: "block" }}>
                      <input
                        type="checkbox"
                        name="active"
                        checked={addCategoryData.active}
                        onChange={handleAddCategoryChange}
                        style={{ marginRight: 6 }}
                      />
                      Hoạt động
                    </label>
                    <div style={{ marginTop: 12 }}>
                      <button className="admin-user-btn save" type="submit">Tạo</button>
                      <button className="admin-user-btn cancel" type="button" onClick={() => setShowAddCategory(false)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          
        )}
        {selected === "tags" && (
          <div className="admin-user-list">
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Danh sách Tag</span>
              <button
                className="admin-user-btn"
                style={{ background: "#1677ff", color: "#fff" }}
                onClick={() => setShowAddTagModal(true)}
              >
                + Thêm tag
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>ID</th>
                    <th style={{ textAlign: "center" }}>Tên tag</th>
                    <th style={{ textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map(tag => (
                    <tr key={tag.tagId}>
                      <td >{tag.tagId}</td>
                      <td style={{ textAlign: "center" }}>{tag.tagName}</td>
                      <td style={{ textAlign: "center" }}> 
                        <button
                          className="admin-user-btn delete"
                          onClick={() => handleDeleteTag(tag.tagId)}
                        >
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal thêm tag */}
            {showAddTagModal && (
            <div className="modal">
                <div className="modal-content">
                <h3>Thêm tag mới</h3>
                <form onSubmit={handleCreateTag}>
                    <input
                    name="tagName"
                    placeholder="Tên tag"
                    required
                    className="admin-user-input"
                    value={addTagData.tagName}
                    onChange={handleAddTagChange}
                    />
                    <div style={{ marginTop: 12 }}>
                    <button className="admin-user-btn save" type="submit">Tạo</button>
                    <button className="admin-user-btn cancel" type="button" onClick={() => setShowAddTagModal(false)}>Hủy</button>
                    </div>
                </form>
                </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboardBody;