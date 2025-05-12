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

export const fetchProductsSortedByPrice = async (pageNo = 1, pageSize = 5, order = "asc") => {
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