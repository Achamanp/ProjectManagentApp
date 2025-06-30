import* as actionTypes from './ActionType'
const initialState = {
    comments: [],
    loading: false,
    error: null,
};

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_COMMENT_REQUEST:
    case actionTypes.DELETE_COMMENT_REQUEST:
    case actionTypes.FETCH_COMMENTS_REQUEST:
        return {
            ...state,
            loading: false,
            error: null
        };

    case actionTypes.CREATE_COMMENT_SUCCESS:
        return {
            ...state,
            loading: false,
            comments: [...state.comments, action.payload.data || action.payload],
        };
    case actionTypes.DELETE_COMMENT_SUCCESS:
        return {
            ...state,
            loading: false,
            comments: state.comments.filter(
                comment => comment.id !== (action.payload.data?.id || action.payload.id)
            ),
        };
    case actionTypes.FETCH_COMMENTS_SUCCESS:
        return {
            ...state,
            loading: false,
            comments: action.payload.data || action.payload,
        };
    

    default:
      return state; // ✅ must return state here
  }
};