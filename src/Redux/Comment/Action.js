import  api  from "../../Config/Api"

import * as actionTypes from "./ActionType";

// Create Comment Action
export const createComment = (commentData) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.CREATE_COMMENT_REQUEST });
        
        try {
            const response = await api.post("/api/comments", commentData);
            
            dispatch({
                type: actionTypes.CREATE_COMMENT_SUCCESS,
                payload: response.data // or action.message if you prefer
            });
            
            return response.data;
            
        } catch (error) {
            dispatch({
                type: actionTypes.CREATE_COMMENT_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to create comment"
            });
            
            throw error;
        }
    };
};


export const deleteComment = (commentId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.DELETE_COMMENT_REQUEST });
        
        try {
            const response = await api.delete(`/api/comments/${commentId}`);
            
            dispatch({
                type: actionTypes.DELETE_COMMENT_SUCCESS,
                payload: response.data // or action.message if you prefer
            });
            
            return response.data;
            
        } catch (error) {
            dispatch({
                type: actionTypes.DELETE_COMMENT_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to delete comment"
            });
            
            throw error;
        }
    };
};

// Updated action to handle ApiResponse<List<Comment>> structure
export const fetchCommentsByIssueId = (issueId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_COMMENTS_REQUEST });
        
        try {
            const response = await api.get(`/api/comments/issue/${issueId}`);
        
            
            // Since backend returns ApiResponse<List<Comment>>, store the entire response
            // The component will extract the data field
            dispatch({
                type: actionTypes.FETCH_COMMENTS_SUCCESS,
                payload: response.data // This contains { success, message, data }
            });
            
            return response.data;
            
        } catch (error) {
            
            dispatch({
                type: actionTypes.FETCH_COMMENTS_FAILURE,
                payload: error.response?.data?.message || error.message || "Failed to fetch comments"
            });
            
            throw error;
        }
    };
};