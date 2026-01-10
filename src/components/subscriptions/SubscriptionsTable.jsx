import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/components/shared/table/Table'
import { FiCheck, FiX, FiRefreshCw, FiEdit3, FiPlus, FiPauseCircle } from 'react-icons/fi'
import topTost from '@/utils/topTost'
import {
    fetchSubscriptionsList,
    activateSubscriptionThunk,
    deactivateSubscriptionThunk,
    cancelSubscriptionThunk,
    renewSubscriptionThunk,
    updatePaymentStatusThunk,
    selectSubscriptions,
    selectSubscriptionsLoading,
    selectSubscriptionsTotal,
} from '@/store/subscriptionsSlice'

const SubscriptionsTable = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showActivateModal, setShowActivateModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showRenewModal, setShowRenewModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState(null)
    const [modalData, setModalData] = useState({
        paymentDate: '',
        reason: '',
        cancelledBy: '',
        newEndDate: '',
        amount: '',
        paymentMethod: '',
        paymentStatus: 'paid',
        notes: ''
    })

    const subscriptions = useSelector(selectSubscriptions)
    const loading = useSelector(selectSubscriptionsLoading)
    const total = useSelector(selectSubscriptionsTotal)

    useEffect(() => {
        const params = {
            page,
            limit,
            search: search.trim() || undefined,
            status: statusFilter || undefined,
        }
        dispatch(fetchSubscriptionsList(params))
    }, [page, limit, search, statusFilter, dispatch])

    const handleActivate = (subscription) => {
        setSelectedSubscription(subscription)
        setModalData({
            paymentDate: '',
            reason: '',
            cancelledBy: '',
            newEndDate: '',
            amount: '',
            paymentMethod: '',
            paymentStatus: 'paid',
            notes: ''
        })
        setShowActivateModal(true)
    }

    const handleCancel = (subscription) => {
        setSelectedSubscription(subscription)
        setModalData({
            paymentDate: '',
            reason: '',
            cancelledBy: '',
            newEndDate: '',
            amount: '',
            paymentMethod: '',
            paymentStatus: 'paid',
            notes: ''
        })
        setShowCancelModal(true)
    }

    const handleDeactivate = (subscription) => {
        setSelectedSubscription(subscription)
        setModalData({
            paymentDate: '',
            reason: '',
            cancelledBy: '',
            newEndDate: '',
            amount: '',
            paymentMethod: '',
            paymentStatus: 'pending',
            notes: '',
        })
        setShowDeactivateModal(true)
    }

    const handleRenew = (subscription) => {
        setSelectedSubscription(subscription)
        setModalData({
            paymentDate: '',
            reason: '',
            cancelledBy: '',
            newEndDate: '',
            amount: '',
            paymentMethod: '',
            paymentStatus: 'paid',
            notes: ''
        })
        setShowRenewModal(true)
    }

    const handleUpdatePayment = (subscription) => {
        setSelectedSubscription(subscription)
        setModalData({
            paymentDate: '',
            reason: '',
            cancelledBy: '',
            newEndDate: '',
            amount: '',
            paymentMethod: '',
            paymentStatus: 'paid',
            notes: ''
        })
        setShowPaymentModal(true)
    }

    const handleConfirmActivate = async () => {
        await dispatch(activateSubscriptionThunk({ subscriptionId: selectedSubscription.id, data: modalData }))
        setShowActivateModal(false)
        // Refresh the list
        dispatch(fetchSubscriptionsList({ page, limit, search: search.trim() || undefined, status: statusFilter || undefined }))
        topTost()
    }

    const handleConfirmDeactivate = async () => {
        await dispatch(deactivateSubscriptionThunk({ subscriptionId: selectedSubscription.id, data: modalData }))
        setShowDeactivateModal(false)
        dispatch(fetchSubscriptionsList({ page, limit, search: search.trim() || undefined, status: statusFilter || undefined }))
        topTost()
    }

    const handleConfirmCancel = async () => {
        await dispatch(cancelSubscriptionThunk({ subscriptionId: selectedSubscription.id, data: modalData }))
        setShowCancelModal(false)
        // Refresh the list
        dispatch(fetchSubscriptionsList({ page, limit, search: search.trim() || undefined, status: statusFilter || undefined }))
        topTost()
    }

    const handleConfirmRenew = async () => {
        await dispatch(renewSubscriptionThunk({ subscriptionId: selectedSubscription.id, data: modalData }))
        setShowRenewModal(false)
        // Refresh the list
        dispatch(fetchSubscriptionsList({ page, limit, search: search.trim() || undefined, status: statusFilter || undefined }))
        topTost()
    }

    const handleConfirmPayment = async () => {
        await dispatch(updatePaymentStatusThunk({ subscriptionId: selectedSubscription.id, data: modalData }))
        setShowPaymentModal(false)
        // Refresh the list
        dispatch(fetchSubscriptionsList({ page, limit, search: search.trim() || undefined, status: statusFilter || undefined }))
        topTost()
    }

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'teacherName',
                header: () => 'Teacher',
                cell: (info) => {
                    const value = info.getValue() || info.row.original.teacherId
                    return <span className="text-truncate-1-line">{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'planName',
                header: () => 'Plan',
                cell: (info) => {
                    const value = info.getValue() || info.row.original.planId
                    return <span className="text-truncate-1-line">{value ? String(value) : '-'}</span>
                },
            },
            {
                accessorKey: 'status',
                header: () => 'Status',
                cell: (info) => {
                    const status = info.getValue() || 'pending'
                    const badges = {
                        active: 'bg-success',
                        cancelled: 'bg-danger',
                        expired: 'bg-warning',
                        pending: 'bg-secondary',
                        inactive: 'bg-dark',
                    }
                    return <span className={`badge ${badges[String(status)] || 'bg-secondary'}`}>{String(status)}</span>
                },
            },
            {
                accessorKey: 'paymentStatus',
                header: () => 'Payment',
                cell: (info) => {
                    const status = info.getValue() || 'unpaid'
                    const badges = {
                        paid: 'bg-success',
                        unpaid: 'bg-danger',
                        pending: 'bg-warning',
                    }
                    return <span className={`badge ${badges[String(status)] || 'bg-secondary'}`}>{String(status)}</span>
                },
            },
            {
                accessorKey: 'startDate',
                header: () => 'Start Date',
                cell: (info) => {
                    const date = info.getValue()
                    if (!date) return '-'
                    try {
                        return new Date(date).toLocaleDateString()
                    } catch {
                        return String(date)
                    }
                },
            },
            {
                accessorKey: 'endDate',
                header: () => 'End Date',
                cell: (info) => {
                    const date = info.getValue()
                    if (!date) return '-'
                    try {
                        return new Date(date).toLocaleDateString()
                    } catch {
                        return String(date)
                    }
                },
            },
            {
                accessorKey: 'actions',
                header: () => 'Actions',
                cell: ({ row }) => {
                    const subscription = row.original
                    return (
                        <div className="hstack gap-2">
                            {subscription.status !== 'active' && (
                                <button className="btn btn-xs btn-success" onClick={() => handleActivate(subscription)}>
                                    <FiCheck /> Activate
                                </button>
                            )}
                            {subscription.status === 'active' && (
                                <>
                                    <button className="btn btn-xs btn-outline-warning" onClick={() => handleDeactivate(subscription)}>
                                        <FiPauseCircle /> Deactivate
                                    </button>
                                    <button className="btn btn-xs btn-primary" onClick={() => handleRenew(subscription)}>
                                        <FiRefreshCw /> Renew
                                    </button>
                                    <button className="btn btn-xs btn-warning" onClick={() => handleCancel(subscription)}>
                                        <FiX /> Cancel
                                    </button>
                                </>
                            )}
                            <button className="btn btn-xs btn-info" onClick={() => handleUpdatePayment(subscription)}>
                                <FiEdit3 /> Payment
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
                    <h5 className="mb-3">Subscriptions Management</h5>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <select
                            className="form-select form-select-sm"
                            style={{ maxWidth: 150 }}
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                            <option value="pending">Pending</option>
                        </select>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ maxWidth: 260 }}
                            placeholder="Search subscriptions..."
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
                        <Table data={subscriptions} columns={columns} showSearch={false} showPagination={false} />
                    )}

                    {!loading && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Prev
                            </button>
                            <div className="small text-muted">Page {page} ({subscriptions.length} of {total} subscriptions)</div>
                            <button className="btn btn-sm btn-outline-secondary" disabled={subscriptions.length < limit || (total && page * limit >= total)} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Activate Modal */}
            <div className={`modal fade ${showActivateModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowActivateModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Activate Subscription</h5>
                            <button type="button" className="btn-close" onClick={() => setShowActivateModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Payment Date *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={modalData.paymentDate}
                                    onChange={(e) => setModalData({ ...modalData, paymentDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowActivateModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-success" onClick={handleConfirmActivate}>Activate</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deactivate Modal */}
            <div className={`modal fade ${showDeactivateModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDeactivateModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Deactivate Subscription</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeactivateModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb-3 text-muted">The teacher will lose access to plan limits until you re-activate the subscription.</p>
                            <div className="mb-3">
                                <label className="form-label">Reason (optional)</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={modalData.reason}
                                    onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Internal Notes (optional)</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={modalData.notes}
                                    onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-warning" onClick={handleConfirmDeactivate}>Deactivate</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <div className={`modal fade ${showCancelModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCancelModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Cancel Subscription</h5>
                            <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Reason *</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={modalData.reason}
                                    onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCancelModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmCancel}>Cancel Subscription</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renew Modal */}
            <div className={`modal fade ${showRenewModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowRenewModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Renew Subscription</h5>
                            <button type="button" className="btn-close" onClick={() => setShowRenewModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">New End Date *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={modalData.newEndDate}
                                        onChange={(e) => setModalData({ ...modalData, newEndDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Amount *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={modalData.amount}
                                        onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Payment Method *</label>
                                    <select
                                        className="form-select"
                                        value={modalData.paymentMethod}
                                        onChange={(e) => setModalData({ ...modalData, paymentMethod: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowRenewModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirmRenew}>Renew</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Status Modal */}
            <div className={`modal fade ${showPaymentModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPaymentModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Payment Status</h5>
                            <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Payment Status *</label>
                                    <select
                                        className="form-select"
                                        value={modalData.paymentStatus}
                                        onChange={(e) => setModalData({ ...modalData, paymentStatus: e.target.value })}
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Payment Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={modalData.paymentDate}
                                        onChange={(e) => setModalData({ ...modalData, paymentDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={modalData.notes}
                                        onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirmPayment}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default SubscriptionsTable
