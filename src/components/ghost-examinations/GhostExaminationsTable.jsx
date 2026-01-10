import React, { useEffect, useMemo, useState } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiTrash2, FiPlus, FiUpload } from 'react-icons/fi'
import { confirmDelete } from '@/utils/confirmDelete'
import topTost from '@/utils/topTost'
import {
    fetchGhostExams,
    createGhostExam,
    updateGhostExam,
    deleteGhostExam,
    uploadExcelQuestions,
} from '@/api/ghostExams'
import axiosInstance from '@/api/axiosInstance'
import PropTypes from "prop-types";



const GhostExaminationsTable = () => {
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedExam, setSelectedExam] = useState(null)
    const [uploadFile, setUploadFile] = useState(null)
    const [uploadFormData, setUploadFormData] = useState({
        title: '',
        grade: '',
        term: '',
        subject: '',
        unit: '',
        difficultyLevel: '',
        duration: '',
    })
    const [uploadStatus, setUploadStatus] = useState({ type: 'idle', message: '' })
    const [skippedRows, setSkippedRows] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        grade: '',
        term: '',
        duration: '',
        maxScore: '',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }],
    })

    useEffect(() => {
        loadExams()
    }, [])

    const loadExams = async () => {
        try {
            setLoading(true)
            const data = await fetchGhostExams()
            setExams(data || [])
        } catch (error) {
            console.error('Error loading exams:', error)
            topTost('error', 'Failed to load exams')
        } finally {
            setLoading(false)
        }
    }

    const filteredExams = useMemo(() => {
        if (!search.trim()) return exams
        const searchLower = search.toLowerCase()
        return exams.filter(exam =>
            exam.title?.toLowerCase().includes(searchLower) ||
            exam.subject?.toLowerCase().includes(searchLower) ||
            exam.grade?.toString().includes(searchLower)
        )
    }, [exams, search])

    const handleAdd = () => {
        setFormData({
            title: '',
            subject: '',
            grade: '',
            term: '',
            duration: '',
            maxScore: '',
            questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }],
        })
        setShowAddModal(true)
    }

    const handleEdit = (exam) => {
        setSelectedExam(exam)
        setFormData({
            title: exam.title || '',
            subject: exam.subject || '',
            grade: exam.grade?.toString() || '',
            term: exam.term || '',
            duration: exam.duration?.toString() || '',
            maxScore: exam.maxScore?.toString() || exam.questions?.length?.toString() || '',
            questions: exam.questions && exam.questions.length > 0
                ? exam.questions.map(q => ({
                    questionText: q.questionText || '',
                    options: q.options || ['', '', '', ''],
                    correctAnswer: q.correctAnswer || '',
                    explanation: q.explanation || '',
                }))
                : [{ questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }],
        })
        setShowEditModal(true)
    }

    const handleDelete = (exam) => {
        setSelectedExam(exam)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        try {
            const res = await confirmDelete(selectedExam._id)
            if (!res?.confirmed) return
            await deleteGhostExam(selectedExam._id)
            setShowDeleteModal(false)
            setSelectedExam(null)
            loadExams()
            topTost('success', 'Exam deleted successfully')
        } catch (error) {
            console.error('Error deleting exam:', error)
            topTost('error', 'Failed to delete exam')
        }
    }

    const handleSave = async (isEdit) => {
        try {
            // Validate form
            if (!formData.title || !formData.subject || !formData.grade || !formData.term || !formData.duration) {
                topTost('error', 'Please fill all required fields')
                return
            }

            if (!formData.questions || formData.questions.length === 0) {
                topTost('error', 'Please add at least one question')
                return
            }

            // Validate questions
            for (const q of formData.questions) {
                if (!q.questionText || !q.correctAnswer) {
                    topTost('error', 'All questions must have text and correct answer')
                    return
                }
                if (!q.options || q.options.length < 2) {
                    topTost('error', 'Each question must have at least 2 options')
                    return
                }
            }

            const submitData = {
                title: formData.title,
                subject: formData.subject,
                grade: Number(formData.grade),
                term: formData.term,
                duration: Number(formData.duration),
                maxScore: formData.maxScore ? Number(formData.maxScore) : formData.questions.length,
                questions: formData.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options.filter(opt => opt.trim() !== ''),
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    difficultyLevel: 'متوسط',
                })),
            }

            if (isEdit) {
                await updateGhostExam(selectedExam._id, submitData)
                setShowEditModal(false)
                setSelectedExam(null)
                topTost('success', 'Exam updated successfully')
            } else {
                await createGhostExam(submitData)
                setShowAddModal(false)
                topTost('success', 'Exam created successfully')
            }
            loadExams()
        } catch (error) {
            console.error('Error saving exam:', error)
            topTost('error', error.response?.data?.message || 'Failed to save exam')
        }
    }

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }],
        })
    }

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index)
        setFormData({ ...formData, questions: newQuestions })
    }

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions]
        newQuestions[index] = { ...newQuestions[index], [field]: value }
        setFormData({ ...formData, questions: newQuestions })
    }

    const updateQuestionOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...formData.questions]
        const newOptions = [...newQuestions[questionIndex].options]
        newOptions[optionIndex] = value
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions }
        setFormData({ ...formData, questions: newQuestions })
    }

    const handleUploadClick = () => {
        setUploadFile(null)
        setUploadFormData({
            title: '',
            grade: '',
            term: '',
            subject: '',
            unit: '',
            difficultyLevel: '',
            duration: '',
        })
        setUploadStatus({ type: 'idle', message: '' })
        setSkippedRows([])
        setShowUploadModal(true)
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && !selectedFile.name.match(/\.(xls|xlsx)$/i)) {
            setUploadStatus({
                type: 'error',
                message: 'Please select an Excel file (.xls or .xlsx)',
            })
            setUploadFile(null)
            return
        }
        setUploadFile(selectedFile || null)
        setUploadStatus({ type: 'idle', message: '' })
    }

    const handleUploadSubmit = async (event) => {
        event.preventDefault()

        if (!uploadFile) {
            setUploadStatus({
                type: 'error',
                message: 'Please select an Excel file before uploading',
            })
            return
        }

        // Validate required fields for Ghost Exam
        if (!uploadFormData.title || !uploadFormData.subject || !uploadFormData.grade || !uploadFormData.term || !uploadFormData.duration) {
            setUploadStatus({
                type: 'error',
                message: 'Please fill all required fields: Title, Subject, Grade, Term, and Duration',
            })
            return
        }

        // Extract and validate grade number
        const extractGradeNumber = (gradeStr) => {
            if (!gradeStr) return null
            // Try direct conversion first
            const directNum = Number(gradeStr)
            if (!isNaN(directNum) && isFinite(directNum)) {
                return Math.floor(directNum)
            }
            // Try to extract number from string (e.g., "Grade 9" -> 9, "test 22" -> 22)
            const match = gradeStr.toString().match(/\d+/)
            if (match) {
                return parseInt(match[0], 10)
            }
            return null
        }

        const gradeNumber = extractGradeNumber(uploadFormData.grade)
        if (gradeNumber === null || isNaN(gradeNumber)) {
            setUploadStatus({
                type: 'error',
                message: 'Grade must be a valid number (e.g., 9, 10, 11, 12). Please enter a numeric grade.',
            })
            return
        }

        setUploadStatus({ type: 'loading', message: 'Uploading file and creating exam...' })

        try {
            // Step 1: Upload Excel file and import questions
            const result = await uploadExcelQuestions({
                file: uploadFile,
                title: uploadFormData.title,
                grade: uploadFormData.grade,
                term: uploadFormData.term,
                subject: uploadFormData.subject,
                unit: uploadFormData.unit,
                difficultyLevel: uploadFormData.difficultyLevel,
            })

            // Step 2: Fetch the imported questions to create Ghost Exam
            // We'll query for questions with matching metadata that were just created
            setUploadStatus({ type: 'loading', message: 'Creating Ghost Exam...' })

                  // Use get-all endpoint and filter client-side
            // Note: This fetches all questions, but we filter by our criteria
            const questionResponse = await axiosInstance.get('/questions/get-all')
            
            const allQuestions = questionResponse.data?.questions || questionResponse.data || []
            
            // Filter to get only the Excel questions matching our criteria
            // Sort by createdAt descending to get the most recent first
            const filteredQuestions = allQuestions.filter(q => {
                // Match source
                if (q.source !== 'Excel') return false
                
                // Match subject
                if (q.subject !== uploadFormData.subject) return false
                
                // Match term
                if (q.term !== uploadFormData.term) return false
                
                // Match grade - handle different formats (number, string, "grade-X")
                const questionGrade = q.grade?.toString() || ''
                const inputGrade = gradeNumber?.toString() || uploadFormData.grade?.toString() || ''
                const gradeMatch = 
                    questionGrade === inputGrade ||
                    questionGrade === `grade-${inputGrade}` ||
                    questionGrade === `grade-${gradeNumber}` ||
                    questionGrade.replace('grade-', '') === inputGrade ||
                    questionGrade.replace('grade-', '') === gradeNumber?.toString()
                
                return gradeMatch
            })
            
            const matchingQuestions = filteredQuestions
                .sort((a, b) => {
                    // Sort by createdAt descending (newest first)
                    const dateA = new Date(a.createdAt || a.created_at || 0)
                    const dateB = new Date(b.createdAt || b.created_at || 0)
                    return dateB - dateA
                })
                .slice(0, result.insertedCount || filteredQuestions.length) // Get the first N questions (most recent)

            if (matchingQuestions.length === 0) {
                throw new Error('Failed to retrieve imported questions. The questions were imported but could not be found. Please try creating the exam manually using the "Add Exam" button.')
            }

            // Step 3: Create Ghost Exam with the imported questions
            const examData = {
                title: uploadFormData.title,
                subject: uploadFormData.subject,
                grade: gradeNumber, // Use the validated grade number
                term: uploadFormData.term,
                duration: Number(uploadFormData.duration) || matchingQuestions.length * 2,
                maxScore: matchingQuestions.length,
                questions: matchingQuestions.map(q => ({
                    questionText: q.questionText,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    difficultyLevel: q.difficultyLevel || uploadFormData.difficultyLevel || 'متوسط',
                })),
            }

            await createGhostExam(examData)

            setUploadStatus({
                type: 'success',
                message: `Success! ${result.insertedCount || 0} questions imported and Ghost Exam "${uploadFormData.title}" created.`,
            })
            setSkippedRows(result.skippedRows || [])

            // Reset form
            setUploadFile(null)
            setUploadFormData({
                title: '',
                grade: '',
                term: '',
                subject: '',
                unit: '',
                difficultyLevel: '',
                duration: '',
            })
            event.target.reset()

            // Reload exams after a short delay
            setTimeout(() => {
                loadExams()
                setShowUploadModal(false)
            }, 1500)
        } catch (error) {
            const details =
                Array.isArray(error.details) && error.details.length
                    ? error.details
                          .map((detail) => `• Row ${detail.row}: ${detail.reason || 'Unknown error'}`)
                          .join('\n')
                    : error.details || ''

            setUploadStatus({
                type: 'error',
                message: `${error.message}${details ? `\n${details}` : ''}`.trim(),
            })
            setSkippedRows([])
        }
    }

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'title',
                header: () => 'Title',
                cell: (info) => {
                    const value = info.getValue()
                    return <span className="text-truncate-1-line">{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'subject',
                header: () => 'Subject',
                cell: (info) => {
                    const value = info.getValue()
                    return <span>{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'grade',
                header: () => 'Grade',
                cell: (info) => {
                    const value = info.getValue()
                    return <span>{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'term',
                header: () => 'Term',
                cell: (info) => {
                    const value = info.getValue()
                    return <span>{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'duration',
                header: () => 'Duration (min)',
                cell: (info) => {
                    const value = info.getValue()
                    return <span>{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'questions',
                header: () => 'Questions',
                cell: (info) => {
                    const questions = info.getValue()
                    return <span>{questions ? questions.length : 0}</span>
                },
            },
            {
                accessorKey: 'actions',
                header: () => 'Actions',
                cell: ({ row }) => {
                    const exam = row.original
                    return (
                        <div className="hstack gap-2">
                            <button className="btn btn-xs btn-primary" onClick={() => handleEdit(exam)}>
                                <FiEdit3 /> Edit
                            </button>
                            <button className="btn btn-xs btn-outline-danger" onClick={() => handleDelete(exam)}>
                                <FiTrash2 /> Delete
                            </button>
                        </div>
                    )
                },
                meta: { headerClassName: 'text-end', className: 'text-end' },
            },
        ]
    }, [])

    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Ghost Examinations Management</h5>
                        <div className="hstack gap-2">
                            <button className="btn btn-sm btn-success" onClick={handleUploadClick}>
                                <FiUpload /> Upload Excel
                            </button>
                            <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                                <FiPlus /> Add Exam
                            </button>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ maxWidth: 260 }}
                            placeholder="Search exams..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="py-4">Loading...</div>
                    ) : (
                        <Table data={filteredExams} columns={columns} showSearch={false} showPagination={false} />
                    )}

                    {!loading && filteredExams.length === 0 && (
                        <div className="text-center py-4 text-muted">
No exams found. Click &quot;Add Exam&quot; to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Exam Modal */}
            <div className={`modal fade ${showAddModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddModal(false)}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Ghost Examination</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <ExamForm
                                formData={formData}
                                setFormData={setFormData}
                                addQuestion={addQuestion}
                                removeQuestion={removeQuestion}
                                updateQuestion={updateQuestion}
                                updateQuestionOption={updateQuestionOption}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(false)}>Save Exam</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Exam Modal */}
            <div className={`modal fade ${showEditModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEditModal(false)}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Ghost Examination</h5>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <ExamForm
                                formData={formData}
                                setFormData={setFormData}
                                addQuestion={addQuestion}
                                removeQuestion={removeQuestion}
                                updateQuestion={updateQuestion}
                                updateQuestionOption={updateQuestionOption}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(true)}>Update Exam</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDeleteModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Exam</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
<p>Are you sure you want to delete the exam &quot;{selectedExam?.title}&quot;?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Excel Modal */}
            <div className={`modal fade ${showUploadModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowUploadModal(false)}>
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload Excel File</h5>
                            <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted mb-3">
                                Upload an Excel file containing questions. The file should have columns: Question, Option A, Option B, Option C, Option D, Correct Answer.
                            </p>
                            <div className="alert alert-info">
                                <small>
                                    <strong>Required columns:</strong> Question, Option A, Option B, Option C, Option D, Correct Answer.
                                    <br />
                                    Rows with missing data or incorrect answers will be skipped.
                                </small>
                            </div>

                            <form id="upload-excel-form" onSubmit={(e) => { e.preventDefault(); handleUploadSubmit(e); }}>
                                <div className="mb-3">
                                    <label className="form-label">Excel File *</label>
                                    <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Exam Title *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={uploadFormData.title}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                                            placeholder="e.g., Mathematics Exam 1"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Duration (minutes) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={uploadFormData.duration}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, duration: e.target.value })}
                                            placeholder="e.g., 60"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Subject *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={uploadFormData.subject}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, subject: e.target.value })}
                                            placeholder="e.g., Mathematics"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Grade *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={uploadFormData.grade}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, grade: e.target.value })}
                                            placeholder="e.g., 9"
                                            min="1"
                                            max="12"
                                            required
                                        />
                                        <small className="text-muted">Enter a number between 1 and 12</small>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Term *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={uploadFormData.term}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, term: e.target.value })}
                                            placeholder="e.g., First Term"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Unit (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={uploadFormData.unit}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, unit: e.target.value })}
                                            placeholder="e.g., Unit 2"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Difficulty Level (Optional)</label>
                                        <select
                                            className="form-control"
                                            value={uploadFormData.difficultyLevel}
                                            onChange={(e) => setUploadFormData({ ...uploadFormData, difficultyLevel: e.target.value })}
                                        >
                                            <option value="">-- Select Difficulty --</option>
                                            <option value="سهل">Easy</option>
                                            <option value="متوسط">Medium</option>
                                            <option value="صعب">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                {uploadStatus.type !== 'idle' && (
                                    <div
                                        className={`alert ${
                                            uploadStatus.type === 'success'
                                                ? 'alert-success'
                                                : uploadStatus.type === 'error'
                                                ? 'alert-danger'
                                                : 'alert-info'
                                        } mb-3`}
                                        style={{ whiteSpace: 'pre-line' }}
                                    >
                                        {uploadStatus.message}
                                    </div>
                                )}

                                {skippedRows.length > 0 && (
                                    <div className="alert alert-warning mb-3">
                                        <p className="mb-2">
                                            <strong>Some rows were skipped due to data errors:</strong>
                                        </p>
                                        <ul className="mb-0" style={{ paddingLeft: '20px' }}>
                                            {skippedRows.map((rowInfo, idx) => (
                                                <li key={idx}>
                                                    Row {rowInfo.row}: {rowInfo.reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowUploadModal(false)}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="upload-excel-form"
                                className="btn btn-success"
                                disabled={uploadStatus.type === 'loading'}
                            >
                                {uploadStatus.type === 'loading' ? 'Uploading...' : 'Upload File'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExamForm = ({ formData, setFormData, addQuestion, removeQuestion, updateQuestion, updateQuestionOption }) => {
    return (
        <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label">Title *</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Subject *</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Grade *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Term *</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    placeholder="e.g., الفصل الأول"
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Duration (minutes) *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Max Score</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    placeholder="Auto-calculated if empty"
                />
            </div>

            <div className="col-12 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Questions *</label>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={addQuestion}>
                        <FiPlus /> Add Question
                    </button>
                </div>
                {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Question {qIndex + 1}</h6>
                                {formData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        <FiTrash2 /> Remove
                                    </button>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Question Text *</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={question.questionText}
                                    onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Options *</label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="input-group mb-2">
                                        <span className="input-group-text">{String.fromCharCode(65 + oIndex)}</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={option}
                                            onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Correct Answer *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={question.correctAnswer}
                                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    placeholder="Enter the correct answer text"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Explanation</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={question.explanation}
                                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                    placeholder="Optional explanation for the answer"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
ExamForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  updateQuestionOption: PropTypes.func.isRequired,
};


export default GhostExaminationsTable

