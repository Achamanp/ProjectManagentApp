import axios from "axios"
import { API_BASE_URL } from "../../Config/Api"
import { toast } from "react-hot-toast";
import {
    FETCH_PROJECT_REQUEST,
    FETCH_PROJECT_SUCCESS,
    FETCH_PROJECT_FAIL,
    FETCH_PROJECT_BY_ID_REQUEST,
    FETCH_PROJECT_BY_ID_SUCCESS,
    FETCH_PROJECT_BY_ID_FAIL,
    CREATE_PROJECT_REQUEST,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_FAIL,
    SEARCH_PROJECT_REQUEST,
    SEARCH_PROJECT_SUCCESS,
    SEARCH_PROJECT_FAIL,
    DELETE_PROJECT_REQUEST,
    DELETE_PROJECT_SUCCESS,
    DELETE_PROJECT_FAIL,
    INVITE_TO_PROJECT_REQUEST,
    INVITE_TO_PROJECT_SUCCESS,
    INVITE_TO_PROJECT_FAIL,
    ACCEPT_INVITATION_REQUEST,
    ACCEPT_INVITATION_SUCCESS,
    ACCEPT_INVITATION_FAIL
} from "./ActionType"
import api from "../../Config/Api"

// Fetch Projects (with optional category and tag filters)
export const fetchProjects = (filters = {}) => async (dispatch) => {
    dispatch({ type: FETCH_PROJECT_REQUEST });
    try {
        const { category, tag } = filters;
        
        // Build params object, only include non-'all' values
        const params = {};
        if (category && category !== 'all') {
            params.category = category;
        }
        if (tag && tag !== 'all') {
            params.tag = tag;
        }
        
        const { data } = await api.get('/api/projects', { params });
   
        
        dispatch({
            type: FETCH_PROJECT_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: FETCH_PROJECT_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
}

// Fetch Project by ID
export const fetchProjectById = (projectId) => async (dispatch) => {
    dispatch({ type: FETCH_PROJECT_BY_ID_REQUEST });
    try {
        const { data } = await api.get(`/api/projects/${projectId}`);
        
        dispatch({
            type: FETCH_PROJECT_BY_ID_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: FETCH_PROJECT_BY_ID_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
}

// Create Project
export const createProject = (projectData) => async (dispatch) => {
    dispatch({ type: CREATE_PROJECT_REQUEST });

    try {
        const { data } = await api.post('/api/projects', projectData);

        dispatch({
            type: CREATE_PROJECT_SUCCESS,
            payload: data
        });

        toast.success(data.message || 'Project created successfully!');
        
    } catch (error) {

        dispatch({
            type: CREATE_PROJECT_FAIL,
            payload: error.response?.data?.message || error.message
        });

        toast.error(error.response?.data?.message || 'Failed to create project');
    }
};

// Update Project
export const updateProject = (projectId, updatedProjectData) => async (dispatch) => {
    dispatch({ type: "UPDATE_PROJECT_REQUEST" });
    try {
        const { data } = await api.put(`/api/projects/${projectId}`, updatedProjectData);
        
        dispatch({
            type: "UPDATE_PROJECT_SUCCESS",
            payload: data
        });

        toast.success(data.message || 'Project updated successfully!');

    } catch (error) {
        dispatch({
            type: "UPDATE_PROJECT_FAIL",
            payload: error.response?.data?.message || error.message
        });

        toast.error(error.response?.data?.message || 'Failed to update project');
    }
}

// Delete Project
export const deleteProject = (projectId) => async (dispatch) => {
    dispatch({ type: DELETE_PROJECT_REQUEST });
    try {
        const { data } = await api.delete(`/api/projects/${projectId}`);
        
        dispatch({
            type: DELETE_PROJECT_SUCCESS,
            payload: {
                projectId,
                message: data.message
            }
        });

        toast.success(data.message || 'Project deleted successfully!');

    } catch (error) {
        dispatch({
            type: DELETE_PROJECT_FAIL,
            payload: error.response?.data?.message || error.message
        });

        toast.error(error.response?.data?.message || 'Failed to delete project');
    }
}

// Search Projects - FIXED VERSION
export const searchProjects = (keyword) => async (dispatch) => {
    dispatch({ type: SEARCH_PROJECT_REQUEST });
    try {
        // Ensure keyword is properly encoded for URL
        const encodedKeyword = encodeURIComponent(keyword.trim());
        const { data } = await api.get(`/api/projects/search?keyword=${encodedKeyword}`);
        

        dispatch({
            type: SEARCH_PROJECT_SUCCESS,
            payload: data // This will be handled in the reducer properly
        });
    } catch (error) {
        dispatch({
            type: SEARCH_PROJECT_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
}

// Get Chat by Project ID
export const getChatByProjectId = (projectId) => async (dispatch) => {
    dispatch({ type: "FETCH_CHAT_REQUEST" });
    try {
        const { data } = await api.get(`/api/projects/${projectId}/chats`);
        
        dispatch({
            type: "FETCH_CHAT_SUCCESS",
            payload: data
        });
    } catch (error) {
        dispatch({
            type: "FETCH_CHAT_FAIL",
            payload: error.response?.data?.message || error.message
        });
    }
}
// Fixed Redux Action
export const inviteToProject = (inviteData) => async (dispatch) => {
    dispatch({ type: INVITE_TO_PROJECT_REQUEST });
    try {
        // ✅ Fixed: Send both email and projectId in the request body
        const { data } = await api.post(`/api/projects/invite`, {
            email: inviteData.email,
            projectId: inviteData.projectId
        });
        
        dispatch({
            type: INVITE_TO_PROJECT_SUCCESS,
            payload: {
                message: data.message,
                email: inviteData.email,
                projectId: inviteData.projectId
            }
        });
    } catch (error) {
        dispatch({
            type: INVITE_TO_PROJECT_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
}

// Accept Invitation - This looks correct
// Fixed Redux Action for Accept Invitation
export const acceptInvitation = (token, navigate) => async (dispatch) => {
    dispatch({ type: ACCEPT_INVITATION_REQUEST });
    try {
        const { data } = await api.post(`/api/projects/accept-invite?token=${token}`, {});

        dispatch({
            type: ACCEPT_INVITATION_SUCCESS,
            payload: data
        });
        
        // ✅ Fixed: Navigate using the projectId from the invitation object
        if (navigate && data.projectId) {
            navigate(`/project/${data.projectId}`);
        } else if (navigate) {
            // Fallback: navigate to projects list if projectId is not available
            navigate('/projects');
        }
        
        return data; // Return data for component to handle
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({
            type: ACCEPT_INVITATION_FAIL,
            payload: errorMessage
        });
        throw error; // Re-throw for component error handling
    }
}