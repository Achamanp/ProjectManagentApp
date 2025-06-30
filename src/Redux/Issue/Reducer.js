import * as actionTypes from './ActionType';

const initialState = {
    loading: false,
    error: null,
    issues: [], // Added for storing multiple issues
    issueDetails: null
};

export const issueReducer = (state = initialState, action) => {
    switch (action.type) {
        // Request Cases
        case actionTypes.CREATE_ISSUE_REQUEST:
        case actionTypes.FETCH_ISSUES_REQUEST:
        case actionTypes.FETCH_ISSUE_BY_ID_REQUEST:
        case actionTypes.UPDATE_ISSUE_REQUEST:
        case actionTypes.UPDATE_ISSUE_STATUS_REQUEST:
        case actionTypes.ASSIGN_ISSUE_TO_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // Success Cases
        case actionTypes.CREATE_ISSUE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                issues: [...state.issues, action.payload], // Add new issue to array
                issueDetails: action.payload,
            };

        case actionTypes.FETCH_ISSUES_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                issues: action.payload, // Set all issues
            };

        case actionTypes.FETCH_ISSUE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                issueDetails: action.payload,
            };

        case actionTypes.UPDATE_ISSUE_SUCCESS:
        case actionTypes.UPDATE_ISSUE_STATUS_SUCCESS:
        case actionTypes.ASSIGN_ISSUE_TO_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                issues: state.issues.map(issue => 
                    issue.id === action.payload.id ? action.payload : issue
                ), // Update specific issue in array
                issueDetails: action.payload,
            };

        // Failure Cases
        case actionTypes.CREATE_ISSUE_FAILURE:
        case actionTypes.FETCH_ISSUES_FAILURE:
        case actionTypes.FETCH_ISSUE_BY_ID_FAILURE:
        case actionTypes.UPDATE_ISSUE_FAILURE:
        case actionTypes.UPDATE_ISSUE_STATUS_FAILURE:
        case actionTypes.ASSIGN_ISSUE_TO_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};