import React, { useState } from "react";
import { OAuthConfig } from "../../configurations/configuration";
import { setToken } from "../../services/localStorageService";
import { useNavigate, Link } from "react-router-dom";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import shopeeLogiImg from "../../assets/images/header/header__cart/Shopee.svg.webp";
import shopeeBackgroundIMG from "../../assets/images/header/header__cart/image.png";
import "./Login.css";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Đăng ký
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Quên mật khẩu
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [sentCode, setSentCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [userIdToReset, setUserIdToReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  // Hàm tạo user dùng axios trực tiếp
  const createUser = async (userData) => {
    const response = await axios.post("http://localhost:8080/ecommerce/users", userData);
    return response.data.result;
  };

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

  // Đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.username.length < 3) {
      alert("Tên người dùng phải có ít nhất 3 ký tự!");
      return;
    }
    if (registerData.password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }
    try {
      await createUser(registerData);
      setRegisterSuccess(true);
      setShowRegister(false);
      setRegisterData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        dob: "",
      });
      setTimeout(() => setRegisterSuccess(false), 3000);
    } catch (err) {
      alert("Đăng ký thất bại!");
    }
  };

  // Quên mật khẩu
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setIsCodeSent(false);
    setSentCode("");
    setInputCode("");
    setResetSuccess(false);
    setUserIdToReset("");
    setChangePassSuccess(false);

    try {
      const res = await axios.post("http://localhost:8080/ecommerce/users/searchByUsername", {
        username: forgotUsername,
      });
      if (res.data.code !== 1000 || !res.data.result) {
        setForgotError("Tên người dùng không tồn tại!");
        return;
      }
      setUserIdToReset(res.data.result);
      // Tạo mã xác thực
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await axios.post("http://localhost:8080/ecommerce/email/send", {
        to: forgotUsername.includes("@") ? forgotUsername : forgotUsername + "90532056@yopmail.com",
        subject: "authentication code",
        body: code,
      });
      setIsCodeSent(true);
      setSentCode(code);
      alert("Đã gửi mã xác thực đến email!");
    } catch (err) {
      // Nếu lỗi từ API searchByUsername thì báo lỗi user không tồn tại
      if (
        err.response &&
        err.response.config &&
        err.response.config.url &&
        err.response.config.url.includes("/ecommerce/users/searchByUsername")
      ) {
        setForgotError("Tên người dùng không tồn tại!");
      } else {
        setForgotError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (inputCode === sentCode) {
      setResetSuccess(true);
      setForgotError("");
    } else {
      setForgotError("Mã xác thực không đúng!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (newPassword.length < 8) {
      setForgotError("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/ecommerce/users/change-password", {
        id: userIdToReset,
        newPassword,
      });
      if (res.data.code === 1000) {
        setChangePassSuccess(true);
        setResetSuccess(false);
        setIsCodeSent(false);
        setForgotUsername("");
        setNewPassword("");
      } else {
        setForgotError("Đổi mật khẩu thất bại!");
      }
    } catch {
      setForgotError("Có lỗi xảy ra, vui lòng thử lại!");
    }
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
          <span className="login-page__header-title">
            {showRegister ? "Đăng ký" : showForgot ? "Quên mật khẩu" : "Đăng nhập"}
          </span>
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
            <img src={shopeeBackgroundIMG} alt="" />
            <div className="login-page__left-desc">
              Nền tảng thương mại điện tử <br />
              yêu thích ở Đông Nam Á & Đài Loan
            </div>
          </div>
          {/* Right Section */}
          <div className="col-md-5 d-flex align-items-center justify-content-center">
            <div className="login-page__form-box w-100">
              {registerSuccess && (
                <div className="alert alert-success text-center">
                  Đăng ký thành công! Bạn có thể đăng nhập.
                </div>
              )}
              {/* Forgot Password Form */}
              {showForgot ? (
                <>
                  <h2 className="login-page__form-title mb-4">Quên mật khẩu</h2>
                  {!isCodeSent && !resetSuccess && !changePassSuccess && (
                    <form onSubmit={handleForgotPassword}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tên Người Dùng"
                          value={forgotUsername}
                          onChange={e => setForgotUsername(e.target.value)}
                          required
                        />
                      </div>
                      {forgotError && (
                        <div className="alert alert-danger text-center py-2">
                          {forgotError}
                        </div>
                      )}
                      <button type="submit" className="btn w-100 mb-3 login-page__login-btn">
                        Gửi mã xác thực
                      </button>
                      <div className="text-center mt-3 login-page__register">
                        <a
                          href="#"
                          className="ms-1"
                          onClick={e => {
                            e.preventDefault();
                            setShowForgot(false);
                            setForgotUsername("");
                            setForgotError("");
                          }}
                        >
                          Quay lại đăng nhập
                        </a>
                      </div>
                    </form>
                  )}
                  {isCodeSent && !resetSuccess && (
                    <form onSubmit={handleVerifyCode}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập mã xác thực"
                          value={inputCode}
                          onChange={e => setInputCode(e.target.value)}
                          required
                        />
                      </div>
                      {forgotError && (
                        <div className="alert alert-danger text-center py-2">
                          {forgotError}
                        </div>
                      )}
                      <button type="submit" className="btn w-100 mb-3 login-page__login-btn">
                        Xác nhận
                      </button>
                      <div className="text-center mt-3 login-page__register">
                        <a
                          href="#"
                          className="ms-1"
                          onClick={e => {
                            e.preventDefault();
                            setShowForgot(false);
                            setForgotUsername("");
                            setForgotError("");
                          }}
                        >
                          Quay lại đăng nhập
                        </a>
                      </div>
                    </form>
                  )}
                  {resetSuccess && !changePassSuccess && (
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      {forgotError && (
                        <div className="alert alert-danger text-center py-2">
                          {forgotError}
                        </div>
                      )}
                      <button type="submit" className="btn w-100 mb-3 login-page__login-btn">
                        Đổi mật khẩu
                      </button>
                    </form>
                  )}
                  {changePassSuccess && (
                    <div className="alert alert-success text-center">
                      Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.
                      <div className="text-center mt-3 login-page__register">
                        <a
                          href="#"
                          className="ms-1"
                          onClick={e => {
                            e.preventDefault();
                            setShowForgot(false);
                            setForgotUsername("");
                            setForgotError("");
                            setIsCodeSent(false);
                            setResetSuccess(false);
                            setChangePassSuccess(false);
                          }}
                        >
                          Quay lại đăng nhập
                        </a>
                      </div>
                    </div>
                  )}
                </>
              ) : !showRegister ? (
                <>
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
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={e => {
                        e.preventDefault();
                        setShowForgot(true);
                        setForgotUsername("");
                        setForgotError("");
                        setIsCodeSent(false);
                        setSentCode("");
                        setInputCode("");
                        setResetSuccess(false);
                        setChangePassSuccess(false);
                        setUserIdToReset("");
                        setNewPassword("");
                      }}
                    >
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
                    <a
                      href="#"
                      className="ms-1"
                      onClick={e => {
                        e.preventDefault();
                        setShowRegister(true);
                      }}
                    >
                      Đăng kí
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="login-page__form-title mb-4">Đăng Ký</h2>
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên Người Dùng"
                        value={registerData.username}
                        onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={registerData.password}
                        onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Họ"
                        value={registerData.lastName}
                        onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên"
                        value={registerData.firstName}
                        onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Địa chỉ"
                        value={registerData.address}
                        onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Ngày sinh"
                        value={registerData.dob}
                        onChange={e => setRegisterData({ ...registerData, dob: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn w-100 mb-3 login-page__login-btn">
                      ĐĂNG KÝ
                    </button>
                  </form>
                  <div className="text-center mt-3 login-page__register">
                    <span>Đã có tài khoản?</span>
                    <a
                      href="#"
                      className="ms-1"
                      onClick={e => {
                        e.preventDefault();
                        setShowRegister(false);
                      }}
                    >
                      Đăng nhập
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}