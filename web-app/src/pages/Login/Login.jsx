import React, { useState } from "react";
import { OAuthConfig } from "../../configurations/configuration";
import { setToken } from "../../services/localStorageService";
import { useNavigate, Link } from "react-router-dom";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImg from "../../assets/images/register-page/background.png";
import shopeeLogiImg from "../../assets/images/header/header__cart/Shopee.svg.webp";
import shopeeBackgroundIMG from "../../assets/images/header/header__cart/image.png";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    authorizedAxiosInstance
      .post("http://localhost:8080/ecommerce/auth/token", {
        username,
        password,
      })
      .then((response) => {
        const data = response.data;
        if (data.code !== 1000) throw new Error(data.message);
        setToken(data.result?.token);
        navigate("/");
      })
      .catch(() => {
        alert("Sai tài khoản hoặc mật khẩu!");
      });
  };

  const handleContinueWithGoogle = () => {
    const { redirectUri, authUri, clientId } = OAuthConfig;
    const targetUrl = `${authUri}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&client_id=${clientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  return (
    <div className="login-page">
      {/* Header */}
      <div className="login-page__header">
        <div className="d-flex align-items-center">
        <Link to="/" className="login-page__header-shopee__link">
          <img
          src={shopeeLogiImg}
          alt="Shopee Logo"
          style={{ height: 40, width: "auto" }}
          />
        </Link>
          <span className="login-page__header-title">Đăng nhập</span>
        </div>
        <a href="#" className="login-page__header-help">
          Cần trợ giúp?
        </a>
      </div>

      {/* Main Content */}
      <div className="login-page__main">
        <div className="row w-100">
          {/* Left Section */}
          <div className="col-md-7 d-none d-md-flex flex-column align-items-center justify-content-center text-white text-center login-page__left">
            <img
            src={shopeeBackgroundIMG}></img>
            <div className="login-page__left-desc">
              Nền tảng thương mại điện tử <br />
              yêu thích ở Đông Nam Á & Đài Loan
            </div>
          </div>
          {/* Right Section */}
          <div className="col-md-5 d-flex align-items-center justify-content-center">
            <div className="login-page__form-box w-100">
              <h2 className="login-page__form-title mb-4">Đăng Nhập</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tên Người Dùng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn w-100 mb-3 login-page__login-btn">
                  ĐĂNG NHẬP
                </button>
              </form>
              <div className="d-flex justify-content-between mb-3 login-page__form-links">
                <a href="#" className="text-decoration-none">
                  Quên mật khẩu
                </a>
                <a href="#" className="text-decoration-none">
                  Đăng nhập với SMS
                </a>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="login-page__divider"></div>
                <span className="mx-2 login-page__or-text">HOẶC</span>
                <div className="login-page__divider"></div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <button
                  className="btn w-100 me-2 d-flex align-items-center justify-content-center login-page__social-btn login-page__facebook-btn"
                >
                  {/* Facebook icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05h2.03V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258V8.05h2.218l-.355 2.326h-1.863v5.625C13.074 15.397 16 12.067 16 8.049z" />
                  </svg>
                  Facebook
                </button>
                <button
                  className="btn w-100 me-2 d-flex align-items-center justify-content-center login-page__social-btn login-page__google-btn"
                  onClick={handleContinueWithGoogle}
                >
                  {/* Google icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    className="me-2"
                  >
                    <g>
                      <path
                        fill="#4285F4"
                        d="M43.611 20.083h-1.861V20H24v8h11.303C33.962 32.083 29.418 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.813.857 6.674 2.278l6.342-6.342C33.084 6.532 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                      />
                      <path
                        fill="#34A853"
                        d="M6.306 14.691l6.571 4.819C14.655 16.104 19.001 13 24 13c2.507 0 4.813.857 6.674 2.278l6.342-6.342C33.084 6.532 28.761 5 24 5c-7.732 0-14.39 4.388-17.694 10.691z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M24 45c5.318 0 10.17-1.828 13.963-4.969l-6.463-5.309C29.418 35 24 35 24 35c-5.418 0-9.962-2.917-11.303-7.083l-6.571 4.819C9.61 40.612 16.268 45 24 45z"
                      />
                      <path
                        fill="#EA4335"
                        d="M43.611 20.083h-1.861V20H24v8h11.303C33.962 32.083 29.418 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.813.857 6.674 2.278l6.342-6.342C33.084 6.532 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                      />
                    </g>
                  </svg>
                  Google
                </button>
                <button
                  className="btn w-100 d-flex align-items-center justify-content-center login-page__social-btn login-page__apple-btn"
                >
                  {/* Apple icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.682 1.007c0 1.014-.82 2.06-1.822 2.06-.09 0-.18-.01-.27-.03-.01-.08-.02-.16-.02-.25 0-1.01.83-2.06 1.82-2.06.09 0 .18.01.27.03.01.08.02.16.02.25zm-1.62 2.8c.99 0 1.74.67 2.59.67.85 0 1.23-.65 2.59-.65 1.04 0 1.7.5 2.16 1.01-1.4.68-2.01 2.17-2.01 3.42 0 2.01 1.64 2.68 1.64 2.68-.41 1.18-1.34 2.56-2.7 2.56-.8 0-1.13-.51-2.1-.51-.97 0-1.34.51-2.11.51-1.36 0-2.34-1.39-2.75-2.57 0 0 1.65-.67 1.65-2.68 0-1.25-.62-2.74-2.02-3.42.47-.51 1.13-1.01 2.17-1.01zm-1.62 10.19c.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02.36 0 .72.01 1.08.02.01-.01.02-.01.03-.01.01 0 .02 0 .03.01.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02.36 0 .72.01 1.08.02.01-.01.02-.01.03-.01.01 0 .02 0 .03.01.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02.36 0 .72.01 1.08.02.01-.01.02-.01.03-.01.01 0 .02 0 .03.01.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02.36 0 .72.01 1.08.02.01-.01.02-.01.03-.01.01 0 .02 0 .03.01.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02.36 0 .72.01 1.08.02.01-.01.02-.01.03-.01.01 0 .02 0 .03.01.36.01.72.02 1.08.02.36 0 .72-.01 1.08-.02.01.01.02.01.03.01.01 0 .02 0 .03-.01.36-.01.72-.02 1.08-.02z" />
                  </svg>
                  Apple
                </button>
              </div>
              <div className="text-center mt-3 login-page__register">
                <span>Bạn mới biết đến Shopee?</span>
                <a href="#" className="ms-1">
                  Đăng kí
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}