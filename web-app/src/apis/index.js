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