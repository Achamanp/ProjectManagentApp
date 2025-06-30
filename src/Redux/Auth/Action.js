import axios from "axios";
import { toast } from "react-hot-toast";
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  // Add these new action types to your ActionTypes file
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  // OAuth action types
  OAUTH_LOGIN_REQUEST,
  OAUTH_LOGIN_SUCCESS,
  OAUTH_LOGIN_FAILURE
} from "./ActionTypes";
import { API_BASE_URL } from "../../Config/Api";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: REGISTER_SUCCESS, payload: data });
      toast.success("Registration successful! Welcome aboard! 🎉");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    // You might want to dispatch a failure action here
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    
    // Validate userData before sending
    if (!userData.email || !userData.password) {
      toast.error("Email and password are required");
      throw new Error("Email and password are required");
    }
    
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, userData);
    
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
      toast.success("Login successful! Welcome back! 👋");
    } else {
      toast.error("Login failed - No authentication token received");
      throw new Error("No JWT token received from server");
    }
    
  } catch (error) {
    
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    
    if (!error.message.includes("Email and password are required")) {
      toast.error(errorMessage);
    }
    
    dispatch({ 
      type: "LOGIN_FAILURE",
      payload: errorMessage 
    });
  }
};

// OAuth Login Actions
export const initiateGoogleOAuth = () => async (dispatch) => {
  dispatch({ type: OAUTH_LOGIN_REQUEST });
  
  try {
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  } catch (error) {
    toast.error("Failed to initiate Google login");
    dispatch({ 
      type: OAUTH_LOGIN_FAILURE,
      payload: "Failed to initiate Google OAuth" 
    });
  }
};

export const initiateGitHubOAuth = () => async (dispatch) => {
  dispatch({ type: OAUTH_LOGIN_REQUEST });
  
  try {
    // Redirect to GitHub OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  } catch (error) {
    toast.error("Failed to initiate GitHub login");
    dispatch({ 
      type: OAUTH_LOGIN_FAILURE,
      payload: "Failed to initiate GitHub OAuth" 
    });
  }
};

// Handle OAuth callback (call this when user returns from OAuth provider)
export const handleOAuthCallback = (token, userData) => async (dispatch) => {
  try {
    if (token) {
      localStorage.setItem("jwt", token);
      dispatch({ 
        type: OAUTH_LOGIN_SUCCESS, 
        payload: { jwt: token, ...userData } 
      });
      toast.success("OAuth login successful! Welcome! 🎉");
    } else {
      throw new Error("No authentication token received from OAuth provider");
    }
  } catch (error) {
    const errorMessage = error.message || "OAuth login failed";
    toast.error(errorMessage);
    dispatch({ 
      type: OAUTH_LOGIN_FAILURE,
      payload: errorMessage 
    });
  }
};

// Alternative: Handle OAuth success from URL parameters
export const processOAuthRedirect = () => async (dispatch) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (error) {
      throw new Error(decodeURIComponent(error));
    }
    
    if (token) {
      localStorage.setItem("jwt", token);
      
      // Fetch user data with the new token
      const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      dispatch({ 
        type: OAUTH_LOGIN_SUCCESS, 
        payload: { jwt: token, user: data.data } 
      });
      
      toast.success("OAuth login successful! Welcome! 🎉");
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } else {
      throw new Error("No authentication token found in URL");
    }
    
  } catch (error) {
    const errorMessage = error.message || "OAuth authentication failed";
    toast.error(errorMessage);
    dispatch({ 
      type: OAUTH_LOGIN_FAILURE,
      payload: errorMessage 
    });
    
    // Clean up URL parameters even on error
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
  toast.success("Successfully logged out! See you soon! 👋");
 
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  
  try {
    const jwt = localStorage.getItem("jwt");
    
    if (!jwt) {
      throw new Error("No authentication token found");
    }

    const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    
    if (data.success) {
      dispatch({ 
        type: GET_USER_SUCCESS, 
        payload: data.data // This is the User object from your ApiResponse
      });
    } else {
      throw new Error(data.message || "Failed to fetch user profile");
    }
    
  } catch (error) {
    dispatch({ 
      type: GET_USER_FAILURE, 
      payload: error.response?.data?.message || error.message || "Failed to fetch user profile"
    });
    
    // Only show toast for profile fetch errors if it's not just missing token
    if (!error.message.includes("No authentication token found")) {
      toast.error("Failed to load user profile");
    }
  }
};

// New action for forgot password (if you have this endpoint)
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  
  try {
    
    if (!email || !email.trim()) {
      toast.error("Email is required");
      throw new Error("Email is required");
    }
    
    
    const { data } = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    
    if (data.success) {
      dispatch({ 
        type: FORGOT_PASSWORD_SUCCESS, 
        payload: data 
      });
      toast.success("Password reset link sent to your email! 📧");
    } else {
      throw new Error(data.message || "Failed to send reset link");
    }
    
  } catch (error) {
    
    let errorMessage = "Failed to send reset link";
    
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 403:
          errorMessage = "Access forbidden. Please check if the email is registered or contact support.";
          break;
        case 404:
          errorMessage = "Email not found. Please check your email address.";
          break;
        case 429:
          errorMessage = "Too many requests. Please try again later.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = "Network error. Please check your connection.";
    }
    
    if (!error.message.includes("Email is required")) {
      toast.error(errorMessage);
    }
    
    dispatch({ 
      type: FORGOT_PASSWORD_FAILURE,
      payload: errorMessage 
    });
  }
};

// New action for reset password
export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  
  try {
    
    // Validate resetData before sending
    if (!resetData.token || !resetData.token.trim()) {
      toast.error("Reset token is required");
      throw new Error("Reset token is required");
    }
    
    if (!resetData.otp) {
      toast.error("OTP is required");
      throw new Error("OTP is required");
    }
    
    if (!resetData.newPassword || !resetData.newPassword.trim()) {
      toast.error("New password is required");
      throw new Error("New password is required");
    }
    
    if (resetData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      throw new Error("Password must be at least 6 characters long");
    }
    
    // Match your backend API structure: token as query param, otp and newPassword in body
    const { data } = await axios.post(
      `${API_BASE_URL}/api/users/reset-password?token=${encodeURIComponent(resetData.token)}`, 
      {
        otp: resetData.otp,
        newPassword: resetData.newPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    
    if (data.success) {
      dispatch({ 
        type: RESET_PASSWORD_SUCCESS, 
        payload: data 
      });
      toast.success("Password reset successful! You can now login with your new password! 🎉");
      
    } else {
      throw new Error(data.message || "Failed to reset password");
    }
    
  } catch (error) {
    
    let errorMessage = "Failed to reset password";
    
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data?.message || "Invalid request. Please check your input.";
          break;
        case 401:
          errorMessage = "Invalid or expired token. Please request a new password reset.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
      }
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
    }
    
    // Don't show toast for validation errors as they're already shown above
    const validationErrors = [
      "Reset token is required",
      "OTP is required", 
      "New password is required",
      "Password must be at least 6 characters long"
    ];
    
    if (!validationErrors.includes(error.message)) {
      toast.error(errorMessage);
    }
    
    dispatch({ 
      type: RESET_PASSWORD_FAILURE,
      payload: errorMessage 
    });
  }
};