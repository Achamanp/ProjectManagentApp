import * as actionTypes from './ActionType';

const initialState = {
    loading: false,
    error: null,
    subscriptionDetails: null
};

export const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        // Request Cases
        case actionTypes.CREATE_SUBSCRIPTION_REQUEST:
        case actionTypes.GET_USER_SUBSCRIPTION_REQUEST:
        case actionTypes.UPGRADE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // Success Cases
        case actionTypes.CREATE_SUBSCRIPTION_SUCCESS:
        case actionTypes.GET_USER_SUBSCRIPTION_SUCCESS:
        case actionTypes.UPGRADE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                subscriptionDetails: action.payload.data || action.payload,
            };

        // Failure Cases
        case actionTypes.CREATE_SUBSCRIPTION_FAILURE:
        case actionTypes.GET_USER_SUBSCRIPTION_FAILURE:
        case actionTypes.UPGRADE_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};