import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiTrendingUp,
  FiBook,
  FiUserCheck,
} from "react-icons/fi";
import {
  fetchDashboardOverview,
  selectOverview,
  selectAnalyticsLoading,
} from "@/store/analyticsSlice";

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const overview = useSelector(selectOverview);
  const loading = useSelector(selectAnalyticsLoading);

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  if (loading || !overview) {
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      id: 1,
      title: "Total Teachers",
      value: overview?.overview?.totalTeachers || 0,
      growth: overview?.growth?.teachers?.percentage || 0,
      icon: FiUsers,
      color: "primary",
      bgColor: "bg-soft-primary",
    },
    {
      id: 2,
      title: "Total Students",
      value: overview?.overview?.totalStudents || 0,
      growth: overview?.growth?.students?.percentage || 0,
      icon: FiUserCheck,
      color: "success",
      bgColor: "bg-soft-success",
    },
    {
      id: 3,
      title: "Active Subscriptions",
      value: overview?.overview?.activeSubscriptions || 0,
      total: overview?.overview?.totalSubscriptions || 0,
      icon: FiTrendingUp,
      color: "warning",
      bgColor: "bg-soft-warning",
    },
    {
      id: 4,
      title: "Total Exams",
      value: overview?.overview?.totalExams || 0,
      icon: FiFileText,
      color: "info",
      bgColor: "bg-soft-info",
    },
    {
      id: 5,
      title: "Questions Bank",
      value: overview?.overview?.totalQuestions || 0,
      icon: FiBook,
      color: "purple",
      bgColor: "bg-soft-purple",
    },
    {
      id: 6,
      title: "Teacher Revenue",
      value: `${(overview?.overview?.teacherTotalRevenue || 0).toLocaleString()} JOD`,
      subtitle: `${(overview?.overview?.teacherMonthlyRevenue || 0).toLocaleString()} JOD this month`,
      icon: FiDollarSign,
      color: "success",
      bgColor: "bg-soft-success",
    },
    {
      id: 7,
      title: "Student Revenue",
      value: `${(overview?.overview?.studentTotalRevenue || 0).toLocaleString()} JOD`,
      subtitle: `${(overview?.overview?.studentMonthlyRevenue || 0).toLocaleString()} JOD this month`,
      icon: FiDollarSign,
      color: "success",
      bgColor: "bg-soft-success",
    },

    {
      id: 8,
      title: "Total Revenue",
      value: `${(overview?.overview?.totalRevenue || 0).toLocaleString()} JOD`,
      subtitle: `${(overview?.overview?.monthlyRevenue || 0).toLocaleString()} JOD this month`,
      icon: FiDollarSign,
      color: "success",
      bgColor: "bg-soft-success",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <div key={stat.id} className="col-xxl-4 col-xl-6 col-md-6">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className={`avatar-text avatar-lg ${stat.bgColor}`}>
                    <stat.icon size={24} className={`text-${stat.color}`} />
                  </div>
                  <div>
                    <div className="fs-4 fw-bold text-dark mb-1">
                      {stat.value}
                      {stat.total && (
                        <span className="fs-13 text-muted fw-normal">
                          {" "}
                          / {stat.total}
                        </span>
                      )}
                    </div>
                    <h3 className="fs-13 fw-semibold text-muted mb-0">
                      {stat.title}
                    </h3>
                    {stat.subtitle && (
                      <p className="fs-11 text-muted mb-0">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
                {stat.growth !== undefined && (
                  <div className="badge bg-soft-success text-success">
                    +{stat.growth}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnalyticsOverview;
