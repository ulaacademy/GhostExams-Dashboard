import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiUserPlus, FiCreditCard, FiFileText, FiActivity } from 'react-icons/fi'
import { fetchRecentActivities, selectRecentActivities, selectAnalyticsLoading } from '@/store/analyticsSlice'

const RecentActivities = () => {
    const dispatch = useDispatch()
    const activities = useSelector(selectRecentActivities)
    const loading = useSelector(selectAnalyticsLoading)

    useEffect(() => {
        dispatch(fetchRecentActivities(15))
    }, [dispatch])

    const getActivityIcon = (type) => {
        switch (type) {
            case 'teacher':
                return <FiUser className="text-primary" />
            case 'student':
                return <FiUserPlus className="text-success" />
            case 'subscription':
                return <FiCreditCard className="text-warning" />
            case 'exam':
                return <FiFileText className="text-info" />
            default:
                return <FiActivity />
        }
    }

    const getActivityText = (activity) => {
        switch (activity.type) {
            case 'teacher':
                return (
                    <>
                        <strong>{activity.user || 'Unknown'}</strong> registered as teacher
                    </>
                )
            case 'student':
                return (
                    <>
                        <strong>{activity.user || 'Unknown'}</strong> registered as student
                    </>
                )
            case 'subscription':
                return (
                    <>
                        <strong>{activity.user || 'Unknown'}</strong> subscribed to <span className="badge bg-soft-primary text-primary">{activity.plan || 'Unknown'}</span>
                    </>
                )
            case 'exam':
                return (
                    <>
                        <strong>{activity.creator || 'Unknown'}</strong> created exam "{activity.title || 'Untitled'}"
                    </>
                )
            default:
                return 'Unknown activity'
        }
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    return (
        <div className="col-xxl-6 col-xl-12">
            <div className="card stretch stretch-full">
                <div className="card-header">
                    <h5 className="card-title">Recent Activities</h5>
                </div>
                <div className="card-body custom-card-scroll" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : activities && activities.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                            {activities.map((activity, index) => (
                                <li key={index} className="mb-3 pb-3 border-bottom">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-sm bg-gray-200">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="fs-13 mb-1">
                                                {getActivityText(activity)}
                                            </p>
                                            <span className="fs-11 text-muted">
                                                {formatTime(activity.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted py-4">
                            <FiActivity size={32} className="mb-2" />
                            <p>No recent activities</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecentActivities

