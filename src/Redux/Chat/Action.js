import * as actionTypes from "./ActionType";
import api from "../../Config/Api"

export const sendMessage = (messageData) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.SEND_MESSAGE_REQUEST });
        
        
        try {
            const response = await api.post("/api/messages/send", messageData);

            
            
            // Handle ApiResponse wrapper - extract the actual message data
            const sentMessage = response.data.data || response.data;
            
            dispatch({
                type: actionTypes.SEND_MESSAGE_SUCCESS,
                payload: sentMessage
            });
            
           
            return sentMessage;
            
        } catch (error) {
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               "Failed to send message";
                               
            dispatch({
                type: actionTypes.SEND_MESSAGE_FAILURE,
                payload: errorMessage
            });
            
            throw error;
        }
    };
};

// Simplified: Only fetch messages by project ID (no chat ID needed)
export const fetchMessagesByProjectId = (projectId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_MESSAGES_REQUEST });

        
        try {
            // Use the endpoint that works with project ID directly
            const response = await api.get(`/api/messages/chat/${projectId}`);
            
            
            
            // This endpoint returns raw List<Message>, not wrapped in ApiResponse
            const messagesData = Array.isArray(response.data) ? response.data : [];
            
          
            dispatch({
                type: actionTypes.FETCH_MESSAGES_SUCCESS,
                payload: messagesData
            });
            
            return messagesData;
            
        } catch (error) {
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               "Failed to fetch messages";
                               
            dispatch({
                type: actionTypes.FETCH_MESSAGES_FAILURE,
                payload: errorMessage
            });
            
            throw error;
        }
    };
};

// Keep the old function names for backward compatibility
export const fetchChatByProjectId = fetchMessagesByProjectId;
export const fetchChatMessages = (chatId) => {
    // Since we don't have chat ID, we can't use this function
    // Log a warning and return empty
    return async (dispatch) => {
        dispatch({
            type: actionTypes.FETCH_MESSAGES_SUCCESS,
            payload: []
        });
    };
};

// Additional utility actions
export const clearChatErrors = () => ({
    type: actionTypes.CLEAR_CHAT_ERRORS
});

export const resetChatState = () => ({
    type: actionTypes.RESET_CHAT_STATE
});

export const addMessageToChat = (message) => ({
    type: actionTypes.ADD_MESSAGE_TO_CHAT,
    payload: message
});