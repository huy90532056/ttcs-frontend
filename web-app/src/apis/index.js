import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const handleLogoutAPI = async () => {
    const token = localStorage.getItem('accessToken'); 

    localStorage.removeItem('accessToken');

    await authorizedAxiosInstance.post(`${API_ROOT}/ecommerce/auth/logout`, { 
        token: token 
    });
}


export const refreshTokenAPI = async (accessToken) => {
    return await authorizedAxiosInstance.post(`${API_ROOT}/ecommerce/auth/refresh`, {
        token: accessToken
    })
}

export const fetchMyInfo = async () => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/users/myInfo`
    );
    return response.data.result;
};

export const fetchCategories = async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/ecommerce/categories`);
    return response.data.result;
};

export const fetchProductsByCategory = async (categoryId) => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products/category/${categoryId}`
    );
    return response.data.result;
};

export const fetchProductsSortedByPrice = async (pageNo = 1, pageSize = 6, order = "asc") => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products/list/sort?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=price:${order}`
    );
    return response.data.result;
};

export const fetchTags = async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/ecommerce/tags`);
    return response.data.result;
};

export const fetchProductsByTag = async (tagId) => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products/tag/${tagId}`
    );
    return response.data.result;
};

export const fetchProductDetail = async (productId) => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products/${productId}`
    );
    return response.data.result;
};
export const fetchProductVariants = async (productId) => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/product-variants/product/${productId}`
    );
    return response.data.result;
};
export const fetchAllProducts = async () => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products`
    );
    return response.data.result;
};

export const fetchAllInventories = async () => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/inventories`
    );
    return response.data.result;
};

export const fetchProductsBySearch = async ({ pageNo = 0, pageSize = 10, search = ""}) => {
    const params = new URLSearchParams();
    params.append("pageNo", pageNo);
    params.append("pageSize", pageSize);
    if (search) params.append("search", search);

    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/products/list/sort/multiple/search?${params.toString()}`
    );
    return response.data.result;
};


export const fetchProductsBySearchAndSort = async ({
  pageNo = 1,
  pageSize = 10,
  sortDir = "asc",
  search = ""
}) => {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);
  params.append("sortDir", sortDir);
  if (search) params.append("search", search);

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/products/list/sort/search?${params.toString()}`
  );
  return response.data.result;
};

export const fetchProductsByCategoryAndSort = async ({
  pageNo = 1,
  pageSize = 10,
  sortDir = "asc",
  categoryId = ""
}) => {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);
  params.append("sortDir", sortDir);
  if (categoryId) params.append("categoryId", categoryId);

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/products/list/sort/category?${params.toString()}`
  );
  return response.data.result;
};

export const getInventoryIdByProductId = async (productId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/inventories/product/${productId}`
  );
  return response.data.result;
};

export const getInventoryById = async (inventoryId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/inventories/${inventoryId}`
  );
  return response.data.result;
};

export const fetchReviewsByProductId = async (productId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/reviews/product/${productId}`
  );
  return response.data.result;
};

export const fetchUserById = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/users/${userId}`
  );
  return response.data.result;
};

export const fetchDiscounts = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/discounts`
  );
  return response.data.result;
};

export const claimUserDiscount = async ({ userId, discountId }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/user-discounts`,
    { userId, discountId }
  );
  return response.data.result;
};

export const createCart = async (userId) => {
    const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/ecommerce/carts`,
        { userId }
    );
    return response.data.result;
};

export const fetchCartByUserId = async (userId) => {
    const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/ecommerce/carts/user/${userId}`
    );
    return response.data.result;
};

export const addCartItem = async ({ quantity, variantId, cartId }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/cart-items`,
    { quantity, variantId, cartId }
  );
  return response.data.result;
};

export const fetchProductVariantById = async (variantId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/product-variants/${variantId}`
  );
  return response.data.result;
};

export const deleteCartItem = async (cartItemId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/cart-items/${cartItemId}`
  );
  return response.data.result;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/cart-items/${cartItemId}`,
    { quantity }
  );
  return response.data.result;
};

export const fetchUserVouchers = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/user-discounts/user/${userId}`
  );
  return response.data.result;
};

