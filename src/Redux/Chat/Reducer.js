import * as actionTypes from "./ActionType";

const initialState = {
    messages: [],
    loading: false,
    error: null,
    chat: null,
    sendingMessage: false
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        // Loading states
        case actionTypes.FETCH_MESSAGES_REQUEST:
        case actionTypes.FETCH_CHAT_MESSAGES_REQUEST:
        case actionTypes.FETCH_CHAT_BY_PROJECT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case actionTypes.SEND_MESSAGE_REQUEST:
            return {
                ...state,
                sendingMessage: true,
                error: null
            };

        // Success states
        case actionTypes.FETCH_MESSAGES_SUCCESS:
        case actionTypes.FETCH_CHAT_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: Array.isArray(action.payload) ? action.payload : [],
                error: null
            };

        case actionTypes.SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                sendingMessage: false,
                messages: [...state.messages, action.payload],
                error: null
            };

        case actionTypes.FETCH_CHAT_BY_PROJECT_SUCCESS:
            return {
                ...state,
                loading: false,
                chat: action.payload,
                error: null
            };

        // Failure states
        case actionTypes.FETCH_MESSAGES_FAILURE:
        case actionTypes.FETCH_CHAT_MESSAGES_FAILURE:
        case actionTypes.FETCH_CHAT_BY_PROJECT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case actionTypes.SEND_MESSAGE_FAILURE:
            return {
                ...state,
                sendingMessage: false,
                error: action.payload
            };

        // Clear errors
        case actionTypes.CLEAR_CHAT_ERRORS:
            return {
                ...state,
                error: null
            };

        // Reset chat state
        case actionTypes.RESET_CHAT_STATE:
            return initialState;

        default:
            return state;
    }
};