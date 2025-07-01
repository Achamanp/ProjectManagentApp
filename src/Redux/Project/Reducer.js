import { 
  DELETE_PROJECT_REQUEST, 
  FETCH_PROJECT_BY_ID_REQUEST,
  FETCH_PROJECT_REQUEST,
  CREATE_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS,
  CREATE_PROJECT_SUCCESS,
  DELETE_PROJECT_SUCCESS,
  FETCH_PROJECT_BY_ID_SUCCESS,
  FETCH_PROJECT_FAIL,
  CREATE_PROJECT_FAIL,
  DELETE_PROJECT_FAIL,
  FETCH_PROJECT_BY_ID_FAIL,
  ACCEPT_INVITATION_REQUEST,
  INVITE_TO_PROJECT_REQUEST,
  SEARCH_PROJECT_REQUEST,
  SEARCH_PROJECT_SUCCESS,
  SEARCH_PROJECT_FAIL,
  INVITE_TO_PROJECT_SUCCESS,
  INVITE_TO_PROJECT_FAIL,
  ACCEPT_INVITATION_SUCCESS,
  ACCEPT_INVITATION_FAIL
} from "./ActionType";

const initialState = {
  project: { data: [] }, // Fixed: Initialize as object with data array to match API response structure
  loading: false,
  error: null,
  projectDetails: null,
  searchProject: []
};

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases - set loading to true and clear errors
    case FETCH_PROJECT_REQUEST:
    case CREATE_PROJECT_REQUEST:
    case DELETE_PROJECT_REQUEST:
    case FETCH_PROJECT_BY_ID_REQUEST:
    case ACCEPT_INVITATION_REQUEST:
    case INVITE_TO_PROJECT_REQUEST:
    case SEARCH_PROJECT_REQUEST: // Added missing case
      return {
        ...state,
        loading: true,
        error: null
      };

    // Success cases - handle the actual data updates
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        project: action.payload, // This will contain the full API response with data property
        error: null
      };

    case SEARCH_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchProject: action.payload,
        error: null
      }; // Fixed: Added missing semicolon

  case CREATE_PROJECT_SUCCESS:
  return {
    ...state,
    loading: false,
    project: {
      ...state.project,
      data: [...(state.project.data || []), action.payload.data] // Extract .data from the response
    },
    error: null
  };

    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        // Fixed: Handle the nested data structure and use projectId from payload
        project: {
          ...state.project,
          data: (state.project.data || []).filter(p => p.id !== action.payload.projectId)
        },
        error: null
      };

    case FETCH_PROJECT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        projectDetails: action.payload,
        error: null
      };

    case INVITE_TO_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case ACCEPT_INVITATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    // FAIL cases - handle errors
    case FETCH_PROJECT_FAIL:
    case CREATE_PROJECT_FAIL:
    case DELETE_PROJECT_FAIL:
    case FETCH_PROJECT_BY_ID_FAIL:
    case SEARCH_PROJECT_FAIL: // Added missing case
    case INVITE_TO_PROJECT_FAIL:
    case ACCEPT_INVITATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};