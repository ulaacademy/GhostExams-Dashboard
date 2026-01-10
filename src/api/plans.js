import axiosInstance from './axiosInstance';

// Get all plans
export const fetchPlans = async (params = {}) => {
    // params: { page, limit, search, sortBy, sortOrder }
    const response = await axiosInstance.get('/plans', { params });
    return response.data;
};

// Get only active plans
export const fetchActivePlans = async (params = {}) => {
    const response = await axiosInstance.get('/plans/active', { params });
    return response.data;
};

// Get one plan by ID
export const fetchPlanById = async (planId) => {
    const response = await axiosInstance.get(`/plans/${planId}`);
    return response.data;
};

// Create a new plan
export const createPlan = async (planData) => {
    const response = await axiosInstance.post('/plans', planData);
    return response.data;
};

// Update a plan
export const updatePlan = async (planId, planData) => {
    const response = await axiosInstance.put(`/plans/${planId}`, planData);
    return response.data;
};

// Delete/disable a plan
export const deletePlan = async (planId, permanent = false) => {
    const response = await axiosInstance.delete(`/plans/${planId}`, {
        params: { permanent }
    });
    return response.data;
};

// Activate/deactivate a plan
export const togglePlanActivation = async (planId) => {
    const response = await axiosInstance.post(`/plans/${planId}/toggle`);
    return response.data;
};

export default {
    fetchPlans,
    fetchActivePlans,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanActivation,
};