import axios from 'axios'

// ✅ عدّل هذا المسار إذا عندك baseURL مختلف
// أنا افترضت إن ال backend عندك على نفس الدومين مع prefix /api
const BASE = '/api/student-plans'

// GET: جلب كل خطط الطلاب
export const fetchStudentPlans = async (params = {}) => {
    const res = await axios.get(BASE, { params })
    return res.data
}

// GET: جلب الخطط النشطة فقط
export const fetchActiveStudentPlans = async (params = {}) => {
    const res = await axios.get(`${BASE}/active`, { params })
    return res.data
}

// GET: جلب خطة واحدة
export const fetchStudentPlanById = async (planId) => {
    const res = await axios.get(`${BASE}/${planId}`)
    return res.data
}

// POST: إنشاء خطة
export const createStudentPlan = async (planData) => {
    const res = await axios.post(BASE, planData)
    return res.data
}

// PUT: تحديث خطة
export const updateStudentPlan = async (planId, planData) => {
    const res = await axios.put(`${BASE}/${planId}`, planData)
    return res.data
}

// DELETE: تعطيل/حذف خطة
export const deleteStudentPlan = async (planId, permanent = false) => {
    const res = await axios.delete(`${BASE}/${planId}`, {
        params: { permanent: permanent ? 'true' : 'false' },
    })
    return res.data
}

// POST: تفعيل/تعطيل
export const toggleStudentPlanActivation = async (planId) => {
    const res = await axios.post(`${BASE}/${planId}/toggle`)
    return res.data
}
