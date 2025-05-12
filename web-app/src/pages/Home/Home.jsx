import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import NewHeader from "../../components/header";
import Container from "../../components/Container/Container";

export default function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const getUserDetails = async () => {
    try {
      const response = await authorizedAxiosInstance.get(
        "http://localhost:8080/ecommerce/users/myInfo"
      );
  
      console.log(response.data.result);
      setUserDetails(response.data.result);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const addPassword = async (event) => {
    event.preventDefault();
  
    const body = {
      password: password,
    };
  
    try {
      const response = await authorizedAxiosInstance.post(
        "http://localhost:8080/ecommerce/users/create-password",
        body
      );
  
      const data = response.data;
  
      if (data.code !== 1000) throw new Error(data.message);
  
      getUserDetails(getToken());
      showSuccess(data.message);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    const accessToken = getToken();

    if (!accessToken) {
      navigate("/login");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  return (
    <>
      <NewHeader></NewHeader>
      <Container></Container>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      {userDetails ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor={"#f0f2f5"}
        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 4,
              borderRadius: 2,
              padding: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%", // Ensure content takes full width
              }}
            >
              <p>Welcome back to Devteria, {userDetails.username}</p>
              <h1 className="name">{`${userDetails.firstName} ${userDetails.lastName}`}</h1>
              <p className="email">{userDetails.dob}</p>
              <ul>
                User's roles:
                {userDetails.roles?.map((item, index) => (
                  <li className="email" key={index}>
                    {item.name}
                  </li>
                ))}
              </ul>
              {userDetails.noPassword && (
                <Box
                  component="form"
                  onSubmit={addPassword}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Typography>Do you want to create password?</Typography>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Create password
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      ) : (
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
          <Typography>Loading ...</Typography>
        </Box>
      )}
    </>
  );
}
