// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/shared/table/Table";
// eslint-disable-next-line no-unused-vars
import { FiCheck, FiX, FiRefreshCw, FiEdit3, FiPauseCircle } from "react-icons/fi";
import topTost from "@/utils/topTost";

import {
  fetchStudentSubscriptionsList,
  activateStudentSubscriptionThunk,
  deactivateStudentSubscriptionThunk,
  renewStudentSubscriptionThunk,
  updateStudentPaymentStatusThunk,
  selectStudentSubscriptions,
  selectStudentSubscriptionsLoading,
  selectStudentSubscriptionsTotal,
} from "@/store/studentSubscriptionsSlice";

const StudentSubscriptionsTable = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [modalData, setModalData] = useState({
    paymentDate: "",
    newEndDate: "",
    amount: "",
    paymentMethod: "",
    paymentStatus: "paid",
    notes: "",
    reason: "",
  });

  const subscriptions = useSelector(selectStudentSubscriptions);
  const loading = useSelector(selectStudentSubscriptionsLoading);
  const total = useSelector(selectStudentSubscriptionsTotal);

  useEffect(() => {
    const params = {
      page,
      limit,
      search: search.trim() || undefined,
      status: statusFilter || undefined,
    };
    dispatch(fetchStudentSubscriptionsList(params));
  }, [page, limit, search, statusFilter, dispatch]);

  const handleActivate = (subscription) => {
    setSelectedSubscription(subscription);
    setModalData({
      paymentDate: "",
      newEndDate: "",
      amount: "",
      paymentMethod: "",
      paymentStatus: "paid",
      notes: "",
      reason: "",
    });
    setShowActivateModal(true);
  };

  const handleDeactivate = (subscription) => {
    setSelectedSubscription(subscription);
    setModalData({
      paymentDate: "",
      newEndDate: "",
      amount: "",
      paymentMethod: "",
      paymentStatus: "pending",
      notes: "",
      reason: "",
    });
    setShowDeactivateModal(true);
  };

  const handleRenew = (subscription) => {
    setSelectedSubscription(subscription);
    setModalData({
      paymentDate: "",
      newEndDate: "",
      amount: "",
      paymentMethod: "",
      paymentStatus: "paid",
      notes: "",
      reason: "",
    });
    setShowRenewModal(true);
  };

  const handleUpdatePayment = (subscription) => {
    setSelectedSubscription(subscription);
    setModalData({
      paymentDate: "",
      newEndDate: "",
      amount: "",
      paymentMethod: "",
      paymentStatus: "paid",
      notes: "",
      reason: "",
    });
    setShowPaymentModal(true);
  };

  const refreshList = () => {
    dispatch(
      fetchStudentSubscriptionsList({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      })
    );
  };

  const handleConfirmActivate = async () => {
    await dispatch(
      activateStudentSubscriptionThunk({
        subscriptionId: selectedSubscription.id,
        data: modalData,
      })
    );
    setShowActivateModal(false);
    refreshList();
    topTost();
  };

  const handleConfirmDeactivate = async () => {
    await dispatch(
      deactivateStudentSubscriptionThunk({
        subscriptionId: selectedSubscription.id,
        data: modalData,
      })
    );
    setShowDeactivateModal(false);
    refreshList();
    topTost();
  };

  const handleConfirmRenew = async () => {
    await dispatch(
      renewStudentSubscriptionThunk({
        subscriptionId: selectedSubscription.id,
        data: modalData,
      })
    );
    setShowRenewModal(false);
    refreshList();
    topTost();
  };

  const handleConfirmPayment = async () => {
    await dispatch(
      updateStudentPaymentStatusThunk({
        subscriptionId: selectedSubscription.id,
        data: modalData,
      })
    );
    setShowPaymentModal(false);
    refreshList();
    topTost();
  };

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "studentName",
        header: () => "Student",
        cell: (info) => {
          const value = info.getValue() || info.row.original.studentId;
          return <span className="text-truncate-1-line">{value ? String(value) : "-"}</span>;
        },
      },
      {
        accessorKey: "planName",
        header: () => "Plan",
        cell: (info) => {
          const value = info.getValue() || info.row.original.planId;
          return <span className="text-truncate-1-line">{value ? String(value) : "-"}</span>;
        },
      },
      {
        accessorKey: "status",
        header: () => "Status",
        cell: (info) => {
          const status = info.getValue() || "pending";
          const badges = {
            active: "bg-success",
            canceled: "bg-danger",
            expired: "bg-warning",
            pending: "bg-secondary",
            inactive: "bg-dark",
          };
          return <span className={`badge ${badges[String(status)] || "bg-secondary"}`}>{String(status)}</span>;
        },
      },
      {
        accessorKey: "paymentStatus",
        header: () => "Payment",
        cell: (info) => {
          const status = info.getValue() || "pending";
          const badges = {
            paid: "bg-success",
            pending: "bg-warning",
            failed: "bg-danger",
            refunded: "bg-dark",
          };
          return <span className={`badge ${badges[String(status)] || "bg-secondary"}`}>{String(status)}</span>;
        },
      },
      {
        accessorKey: "startDate",
        header: () => "Start Date",
        cell: (info) => {
          const date = info.getValue();
          if (!date) return "-";
          try {
            return new Date(date).toLocaleDateString();
          } catch {
            return String(date);
          }
        },
      },
      {
        accessorKey: "endDate",
        header: () => "End Date",
        cell: (info) => {
          const date = info.getValue();
          if (!date) return "-";
          try {
            return new Date(date).toLocaleDateString();
          } catch {
            return String(date);
          }
        },
      },
      {
        accessorKey: "actions",
        header: () => "Actions",
        cell: ({ row }) => {
          const subscription = row.original;

          return (
            <div className="hstack gap-2">
              {subscription.status !== "active" && (
                <button className="btn btn-xs btn-success" onClick={() => handleActivate(subscription)}>
                  <FiCheck /> Activate
                </button>
              )}

              {subscription.status === "active" && (
                <>
                  <button className="btn btn-xs btn-outline-warning" onClick={() => handleDeactivate(subscription)}>
                    <FiPauseCircle /> Deactivate
                  </button>
                  <button className="btn btn-xs btn-primary" onClick={() => handleRenew(subscription)}>
                    <FiRefreshCw /> Renew
                  </button>
                  <button className="btn btn-xs btn-warning" onClick={() => handleUpdatePayment(subscription)}>
                    <FiEdit3 /> Payment
                  </button>
                </>
              )}

              {subscription.status !== "active" && (
                <button className="btn btn-xs btn-info" onClick={() => handleUpdatePayment(subscription)}>
                  <FiEdit3 /> Payment
                </button>
              )}
            </div>
          );
        },
        meta: { headerClassName: "text-end", className: "text-end" },
      },
    ];
  }, []);

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <div className="card-body">
          <h5 className="mb-3">Student Subscriptions Management</h5>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: 150 }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>

            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: 260 }}
              placeholder="Search student subscriptions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              className="form-select form-select-sm"
              style={{ maxWidth: 120 }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
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
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>

              <div className="small text-muted">
                Page {page} ({subscriptions.length} of {total} subscriptions)
              </div>

              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={subscriptions.length < limit || (total && page * limit >= total)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activate Modal */}
      <div
        className={`modal fade ${showActivateModal ? "show d-block" : ""}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setShowActivateModal(false)}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Activate Student Subscription</h5>
              <button type="button" className="btn-close" onClick={() => setShowActivateModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Payment Date (optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={modalData.paymentDate}
                  onChange={(e) => setModalData({ ...modalData, paymentDate: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={modalData.notes}
                  onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowActivateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleConfirmActivate}>
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      <div
        className={`modal fade ${showDeactivateModal ? "show d-block" : ""}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setShowDeactivateModal(false)}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deactivate Student Subscription</h5>
              <button type="button" className="btn-close" onClick={() => setShowDeactivateModal(false)}></button>
            </div>

            <div className="modal-body">
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
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={modalData.notes}
                  onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-warning" onClick={handleConfirmDeactivate}>
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      <div
        className={`modal fade ${showRenewModal ? "show d-block" : ""}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setShowRenewModal(false)}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Renew Student Subscription</h5>
              <button type="button" className="btn-close" onClick={() => setShowRenewModal(false)}></button>
            </div>

            <div className="modal-body">
              <p className="text-muted mb-3">Renew will extend subscription endDate based on plan snapshot on backend.</p>
              <div className="mb-3">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={modalData.notes}
                  onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowRenewModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmRenew}>
                Renew
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <div
        className={`modal fade ${showPaymentModal ? "show d-block" : ""}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setShowPaymentModal(false)}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Payment Status</h5>
              <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    value={modalData.paymentStatus}
                    onChange={(e) => setModalData({ ...modalData, paymentStatus: e.target.value })}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Payment Date (optional)</label>
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
              <button className="btn btn-outline-secondary" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmPayment}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubscriptionsTable;
