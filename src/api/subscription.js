import axiosInstance from './axiosInstance';

// Get all subscriptions with optional filters
export const fetchSubscriptions = async (params = {}) => {
    // params: { status, teacherId, planId, page, limit, search, sortBy, sortOrder }
    const response = await axiosInstance.get('/subscriptions', { params });
    return response.data;
};

// Activate a subscription
export const activateSubscription = async (subscriptionId, data) => {
    // data: { paymentDate }
    const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/activate`, data);
    return response.data;
};

// Deactivate a subscription
export const deactivateSubscription = async (subscriptionId, data = {}) => {
    const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/deactivate`, data);
    return response.data;
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId, data) => {
    // data: { reason, cancelledBy }
    const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/cancel`, data);
    return response.data;
};

// Renew a subscription
export const renewSubscription = async (subscriptionId, data) => {
    // data: { newEndDate, amount, paymentMethod }
    const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/renew`, data);
    return response.data;
};

// Change plan for a subscription
export const changeSubscriptionPlan = async (subscriptionId, data) => {
    // data: { newPlanId, newEndDate, amount }
    const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/change-plan`, data);
    return response.data;
};

// Update payment status
export const updatePaymentStatus = async (subscriptionId, data) => {
    // data: { paymentStatus, paymentDate, notes }
    const response = await axiosInstance.put(`/subscriptions/${subscriptionId}/payment-status`, data);
    return response.data;
};

export default {
    fetchSubscriptions,
    activateSubscription,
    deactivateSubscription,
    cancelSubscription,
    renewSubscription,
    changeSubscriptionPlan,
    updatePaymentStatus,
};