export const fetchDiscountById = async (discountId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/discounts/${discountId}`
  );
  return response.data.result;
};

export const createOrder = async ({
  userId,
  orderDate,
  status,
  shippingMethod,
  paymentMethod,
  amount
}) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/orders`,
    {
      userId,
      orderDate,
      status,
      shippingMethod,
      paymentMethod,
      amount
    }
  );
  return response.data.result;
};

export const fetchOrdersByUserId = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/orders/user/${userId}`
  );
  return response.data.result;
};

export const createOrderItem = async ({
  variantId,
  quantity,
  totalPrice,
  orderId
}) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/order-items`,
    {
      variantId,
      quantity,
      totalPrice,
      orderId
    }
  );
  return response.data.result;
};

export const applyUserDiscount = async (userDiscountId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/user-discounts/${userDiscountId}/use`
  );
  return response.data.result;
};

export const updateProductVariant = async (variantId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/product-variants/${variantId}`,
    data
  );
  return response.data.result;
};

export const clearCartById = async (cartId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/carts/${cartId}/clear`
  );
  return response.data.result;
};

export const fetchNotificationsByUserId = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/notifications/user/${userId}`
  );
  return response.data.result;
};

export const fetchOrderItemById = async (orderItemId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/order-items/${orderItemId}`
  );
  return response.data.result;
};

export const updateUserById = async (userId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/users/${userId}`,
    data
  );
  return response.data.result;
};

export const fetchAllUsers = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/users`
  );
  return response.data.result;
};

export const deleteUserById = async (userId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/users/${userId}`
  );
  return response.data.result;
};

export const deleteProductVariantById = async (variantId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/product-variants/${variantId}`
  );
  return response.data.result;
};

export const deleteProductById = async (productId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/products/${productId}`
  );
  return response.data.result;
};

export const updateProductById = async (productId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/products/${productId}`,
    data
  );
  return response.data.result;
};

export const fetchAllOrders = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/orders`
  );
  return response.data.result;
};

export const updateOrderById = async (orderId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/orders/${orderId}`,
    data
  );
  return response.data.result;
};

export const deleteOrderById = async (orderId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/orders/${orderId}`
  );
  return response.data.result;
};

export const updateDiscountById = async (discountId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/discounts/${discountId}`,
    data
  );
  return response.data.result;
};

export const deleteDiscountById = async (discountId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/discounts/${discountId}`
  );
  return response.data.result;
};

export const fetchInventoryByUserId = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/inventories/user/${userId}`
  );
  return response.data.result;
};

export const createProduct = async (formData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/products`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data.result;
};

export const createProductVariant = async (formData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/product-variants`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data.result;
};

export const addProductToInventory = async ({ productId, inventoryId, quantity = 999 }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/product-inventories`,
    { productId, inventoryId, quantity }
  );
  return response.data.result;
};

export const addCategoryToProduct = async (productId, categoryId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/products/${productId}/categories/${categoryId}`
  );
  return response.data.result;
};

export const addTagToProduct = async (productId, tagId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/ecommerce/products/${productId}/tags/${tagId}`
  );
  return response.data.result;
};

export const createCategory = async (formData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/categories`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data.result;
};

export const deleteCategoryById = async (categoryId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/categories/${categoryId}`
  );
  return response.data.result;
};

export const createTag = async ({ tagName }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/tags`,
    { tagName }
  );
  return response.data.result;
};
export const deleteTagById = async (tagId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/tags/${tagId}`
  );
  return response.data.result;
};

export const createUser = async (userData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/users`,
    userData
  );
  return response.data.result;
};

export const createInventory = async ({ userId, imageFile }) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("imageFile", imageFile);

  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/inventories`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data.result;
};

export const createDiscount = async ({ discountCode, percentageOff, validFrom, validUntil }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/discounts`,
    { discountCode, percentageOff, validFrom, validUntil }
  );
  return response.data.result;
};

export const createReview = async ({ userId, productId, comment, rating }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/ecommerce/reviews`,
    { userId, productId, comment, rating }
  );
  return response.data.result;
};

export const deleteReviewById = async (reviewId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/ecommerce/reviews/${reviewId}`
  );
  return response.data.result;
};

export const createVnPayPayment = async ({ amount, bankCode }) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/ecommerce/payments/vn-pay?amount=${amount}&bankCode=${bankCode}`
  );
  return response.data.result;
};