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