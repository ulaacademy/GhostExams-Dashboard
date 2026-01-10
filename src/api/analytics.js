import axiosInstance from './axiosInstance';

// Get dashboard overview statistics
export const fetchDashboardOverview = async () => {
    const response = await axiosInstance.get('/analytics/overview');
    return response.data;
};

// Get revenue analytics
export const fetchRevenueAnalytics = async (period = '30') => {
    const response = await axiosInstance.get('/analytics/revenue', { params: { period } });
    return response.data;
};

// Get subscription analytics
export const fetchSubscriptionAnalytics = async () => {
    const response = await axiosInstance.get('/analytics/subscriptions');
    return response.data;
};

// Get exam analytics
export const fetchExamAnalytics = async () => {
    const response = await axiosInstance.get('/analytics/exams');
    return response.data;
};

// Get user analytics (teachers & students)
export const fetchUserAnalytics = async () => {
    const response = await axiosInstance.get('/analytics/users');
    return response.data;
};

// Get plan analytics
export const fetchPlanAnalytics = async () => {
    const response = await axiosInstance.get('/analytics/plans');
    return response.data;
};

// Get recent activities
export const fetchRecentActivities = async (limit = 20) => {
    const response = await axiosInstance.get('/analytics/activities', { params: { limit } });
    return response.data;
};

export default {
    fetchDashboardOverview,
    fetchRevenueAnalytics,
    fetchSubscriptionAnalytics,
    fetchExamAnalytics,
    fetchUserAnalytics,
    fetchPlanAnalytics,
    fetchRecentActivities,
};

