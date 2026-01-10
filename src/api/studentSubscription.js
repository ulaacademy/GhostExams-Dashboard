import axiosInstance from "./axiosInstance";

// ✅ Admin Dashboard: Student Subscriptions API
export const fetchStudentSubscriptions = async (params = {}) => {
  const res = await axiosInstance.get("/student-subscriptions", { params });
  return res.data;
};

export const activateStudentSubscription = async (
  subscriptionId,
  data = {}
) => {
  const res = await axiosInstance.post(
    `/student-subscriptions/${subscriptionId}/activate`,
    data
  );
  return res.data;
};

export const deactivateStudentSubscription = async (
  subscriptionId,
  data = {}
) => {
  const res = await axiosInstance.post(
    `/student-subscriptions/${subscriptionId}/deactivate`,
    data
  );
  return res.data;
};

export const renewStudentSubscription = async (subscriptionId, data = {}) => {
  const res = await axiosInstance.post(
    `/student-subscriptions/${subscriptionId}/renew`,
    data
  );
  return res.data;
};

export const updateStudentPaymentStatus = async (subscriptionId, data = {}) => {
  const res = await axiosInstance.put(
    `/student-subscriptions/${subscriptionId}/payment-status`,
    data
  );
  return res.data;
};
