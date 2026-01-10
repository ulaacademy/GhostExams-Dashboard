// src/api/studentPlans.js
import axiosInstance from "./axiosInstance";

// ✅ Student Plans API (uses the dashboard axiosInstance baseURL)
// axiosInstance baseURL is: import.meta.env.VITE_API_URL || 'https://ge-api.ghostexams.com/api'
const BASE = "/student-plans";

// GET: جلب كل خطط الطلاب
export const fetchStudentPlans = async (params = {}) => {
  const res = await axiosInstance.get(BASE, { params });
  return res.data;
};

// GET: جلب الخطط النشطة فقط
export const fetchActiveStudentPlans = async (params = {}) => {
  const res = await axiosInstance.get(`${BASE}/active`, { params });
  return res.data;
};

// GET: جلب خطة واحدة
export const fetchStudentPlanById = async (planId) => {
  const res = await axiosInstance.get(`${BASE}/${planId}`);
  return res.data;
};

// POST: إنشاء خطة
export const createStudentPlan = async (planData) => {
  const res = await axiosInstance.post(BASE, planData);
  return res.data;
};

// PUT: تحديث خطة
export const updateStudentPlan = async (planId, planData) => {
  const res = await axiosInstance.put(`${BASE}/${planId}`, planData);
  return res.data;
};

// DELETE: تعطيل/حذف خطة
export const deleteStudentPlan = async (planId, permanent = false) => {
  const res = await axiosInstance.delete(`${BASE}/${planId}`, {
    params: { permanent: permanent ? "true" : "false" },
  });
  return res.data;
};

// POST: تفعيل/تعطيل
export const toggleStudentPlanActivation = async (planId) => {
  const res = await axiosInstance.post(`${BASE}/${planId}/toggle`);
  return res.data;
};
