import  api  from "../../Config/Api"
import * as actionTypes from "./ActionType";

// Create Subscription Action
export const createSubscription = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.CREATE_SUBSCRIPTION_REQUEST });
        
        try {
            const response = await api.post("/api/subscriptions/create");
            
            dispatch({
                type: actionTypes.CREATE_SUBSCRIPTION_SUCCESS,
                payload: response.data
            });
            
            return response.data;
            
        } catch (error) {
            dispatch({
                type: actionTypes.CREATE_SUBSCRIPTION_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to create subscription"
            });
            
            throw error;
        }
    };
};

// Get User Subscription Action
export const getUserSubscription = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.GET_USER_SUBSCRIPTION_REQUEST });
        
        try {
            const response = await api.get("/api/subscriptions");
            
            dispatch({
                type: actionTypes.GET_USER_SUBSCRIPTION_SUCCESS,
                payload: response.data
            });
            
            return response.data;
            
        } catch (error) {
            dispatch({
                type: actionTypes.GET_USER_SUBSCRIPTION_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to retrieve subscription"
            });
            
            throw error;
        }
    };
};

// Upgrade Subscription Action - Fixed to properly handle planType parameter
export const upgradeSubscription = (planType) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.UPGRADE_SUBSCRIPTION_REQUEST });
        
        try {
            // Fix: Ensure planType is a string and properly encoded
            const planTypeString = typeof planType === 'string' ? planType : String(planType);
            
            // Use proper URL encoding for the query parameter
            const response = await api.put(`/api/subscriptions/upgrade?planType=${encodeURIComponent(planTypeString)}`);
            
            dispatch({
                type: actionTypes.UPGRADE_SUBSCRIPTION_SUCCESS,
                payload: response.data
            });
            
            return response.data;
            
        } catch (error) {
            dispatch({
                type: actionTypes.UPGRADE_SUBSCRIPTION_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to upgrade subscription"
            });
            
            throw error;
        }
    };
};