import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactApexChart from 'react-apexcharts'
import { fetchUserAnalytics, selectUserAnalytics, selectAnalyticsLoading } from '@/store/analyticsSlice'

const UserGrowthChart = () => {
    const dispatch = useDispatch()
    const users = useSelector(selectUserAnalytics)
    const loading = useSelector(selectAnalyticsLoading)

    useEffect(() => {
        dispatch(fetchUserAnalytics())
    }, [dispatch])

    const chartData = React.useMemo(() => {
        if (!users || !users.teachers?.growth || !users.students?.growth) {
            return {
                teachersSeries: [],
                studentsSeries: [],
                categories: []
            }
        }

        // Get all unique dates
        const allDates = new Set([
            ...users.teachers.growth.map(item => item._id),
            ...users.students.growth.map(item => item._id)
        ])
        const sortedDates = Array.from(allDates).sort()

        // Create data series
        const teachersData = sortedDates.map(date => {
            const found = users.teachers.growth.find(item => item._id === date)
            return found ? found.count : 0
        })

        const studentsData = sortedDates.map(date => {
            const found = users.students.growth.find(item => item._id === date)
            return found ? found.count : 0
        })

        return {
            teachersSeries: teachersData,
            studentsSeries: studentsData,
            categories: sortedDates.map(date => {
                if (!date) return 'N/A'
                const d = new Date(date)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })
        }
    }, [users])

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 300,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: { fontSize: '12px' }
            }
        },
        yaxis: {
            title: { text: 'New Users' },
            labels: {
                style: { fontSize: '12px' }
            }
        },
        fill: { opacity: 1 },
        colors: ['#3454d1', '#10b759'],
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 5
        }
    }

    const series = [
        {
            name: 'Teachers',
            data: chartData.teachersSeries
        },
        {
            name: 'Students',
            data: chartData.studentsSeries
        }
    ]

    return (
        <div className="col-xxl-6 col-xl-6">
            <div className="card stretch stretch-full">
                <div className="card-header">
                    <h5 className="card-title">User Growth (Last 30 Days)</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : chartData.categories.length > 0 ? (
                        <>
                            <ReactApexChart
                                options={chartOptions}
                                series={series}
                                type="bar"
                                height={300}
                            />
                            <div className="row g-3 mt-3">
                                <div className="col-6">
                                    <div className="p-3 border border-dashed rounded text-center">
                                        <div className="fs-12 text-muted mb-1">Total Teachers</div>
                                        <h5 className="fw-bold text-primary mb-0">{users?.teachers?.total || 0}</h5>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 border border-dashed rounded text-center">
                                        <div className="fs-12 text-muted mb-1">Total Students</div>
                                        <h5 className="fw-bold text-success mb-0">{users?.students?.total || 0}</h5>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <p>No growth data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserGrowthChart

