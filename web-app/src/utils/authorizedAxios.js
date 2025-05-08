import axios from 'axios';
import { toast } from 'react-toastify';
import { handleLogoutAPI } from '../apis';

// 👉 Axios instance dùng cho request bình thường (có interceptor)
let authorizedAxiosInstance = axios.create({
  withCredentials: true,
  timeout: 1000 * 60 * 10,
});

// 👉 Axios instance KHÔNG có interceptor, dùng để gọi refreshToken tránh lặp
const plainAxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/ecommerce/', // 👈 backend server của bạn
    withCredentials: true,
  });

// Hàm tự decode JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

// Add request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {
          const decodedToken = decodeJWT(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);

          // Nếu token đã hết hạn
          if (decodedToken?.exp && currentTime > decodedToken.exp) {
            // Gọi refresh token bằng plainAxiosInstance
            const res = await plainAxiosInstance.post('auth/refresh', {
              token: accessToken,
            });

            const newAccessToken = res.data.result.token;

            localStorage.setItem('accessToken', newAccessToken);
            authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return authorizedAxiosInstance(originalRequest);
          }
        } catch (refreshError) {
          await handleLogoutAPI();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        await handleLogoutAPI();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    toast.error(error.response?.data?.message || error?.message);
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
