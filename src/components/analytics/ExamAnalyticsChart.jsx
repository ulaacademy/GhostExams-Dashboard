import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactApexChart from 'react-apexcharts'
import { fetchExamAnalytics, selectExamAnalytics, selectAnalyticsLoading } from '@/store/analyticsSlice'

const ExamAnalyticsChart = () => {
    const dispatch = useDispatch()
    const exams = useSelector(selectExamAnalytics)
    const loading = useSelector(selectAnalyticsLoading)

    useEffect(() => {
        dispatch(fetchExamAnalytics())
    }, [dispatch])

    const chartData = React.useMemo(() => {
        if (!exams || !exams.byType) {
            return {
                series: [],
                labels: []
            }
        }

        return {
            series: exams.byType.map(item => item.count),
            labels: exams.byType.map(item => {
                if (!item._id) return 'Other'
                return item._id.charAt(0).toUpperCase() + item._id.slice(1)
            })
        }
    }, [exams])

    const chartOptions = {
        chart: {
            type: 'pie',
            height: 280
        },
        labels: chartData.labels,
        colors: ['#3454d1', '#10b759', '#ff6b6b', '#ffc107', '#6c757d', '#17a2b8'],
        legend: {
            position: 'bottom',
            fontSize: '13px'
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { height: 250 },
                legend: { position: 'bottom' }
            }
        }]
    }

    const topSubjects = exams?.bySubject?.slice(0, 5) || []

    return (
        <div className="col-xxl-6 col-xl-6">
            <div className="card stretch stretch-full">
                <div className="card-header">
                    <h5 className="card-title">Exam Distribution</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : chartData.series.length > 0 ? (
                        <>
                            <ReactApexChart
                                options={chartOptions}
                                series={chartData.series}
                                type="pie"
                                height={280}
                            />
                            {topSubjects.length > 0 && (
                                <div className="mt-4">
                                    <h6 className="fs-13 fw-semibold mb-3">Top Subjects</h6>
                                    <div className="list-group list-group-flush">
                                        {topSubjects.map((subject, index) => (
                                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                <span className="fs-13">{subject._id || 'Unknown'}</span>
                                                <span className="badge bg-soft-primary text-primary">{subject.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <p>No exam data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExamAnalyticsChart

