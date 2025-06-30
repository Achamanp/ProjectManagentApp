import api from "../../Config/Api"
import * as actionTypes from "./ActionType";
import { toast } from "react-hot-toast";

// Get Issue by ID Action
export const getIssueById = (issueId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_ISSUE_BY_ID_REQUEST });
        
        try {
            const response = await api.get(`/api/issues/${issueId}`);
            
            dispatch({
                type: actionTypes.FETCH_ISSUE_BY_ID_SUCCESS,
                payload: response.data
            });
            
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch issue";
            
            dispatch({
                type: actionTypes.FETCH_ISSUE_BY_ID_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Create Issue Action
export const createIssue = (issueData) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.CREATE_ISSUE_REQUEST });
        
        try {
            const response = await api.post("/api/issues", issueData);
            
            dispatch({
                type: actionTypes.CREATE_ISSUE_SUCCESS,
                payload: response.data
            });
            
            toast.success("Issue created successfully!");
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create issue";
            
            dispatch({
                type: actionTypes.CREATE_ISSUE_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Delete Issue Action
export const deleteIssue = (issueId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.DELETE_ISSUE_REQUEST });
        
        try {
            const response = await api.delete(`/api/issues/${issueId}`);
            
            dispatch({
                type: actionTypes.DELETE_ISSUE_SUCCESS,
                payload: { issueId, message: response.data }
            });
            
            toast.success("Issue deleted successfully!");
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to delete issue";
            
            dispatch({
                type: actionTypes.DELETE_ISSUE_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Assign Issue to User Action
// Fixed Redux Action - matches the function signature used in the component
export const assignIssueToUser = (issueId, userId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.ASSIGN_ISSUE_TO_USER_REQUEST });
        
        try {
            // Make sure issueId and userId are valid
            if (!issueId || !userId) {
                throw new Error("Issue ID and User ID are required");
            }
            
            const response = await api.put(`/api/issues/${issueId}/assignee/${userId}`);
            
            dispatch({
                type: actionTypes.ASSIGN_ISSUE_TO_USER_SUCCESS,
                payload: response.data
            });
            
            toast.success("Issue assigned successfully!");
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to assign issue to user";
            
            dispatch({
                type: actionTypes.ASSIGN_ISSUE_TO_USER_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Update Issue Status Action
export const updateIssueStatus = (issueId, status) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_ISSUE_STATUS_REQUEST });
        
        try {
            // Fixed the URL path - removed duplicate "issues"
            const response = await api.put(`/api/issues/${issueId}/status/${status}`);
            
            dispatch({
                type: actionTypes.UPDATE_ISSUE_STATUS_SUCCESS,
                payload: response.data
            });
            
            toast.success(`Issue status updated to ${status}!`);
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update issue status";
            
            dispatch({
                type: actionTypes.UPDATE_ISSUE_STATUS_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Get Issues by Project ID Action
export const getIssuesByProjectId = (projectId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_ISSUES_REQUEST });
        
        try {
            const response = await api.get(`/api/issues/project/${projectId}`);
            
            // Extract the actual issues array from the ApiResponse wrapper
            const issues = response.data.data; // response.data gives ApiResponse, response.data.data gives the actual issues array
            
            dispatch({
                type: actionTypes.FETCH_ISSUES_SUCCESS,
                payload: issues
            });
            return issues;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch project issues";
            
            dispatch({
                type: actionTypes.FETCH_ISSUES_FAILURE,
                payload: errorMessage
            });
            
            toast.error(errorMessage);
            throw error;
        }
    };
};

// Additional utility functions for toast management
export const showLoadingToast = (message = "Loading...") => {
    return toast.loading(message);
};

export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};

export const showCustomToast = (message, type = "success", options = {}) => {
    const defaultOptions = {
        duration: 4000,
        position: 'top-right',
        ...options
    };
    
    switch (type) {
        case 'success':
            return toast.success(message, defaultOptions);
        case 'error':
            return toast.error(message, defaultOptions);
        case 'loading':
            return toast.loading(message, defaultOptions);
        default:
            return toast(message, defaultOptions);
    }
};