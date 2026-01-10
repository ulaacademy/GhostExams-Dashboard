import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
    FiUser, FiMail, FiCalendar, FiBook, FiUsers, FiFileText, 
    FiCheckCircle, FiXCircle, FiAward, FiTrendingUp, FiAlertCircle, FiTarget 
} from 'react-icons/fi'
import { fetchStudentById } from '@/api/users'

const StudentDetailView = ({ studentId }) => {
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadStudent = async () => {
            try {
                setLoading(true)
                const response = await fetchStudentById(studentId)
                setStudent(response.data)
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load student')
                console.error('Error loading student:', err)
            } finally {
                setLoading(false)
            }
        }

        if (studentId) {
            loadStudent()
        }
    }, [studentId])

    if (loading) {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading student details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !student) {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <FiAlertCircle size={48} className="text-danger mb-3" />
                        <h5 className="text-danger">{error || 'Student not found'}</h5>
                        <Link to="/customers-list" className="btn btn-primary mt-3">
                            Back to Students List
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const stats = student.statistics || {}
    const performance = student.performance || {}

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
                            <div className="avatar-text avatar-xxl bg-soft-success text-success mx-auto mb-3">
                                <FiUser size={48} />
                            </div>
                            <h4 className="fw-bold mb-1">{student.name}</h4>
                            <p className="text-muted mb-2">{student.email}</p>
                            <div className="d-flex gap-2 justify-content-center">
                                <span className={`badge ${student.isBanned ? 'bg-danger' : 'bg-success'}`}>
                                    {student.isBanned ? 'Banned' : 'Active'}
                                </span>
                                {student.grade && (
                                    <span className="badge bg-soft-primary text-primary">
                                        Grade {student.grade}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="border-top pt-4">
                            <div className="mb-3 d-flex align-items-start">
                                <FiMail className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Email</div>
                                    <div className="fw-semibold">{student.email}</div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-start">
                                <FiBook className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Grade</div>
                                    <div className="fw-semibold">{student.grade || 'Not specified'}</div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-start">
                                <FiCalendar className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Joined Date</div>
                                    <div className="fw-semibold">
                                        {new Date(student.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex align-items-start">
                                <FiUsers className="me-3 mt-1 text-muted" size={18} />
                                <div className="flex-grow-1">
                                    <div className="fs-12 text-muted mb-1">Active Teachers</div>
                                    <div className="fw-semibold">
                                        {stats.activeTeachers || 0} teachers
                                    </div>
                                </div>
                            </div>

                            {performance.strongSubjects && performance.strongSubjects.length > 0 && (
                                <div className="mb-3 d-flex align-items-start">
                                    <FiTrendingUp className="me-3 mt-1 text-success" size={18} />
                                    <div className="flex-grow-1">
                                        <div className="fs-12 text-muted mb-1">Strong Subjects</div>
                                        <div className="fw-semibold text-success">
                                            {performance.strongSubjects.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {performance.weakSubjects && performance.weakSubjects.length > 0 && (
                                <div className="d-flex align-items-start">
                                    <FiTarget className="me-3 mt-1 text-warning" size={18} />
                                    <div className="flex-grow-1">
                                        <div className="fs-12 text-muted mb-1">Needs Improvement</div>
                                        <div className="fw-semibold text-warning">
                                            {performance.weakSubjects.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics & Performance */}
            <div className="col-xxl-8 col-xl-7">
                {/* Statistics Cards */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-primary text-primary">
                                        <FiFileText size={20} />
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.totalExamsTaken || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Exams Taken</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-success text-success">
                                        <FiAward size={20} />
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.averageScore || 0}%</h3>
                                <p className="fs-13 text-muted mb-0">Average Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-success text-success">
                                        <FiCheckCircle size={20} />
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.passedExams || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Passed</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card stretch stretch-full">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="avatar-text avatar-md bg-soft-danger text-danger">
                                        <FiXCircle size={20} />
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1">{stats.failedExams || 0}</h3>
                                <p className="fs-13 text-muted mb-0">Failed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject Performance */}
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Subject Performance</h5>
                    </div>
                    <div className="card-body">
                        {student.subjectPerformance && student.subjectPerformance.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {student.subjectPerformance.map((subject, index) => (
                                    <div key={index} className="list-group-item px-0">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <h6 className="fw-bold mb-1">{subject.subject}</h6>
                                                <span className="fs-12 text-muted">{subject.examsCount} exams taken</span>
                                            </div>
                                            <div className="text-end">
                                                <h4 className={`fw-bold mb-0 ${
                                                    subject.average >= 80 ? 'text-success' :
                                                    subject.average >= 60 ? 'text-primary' :
                                                    subject.average >= 50 ? 'text-warning' :
                                                    'text-danger'
                                                }`}>
                                                    {subject.average}%
                                                </h4>
                                                <span className="fs-11 text-muted">Average</span>
                                            </div>
                                        </div>
                                        <div className="progress mb-3" style={{ height: '8px' }}>
                                            <div 
                                                className={`progress-bar ${
                                                    subject.average >= 80 ? 'bg-success' :
                                                    subject.average >= 60 ? 'bg-primary' :
                                                    subject.average >= 50 ? 'bg-warning' :
                                                    'bg-danger'
                                                }`}
                                                role="progressbar" 
                                                style={{ width: `${subject.average}%` }}
                                            ></div>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-4">
                                                <div className="text-center p-2 border border-dashed rounded">
                                                    <div className="fs-11 text-muted mb-1">Highest</div>
                                                    <div className="fw-bold text-success">{subject.highest}%</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="text-center p-2 border border-dashed rounded">
                                                    <div className="fs-11 text-muted mb-1">Lowest</div>
                                                    <div className="fw-bold text-danger">{subject.lowest}%</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="text-center p-2 border border-dashed rounded">
                                                    <div className="fs-11 text-muted mb-1">Status</div>
                                                    <div className={`fw-bold ${
                                                        subject.average >= 80 ? 'text-success' :
                                                        subject.average >= 60 ? 'text-primary' :
                                                        subject.average >= 50 ? 'text-warning' :
                                                        'text-danger'
                                                    }`}>
                                                        {subject.average >= 80 ? 'Excellent' :
                                                         subject.average >= 60 ? 'Good' :
                                                         subject.average >= 50 ? 'Average' :
                                                         'Needs Work'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiBook size={48} className="mb-3" />
                                <p>No exam data available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Exam Results */}
            <div className="col-xxl-8">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Recent Exam Results</h5>
                    </div>
                    <div className="card-body">
                        {student.recentExamResults && student.recentExamResults.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {student.recentExamResults.map((result, index) => (
                                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div className="flex-grow-1">
                                            <h6 className="fw-semibold mb-1">
                                                {result.exam?.title || 'Unknown Exam'}
                                            </h6>
                                            <div className="d-flex gap-2 align-items-center">
                                                {result.exam?.subject && (
                                                    <span className="badge bg-soft-primary text-primary">
                                                        {result.exam.subject}
                                                    </span>
                                                )}
                                                {result.exam?.examType && (
                                                    <span className="badge bg-soft-secondary text-secondary">
                                                        {result.exam.examType}
                                                    </span>
                                                )}
                                                <span className="fs-12 text-muted">
                                                    {new Date(result.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fs-12 text-muted mb-1">
                                                {result.score}/{result.totalQuestions}
                                            </div>
                                            <span className={`badge ${
                                                result.performancePercentage >= 80 ? 'bg-success' :
                                                result.performancePercentage >= 60 ? 'bg-primary' :
                                                result.performancePercentage >= 50 ? 'bg-warning' :
                                                'bg-danger'
                                            }`}>
                                                {result.performancePercentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiFileText size={48} className="mb-3" />
                                <p>No exam results yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Subscriptions */}
            <div className="col-xxl-4">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Active Teachers</h5>
                    </div>
                    <div className="card-body">
                        {student.activeSubscriptions && student.activeSubscriptions.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {student.activeSubscriptions.map((sub, index) => (
                                    <div key={index} className="list-group-item d-flex align-items-start px-0">
                                        <div className="avatar-text avatar-sm bg-soft-primary text-primary me-3 mt-1">
                                            <FiUser />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-semibold mb-1">
                                                {sub.teacherId?.name || 'Unknown Teacher'}
                                            </h6>
                                            <div className="fs-12 text-muted mb-1">
                                                {sub.teacherId?.email}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <span className="badge bg-soft-success text-success">
                                                    {sub.plan}
                                                </span>
                                                <span className="fs-11 text-muted">
                                                    Until {new Date(sub.activeUntil).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <FiUsers size={48} className="mb-3" />
                                <p>No active teacher subscriptions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentDetailView

