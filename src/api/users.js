import axiosInstance from './axiosInstance';

// Admin - Students
export const fetchStudents = async (params = {}) => {
    // params: { page, limit, search, sortBy, sortOrder }
    const response = await axiosInstance.get('/admin/students', { params });
    return response.data; // { items, total, page, limit }
};

export const fetchStudentById = async (studentId) => {
    const response = await axiosInstance.get(`/admin/students/${studentId}`);
    return response.data;
};

export const banStudent = async (studentId, isBanned) => {
    const response = await axiosInstance.patch(`/admin/students/${studentId}/ban`, { isBanned });
    return response.data;
};

export const deleteStudent = async (studentId) => {
    const response = await axiosInstance.delete(`/admin/students/${studentId}`);
    return response.data;
};

// Admin - Teachers
export const fetchTeachers = async (params = {}) => {
    // params: { page, limit, search, sortBy, sortOrder }
    const response = await axiosInstance.get('/admin/teachers', { params });
    return response.data; // { items, total, page, limit }
};

export const fetchTeacherById = async (teacherId) => {
    const response = await axiosInstance.get(`/admin/teachers/${teacherId}`);
    return response.data;
};

export const banTeacher = async (teacherId, isBanned) => {
    const response = await axiosInstance.patch(`/admin/teachers/${teacherId}/ban`, { isBanned });
    return response.data;
};

export const deleteTeacher = async (teacherId) => {
    const response = await axiosInstance.delete(`/admin/teachers/${teacherId}`);
    return response.data;
};

export default {
    fetchStudents,
    banStudent,
    deleteStudent,
    fetchTeachers,
    banTeacher,
    deleteTeacher,
};


