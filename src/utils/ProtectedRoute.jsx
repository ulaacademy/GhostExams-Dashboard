import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        return <Navigate to="/authentication/login/cover" state={{ from: location }} replace />
    }

    return children;
}

export default ProtectedRoute


