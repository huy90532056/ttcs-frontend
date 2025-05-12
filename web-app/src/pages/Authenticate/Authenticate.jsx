import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";
import authorizedAxiosInstance from "../../utils/authorizedAxios";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
    
      // Thay thế fetch bằng axios từ authorizedAxiosInstance
      authorizedAxiosInstance
        .post(`http://localhost:8080/ecommerce/auth/outbound/authentication?code=${authCode}`)
        .then((response) => {
          const data = response.data;
    
          console.log(data);
    
          setToken(data.result?.token);
          setIsLoggedin(true);
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress></CircularProgress>
        <Typography>Authenticating...</Typography>
      </Box>
    </>
  );
}
