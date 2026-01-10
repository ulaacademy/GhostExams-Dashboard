import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3000/api',
baseURL: import.meta.env.VITE_API_URL || 'https://ge-api.ghostexams.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
// 
// Add a request interceptor for handling auth tokens if needed
axiosInstance.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for handling errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;