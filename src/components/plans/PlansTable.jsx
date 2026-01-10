import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiTrash2, FiPower, FiPlus } from 'react-icons/fi'
import { confirmDelete } from '@/utils/confirmDelete'
import topTost from '@/utils/topTost'
import {
    fetchPlansList,
    deletePlanThunk,
    togglePlanActivationThunk,
    createPlanThunk,
    updatePlanThunk,
    selectPlans,
    selectPlansLoading,
    selectPlansTotal,
} from '@/store/plansSlice'

const PlansTable = () => {
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
        maxStudents: '',
        maxExams: '',
        maxQuestions: '',
        duration: '',
        durationUnit: 'days',
        features: '',
    })

    const plans = useSelector(selectPlans)
    const loading = useSelector(selectPlansLoading)
    const total = useSelector(selectPlansTotal)

    // Filter plans based on active status
    const filteredPlans = showActive 
        ? plans.filter(plan => plan.isActive === true)
        : plans

    useEffect(() => {
        const params = { page, limit, search: search.trim() || undefined }
        dispatch(fetchPlansList(params))
    }, [page, limit, search, dispatch])

    const handleAdd = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            currency: 'JOD',
            maxStudents: '',
            maxExams: '',
            maxQuestions: '',
            duration: '',
            durationUnit: 'days',
            features: '',
        })
        setShowAddModal(true)
    }

    const handleEdit = (plan) => {
        setSelectedPlan(plan)
        setFormData({
            name: plan.name,
            description: plan.description || '',
            price: plan.price,
            currency: plan.currency,
            maxStudents: plan.maxStudents,
            maxExams: plan.maxExams,
            maxQuestions: plan.maxQuestions,
            duration: plan.duration,
            durationUnit: plan.durationUnit || 'days',
            features: plan.features?.join(', ') || '',
        })
        setShowEditModal(true)
    }

    const handleDelete = (plan) => {
        setSelectedPlan(plan)
        setShowDeleteModal(true)
    }

    const handleToggleActivation = async (plan) => {
        await dispatch(togglePlanActivationThunk(plan.id))
        // Refresh the list
        dispatch(fetchPlansList({ page, limit, search: search.trim() || undefined }))
        topTost()
    }

    const handleConfirmDelete = async () => {
        const res = await confirmDelete(selectedPlan.id)
        if (!res?.confirmed) return
        await dispatch(deletePlanThunk({ planId: selectedPlan.id, permanent: false }))
        setShowDeleteModal(false)
        setSelectedPlan(null)
        // Refresh the list
        dispatch(fetchPlansList({ page, limit, search: search.trim() || undefined }))
        topTost()
    }

    const handleSave = async (isEdit) => {
        try {
            const submitData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                currency: formData.currency,
                maxStudents: Number(formData.maxStudents),
                maxExams: Number(formData.maxExams),
                maxQuestions: Number(formData.maxQuestions),
                duration: Number(formData.duration),
                durationUnit: formData.durationUnit,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f),
            }

            if (isEdit) {
                await dispatch(updatePlanThunk({ planId: selectedPlan.id, planData: submitData }))
                setShowEditModal(false)
                setSelectedPlan(null)
            } else {
                await dispatch(createPlanThunk(submitData))
                setShowAddModal(false)
            }
            // Refresh the list
            dispatch(fetchPlansList({ page, limit, search: search.trim() || undefined }))
            topTost()
        } catch (error) {
            console.error('Error saving plan:', error)
        }
    }

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'name',
                header: () => 'Name',
                cell: (info) => {
                    const value = info.getValue()
                    return <span className="text-truncate-1-line">{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'description',
                header: () => 'Description',
                cell: (info) => {
                    const value = info.getValue()
                    return (
                        <span className="text-truncate-2-line" style={{ maxWidth: '300px' }}>
                            {value ? String(value) : '-'}
                        </span>
                    )
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
                accessorKey: 'maxStudents',
                header: () => 'Max Students',
                cell: (info) => {
                    const value = info.getValue()
                    return value ? String(value) : '-'
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
                        <h5 className="mb-0">Plans Management</h5>
                        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                            <FiPlus /> Add Plan
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
                            placeholder="Search plans..."
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
                            <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Prev
                            </button>
                            <div className="small text-muted">
                                Page {page} ({filteredPlans.length} {showActive ? 'active' : ''} of {total} plans)
                            </div>
                            <button className="btn btn-sm btn-outline-secondary" disabled={filteredPlans.length < limit || (total && page * limit >= total)} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Plan Modal */}
            <div className={`modal fade ${showAddModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddModal(false)}>
                <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <PlanForm formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(false)}>Save Plan</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Plan Modal */}
            <div className={`modal fade ${showEditModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEditModal(false)}>
                <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <PlanForm formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSave(true)}>Update Plan</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDeleteModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Plan</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the plan "{selectedPlan?.name}"?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PlanForm = ({ formData, setFormData }) => {
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
                <label className="form-label">Max Students *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Max Exams *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.maxExams}
                    onChange={(e) => setFormData({ ...formData, maxExams: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Max Questions *</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.maxQuestions}
                    onChange={(e) => setFormData({ ...formData, maxQuestions: e.target.value })}
                    required
                />
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

export default PlansTable
