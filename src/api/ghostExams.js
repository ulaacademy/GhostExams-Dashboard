import axiosInstance from './axiosInstance';

// ✅ جلب جميع امتحانات Ghost Examinations
export const fetchGhostExams = async () => {
    try {
        const response = await axiosInstance.get('/exams/ghost');
        return response.data;
    } catch (error) {
        console.error('❌ خطأ في جلب امتحانات Ghost:', error);
        throw error;
    }
};

// ✅ جلب امتحان Ghost محدد بالـ ID
export const fetchGhostExamById = async (examId) => {
    try {
        const response = await axiosInstance.get(`/exams/get-exam/ghost/${examId}`);
        return response.data;
    } catch (error) {
        console.error('❌ خطأ في جلب الامتحان:', error);
        throw error;
    }
};

// ✅ إنشاء امتحان Ghost جديد
export const createGhostExam = async (examData) => {
    try {
        const response = await axiosInstance.post('/exams/ghost/create', examData);
        return response.data;
    } catch (error) {
        console.error('❌ خطأ في إنشاء الامتحان:', error);
        throw error;
    }
};

// ✅ تحديث امتحان Ghost
export const updateGhostExam = async (examId, examData) => {
    try {
        const response = await axiosInstance.put(`/exams/ghost/${examId}`, examData);
        return response.data;
    } catch (error) {
        console.error('❌ خطأ في تحديث الامتحان:', error);
        throw error;
    }
};

// ✅ حذف امتحان Ghost
export const deleteGhostExam = async (examId) => {
    try {
        const response = await axiosInstance.delete(`/exams/ghost/${examId}`);
        return response.data;
    } catch (error) {
        console.error('❌ خطأ في حذف الامتحان:', error);
        throw error;
    }
};

// ✅ رفع ملف Excel واستيراد الأسئلة إلى قاعدة البيانات
export const uploadExcelQuestions = async ({ file, title, grade, term, subject, unit, difficultyLevel }) => {
    try {
        if (!file) {
            const error = new Error('يرجى اختيار ملف Excel أولاً');
            error.response = { status: 400, data: { message: error.message } };
            throw error;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        // Backend expects examTitle (or examName or title)
        if (title) formData.append('examTitle', title.trim());

        if (grade) formData.append('grade', grade);
        if (term) formData.append('term', term);
        if (subject) formData.append('subject', subject);
        if (unit) formData.append('unit', unit);
        if (difficultyLevel) formData.append('difficultyLevel', difficultyLevel);

        const response = await axiosInstance.post('/files/import-excel-questions', formData);

        return response.data;
    } catch (error) {
        console.error('❌ خطأ في رفع ملف Excel:', error);
        const errorMessage = error.response?.data?.message || '❌ فشل رفع الملف. يرجى التأكد من التنسيق والمحاولة مجددًا.';
        const uploadError = new Error(errorMessage);
        uploadError.details = error.response?.data?.errors || error.response?.data?.details;
        throw uploadError;
    }
};

