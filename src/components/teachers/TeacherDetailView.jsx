import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
    FiUser, FiMail, FiCalendar, FiBook, FiUsers, FiFileText, 
    FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiAlertCircle 
} from 'react-icons/fi'
import { fetchTeacherById } from '@/api/users'

const TeacherDetailView = ({ teacherId }) => {
    const [teacher, setTeacher] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadTeacher = async () => {
            try {
                setLoading(true)
                const response = await fetchTeacherById(teacherId)
                setTeacher(response.data)
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load teacher')
                console.error('Error loading teacher:', err)
            } finally {
                setLoading(false)
            }
        }

        if (teacherId) {
            loadTeacher()
        }
    }, [teacherId])

    if (loading) {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading teacher details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !teacher) {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <FiAlertCircle size={48} className="text-danger mb-3" />
                        <h5 className="text-danger">{error || 'Teacher not found'}</h5>
                        <Link to="/customers-list" className="btn btn-primary mt-3">
                            Back to Teachers List
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const subscription = teacher.subscriptionDetails
    const plan = subscription?.planId
    const stats = teacher.statistics || {}

    return (
        <>
            {/* Back Button */}
            <div className="col-12 mb-3">
                <Link to="/customers-list" className="btn btn-sm btn-outline-secondary">
                    ← Back to List
                </Link>
            </div>

            {/* Profile Card */}
            <div className="col-xxl-4 col-xl-5">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Profile Information</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-center mb-4">
                            <div className="avatar-text avatar-xxl bg-soft-primary text-primary mx-auto mb-3">
                                <FiUser size={48} />
                            </div>
                            <h4 className="fw-bold mb-1">{teacher.name}</h4>
                            <p className="text-muted mb-2">{teacher.email}</p>
                            <span className={`badge ${teacher.isBanned ? 'bg-danger' : 'bg-success'}`}>
                                {teacher.isBanned ? 'Banned' : 'Active'}
                            </span>
                        </div>

                        <div className="border-top pt-4">
                            <div className="mb-3 d-flex align-items-start">
                                <FiMail className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Email</div>
                                    <div className="fw-semibold">{teacher.email}</div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-start">
                                <FiBook className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Subjects</div>
                                    <div className="fw-semibold">
                                        {teacher.subjects && teacher.subjects.length > 0
                                            ? teacher.subjects.join(', ')
                                            : 'No subjects assigned'}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-start">
                                <FiCalendar className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Joined Date</div>
                                    <div className="fw-semibold">
                                        {new Date(teacher.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <FiClock className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Last Updated</div>
                                    <div className="fw-semibold">
                                        {new Date(teacher.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics & Subscription */}
            <div className="col-xxl-8 col-xl-7">
                {/* Statistics Cards */}
                <div className="row">
                    <div className="col-md-4">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-primary text-primary">
                                        <FiUsers size={20} />
                                    </div>
                                    <span className="badge bg-soft-primary text-primary">
                                        {stats.studentsUsage}/{stats.studentsLimit}
                                    </span>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.totalStudents || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Total Students</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-success text-success">
                                        <FiFileText size={20} />
                                    </div>
                                    <span className="badge bg-soft-success text-success">
                                        {stats.examsUsage}/{stats.examsLimit}
                                    </span>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.totalExams || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Total Exams</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-warning text-warning">
                                        <FiBook size={20} />
                                    </div>
                                    <span className="badge bg-soft-warning text-warning">
                                        {stats.questionsUsage}/{stats.questionsLimit}
                                    </span>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.questionsUsage || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Questions Used</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Information */}
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Subscription Details</h5>
                    </div>
                    <div className="card-body">
                        {subscription ? (
                            <>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="fs-13 text-muted">Plan Name</div>
                                                <FiTrendingUp className="text-primary" />
                                            </div>
                                            <h5 className="fw-bold mb-0">{plan?.name || 'N/A'}</h5>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="fs-13 text-muted">Status</div>
                                                {subscription.status === 'active' ? (
                                                    <FiCheckCircle className="text-success" />
                                                ) : (
                                                    <FiXCircle className="text-danger" />
                                                )}
                                            </div>
                                            <h5 className="fw-bold mb-0">
                                                <span className={`badge ${
                                                    subscription.status === 'active' ? 'bg-success' :
                                                    subscription.status === 'expired' ? 'bg-danger' :
                                                    subscription.status === 'cancelled' ? 'bg-warning' :
                                                    'bg-secondary'
                                                }`}>
                                                    {subscription.status.toUpperCase()}
                                                </span>
                                            </h5>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="fs-13 text-muted mb-2">Start Date</div>
                                            <div className="fw-semibold">
                                                {new Date(subscription.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="fs-13 text-muted mb-2">End Date</div>
                                            <div className="fw-semibold">
                                                {new Date(subscription.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="fs-13 text-muted mb-2">Days Remaining</div>
                                            <div className={`fw-bold ${
                                                subscription.daysRemaining < 0 ? 'text-danger' :
                                                subscription.daysRemaining < 7 ? 'text-warning' :
                                                'text-success'
                                            }`}>
                                                {subscription.daysRemaining < 0
                                                    ? 'Expired'
                                                    : `${subscription.daysRemaining} days`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="fs-13 text-muted mb-2">Amount</div>
                                            <div className="fw-bold">
                                                {subscription.amount} {subscription.currency}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border border-dashed rounded">
                                            <div className="fs-13 text-muted mb-2">Payment Status</div>
                                            <span className={`badge ${
                                                subscription.paymentStatus === 'paid' ? 'bg-success' :
                                                subscription.paymentStatus === 'pending' ? 'bg-warning' :
                                                'bg-danger'
                                            }`}>
                                                {subscription.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {plan && plan.features && plan.features.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Plan Features</h6>
                                        <ul className="list-unstyled">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="mb-2">
                                                    <FiCheckCircle className="text-success me-2" size={16} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiXCircle size={48} className="mb-3" />
                                <p>No active subscription</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Exams */}
            <div className="col-xxl-6">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Recent Exams</h5>
                    </div>
                    <div className="card-body">
                        {teacher.recentExams && teacher.recentExams.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {teacher.recentExams.map((exam, index) => (
                                    <div key={index} className="list-group-item d-flex justify-content-between align-items-start px-0">
                                        <div className="flex-grow-1">
                                            <h6 className="fw-semibold mb-1">{exam.title}</h6>
                                            <div className="d-flex gap-2 align-items-center">
                                                <span className="badge bg-soft-primary text-primary">{exam.subject}</span>
                                                <span className="badge bg-soft-secondary text-secondary">{exam.examType}</span>
                                                <span className="fs-12 text-muted">Grade {exam.grade}</span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fs-12 text-muted">
                                                {new Date(exam.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiFileText size={48} className="mb-3" />
                                <p>No exams created yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Students */}
            <div className="col-xxl-6">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Recent Students</h5>
                    </div>
                    <div className="card-body">
                        {teacher.recentStudents && teacher.recentStudents.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {teacher.recentStudents.map((student, index) => (
                                    <div key={index} className="list-group-item d-flex align-items-center px-0">
                                        <div className="avatar-text avatar-sm bg-soft-primary text-primary me-3">
                                            <FiUser />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-semibold mb-0">{student.name}</h6>
                                            <div className="fs-12 text-muted">{student.email}</div>
                                        </div>
                                        {student.grade && (
                                            <span className="badge bg-soft-secondary text-secondary">
                                                Grade {student.grade}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiUsers size={48} className="mb-3" />
                                <p>No students assigned yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherDetailView

