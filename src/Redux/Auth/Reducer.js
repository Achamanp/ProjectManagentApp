import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
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

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  projectSize: 0,
  // Password reset specific states
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,
  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  // OAuth specific states
  oauthLoading: false,
  oauthError: null,
  isOAuthUser: false, // Track if user logged in via OAuth
  oauthProvider: null, // Track which OAuth provider was used ('google', 'github', etc.)
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null 
      };

    case OAUTH_LOGIN_REQUEST:
      return {
        ...state,
        oauthLoading: true,
        oauthError: null,
        loading: true,
        error: null
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload.jwt,
        user: action.payload.user || null, // In case user data is included
        isOAuthUser: false,
        oauthProvider: null,
      };

    case OAUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        oauthLoading: false,
        error: null,
        oauthError: null,
        jwt: action.payload.jwt,
        user: action.payload.user || null,
        isOAuthUser: true,
        oauthProvider: action.payload.provider || 'unknown', // You can pass provider info from backend
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };

    case GET_USER_FAILURE:
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case OAUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        oauthLoading: false,
        error: action.payload,
        oauthError: action.payload,
      };

    // Forgot Password Cases
    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordError: null,
        forgotPasswordSuccess: false,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordError: null,
        forgotPasswordSuccess: true,
      };

    case FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordError: action.payload,
        forgotPasswordSuccess: false,
      };

    // Reset Password Cases
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordLoading: true,
        resetPasswordError: null,
        resetPasswordSuccess: false,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: null,
        resetPasswordSuccess: true,
      };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: action.payload,
        resetPasswordSuccess: false,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};