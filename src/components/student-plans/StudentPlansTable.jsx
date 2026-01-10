// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiTrash2, FiPower, FiPlus } from 'react-icons/fi'
import { confirmDelete } from '@/utils/confirmDelete'
import topTost from '@/utils/topTost'
import {
    fetchStudentPlansList,
    deleteStudentPlanThunk,
    toggleStudentPlanActivationThunk,
    createStudentPlanThunk,
    updateStudentPlanThunk,
    selectStudentPlans,
    selectStudentPlansLoading,
    selectStudentPlansTotal,
} from '@/store/studentPlansSlice'

const StudentPlansTable = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [showActive, setShowActive] = useState(false)

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'JOD',
        maxTeachers: '',
        teacherType: 'both',
        duration: '',
        durationUnit: 'days',
        startDate: '',
        endDate: '',
        freeExtraTeachers: '',
        freeExtraStudents: '',
        features: '',
    })

    const plans = useSelector(selectStudentPlans)
    const loading = useSelector(selectStudentPlansLoading)
    const total = useSelector(selectStudentPlansTotal)

    const filteredPlans = showActive ? plans.filter((p) => p.isActive === true) : plans

    useEffect(() => {
        const params = { page, limit, search: search.trim() || undefined }
        dispatch(fetchStudentPlansList(params))
    }, [page, limit, search, dispatch])

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            currency: 'JOD',
            maxTeachers: '',
            teacherType: 'both',
            duration: '',
            durationUnit: 'days',
            startDate: '',
            endDate: '',
            freeExtraTeachers: '',
            freeExtraStudents: '',
            features: '',
        })
    }

    const handleAdd = () => {
        resetForm()
        setShowAddModal(true)
    }

    const handleEdit = (plan) => {
        setSelectedPlan(plan)
        setFormData({
            name: plan.name || '',
            description: plan.description || '',
            price: plan.price ?? '',
            currency: plan.currency || 'JOD',
            maxTeachers: plan.maxTeachers ?? '',
            teacherType: plan.teacherType || 'both',
            duration: plan.duration ?? '',
            durationUnit: plan.durationUnit || 'days',
            startDate: plan.startDate ? String(plan.startDate).slice(0, 10) : '',
            endDate: plan.endDate ? String(plan.endDate).slice(0, 10) : '',
            freeExtraTeachers: plan.freeExtraTeachers ?? '',
            freeExtraStudents: plan.freeExtraStudents ?? '',
            features: Array.isArray(plan.features) ? plan.features.join(', ') : (plan.features || ''),
        })
        setShowEditModal(true)
    }

    const handleDelete = (plan) => {
        setSelectedPlan(plan)
        setShowDeleteModal(true)
    }

    const refresh = () => {
        dispatch(fetchStudentPlansList({ page, limit, search: search.trim() || undefined }))
    }

    const handleToggleActivation = async (plan) => {
        await dispatch(toggleStudentPlanActivationThunk(plan.id))
        refresh()
        topTost()
    }

    const handleConfirmDelete = async () => {
        const res = await confirmDelete(selectedPlan.id)
        if (!res?.confirmed) return
await dispatch(deleteStudentPlanThunk({ planId: selectedPlan.id, permanent: true }))
        setShowDeleteModal(false)
        setSelectedPlan(null)
        refresh()
        topTost()
    }

    const handleSave = async (isEdit) => {
        try {
            // ✅ أهم شيء: نخلي القيم الرقمية أرقام
            const submitData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                currency: formData.currency,

                maxTeachers: Number(formData.maxTeachers),
                teacherType: formData.teacherType,

                duration: Number(formData.duration),
                durationUnit: formData.durationUnit,

                // تواريخ
                startDate: formData.startDate,
                endDate: formData.endDate,

                // اختياري: إذا فاضي => 0
                freeExtraTeachers: formData.freeExtraTeachers === '' ? 0 : Number(formData.freeExtraTeachers),
                freeExtraStudents: formData.freeExtraStudents === '' ? 0 : Number(formData.freeExtraStudents),

                features: String(formData.features || '')
                    .split(',')
                    .map((f) => f.trim())
                    .filter((f) => f),
            }

            if (isEdit) {
                await dispatch(updateStudentPlanThunk({ planId: selectedPlan.id, planData: submitData }))
                setShowEditModal(false)
                setSelectedPlan(null)
            } else {
                await dispatch(createStudentPlanThunk(submitData))
                setShowAddModal(false)
            }

            refresh()
            topTost()
        } catch (error) {
            console.error('Error saving student plan:', error)
        }
    }

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'name',
                header: () => 'Name',
                cell: (info) => {
                    const v = info.getValue()
                    return <span className="text-truncate-1-line">{v ? String(v) : '-'}</span>
                },
            },
            {
                accessorKey: 'teacherType',
                header: () => 'Teacher Type',
                cell: (info) => {
                    const v = String(info.getValue() || 'both')
                    if (v === 'platform') return 'Platform'
                    if (v === 'ghost') return 'Ghost'
                    return 'Both'
                },
            },
            {
                accessorKey: 'maxTeachers',
                header: () => 'Max Teachers',
                cell: (info) => {
                    const v = info.getValue()
                    return v === 0 ? '0' : (v ? String(v) : '-')
                },
            },
            {
                accessorKey: 'price',
                header: () => 'Price',
                cell: (info) => {
                    const price = info.getValue()
                    const currency = info.row.original.currency || 'JOD'
                    return `${Number(price) || 0} ${currency}`
                },
            },
            {
                accessorKey: 'endDate',
                header: () => 'End Date',
                cell: (info) => {
                    const v = info.getValue()
                    return v ? String(v).slice(0, 10) : '-'
                },
            },
            {
                accessorKey: 'isActive',
                header: () => 'Status',
                cell: (info) => {
                    const isActive = Boolean(info.getValue())
                    return (
                        <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'actions',
                header: () => 'Actions',
                cell: ({ row }) => {
                    const plan = row.original
                    return (
                        <div className="hstack gap-2">
                            <button className="btn btn-xs btn-primary" onClick={() => handleEdit(plan)}>
                                <FiEdit3 /> Edit
                            </button>
                            <button
                                className={`btn btn-xs ${plan.isActive ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => handleToggleActivation(plan)}
                            >
                                <FiPower /> {plan.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn btn-xs btn-outline-danger" onClick={() => handleDelete(plan)}>
                                <FiTrash2 /> Delete
                            </button>
                        </div>
                    )
                },
                meta: { headerClassName: 'text-end', className: 'text-end' },
            },
        ]
    }, [dispatch])

    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Student Plans Management</h5>
                        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                            <FiPlus /> Add Student Plan
                        </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={showActive}
                                onChange={(e) => setShowActive(e.target.checked)}
                            />
                            <label className="form-check-label">Show Active Only</label>
                        </div>

                        <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ maxWidth: 260 }}
                            placeholder="Search student plans..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />

                        <select
                            className="form-select form-select-sm"
                            style={{ maxWidth: 120 }}
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="py-4">Loading...</div>
                    ) : (
                        <Table data={filteredPlans} columns={columns} showSearch={false} showPagination={false} />
                    )}

                    {!loading && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Prev
                            </button>
                            <div className="small text-muted">
                                Page {page} ({filteredPlans.length} {showActive ? 'active' : ''} of {total} plans)
                            </div>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={filteredPlans.length < limit || (total && page * limit >= total)}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <div
                className={`modal fade ${showAddModal ? 'show d-block' : ''}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowAddModal(false)}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Student Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <StudentPlanForm formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(false)}>
                                Save Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div
                className={`modal fade ${showEditModal ? 'show d-block' : ''}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowEditModal(false)}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Student Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <StudentPlanForm formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(true)}>
                                Update Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div
                className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowDeleteModal(false)}
            >
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Student Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
<p>Are you sure you want to delete the plan {selectedPlan?.name}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StudentPlanForm = ({ formData, setFormData }) => {
    return (
        <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label">Name *</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Price *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Currency *</label>
                <select
                    className="form-select"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                    <option value="JOD">JOD (دينار أردني)</option>
                    <option value="SAR">SAR (ريال سعودي)</option>
                    <option value="USD">USD (دولار أمريكي)</option>
                    <option value="EUR">EUR (يورو)</option>
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Max Teachers *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.maxTeachers}
                    onChange={(e) => setFormData({ ...formData, maxTeachers: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Teacher Type *</label>
                <select
                    className="form-select"
                    value={formData.teacherType}
                    onChange={(e) => setFormData({ ...formData, teacherType: e.target.value })}
                >
                    <option value="both">Both (الاثنين)</option>
                    <option value="platform">Platform (معلم منصة)</option>
                    <option value="ghost">Ghost (معلم الشبح)</option>
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Duration *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Duration Unit *</label>
                <select
                    className="form-select"
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Start Date *</label>
                <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">End Date *</label>
                <input
                    type="date"
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Free Extra Teachers (optional)</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Leave empty to hide"
                    value={formData.freeExtraTeachers}
                    onChange={(e) => setFormData({ ...formData, freeExtraTeachers: e.target.value })}
                />
            </div>

            <div className="col-md-6 mb-3">
                <label className="form-label">Free Extra Students (optional)</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Leave empty to hide"
                    value={formData.freeExtraStudents}
                    onChange={(e) => setFormData({ ...formData, freeExtraStudents: e.target.value })}
                />
            </div>

            <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="col-12 mb-3">
                <label className="form-label">Features (comma-separated)</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
            </div>
        </div>
    )
}



StudentPlanForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    maxTeachers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    teacherType: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    durationUnit: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    freeExtraTeachers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    freeExtraStudents: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    features: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
};



export default StudentPlansTable
