import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactApexChart from 'react-apexcharts'
import { fetchRevenueAnalytics, selectRevenue, selectAnalyticsLoading } from '@/store/analyticsSlice'

const RevenueChart = () => {
    const dispatch = useDispatch()
    const revenue = useSelector(selectRevenue)
    const loading = useSelector(selectAnalyticsLoading)
    const [period, setPeriod] = useState('30')

    useEffect(() => {
        dispatch(fetchRevenueAnalytics(period))
    }, [dispatch, period])

    const chartData = React.useMemo(() => {
        if (!revenue || !revenue.dailyTrend) {
            return {
                series: [{ name: 'Revenue', data: [] }],
                categories: []
            }
        }

        const sortedData = [...revenue.dailyTrend].sort((a, b) => new Date(a._id) - new Date(b._id))
        
        return {
            series: [{
                name: 'Revenue',
                data: sortedData.map(item => item.revenue || 0)
            }],
            categories: sortedData.map(item => {
                if (!item._id) return 'N/A'
                const date = new Date(item._id)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })
        }
    }, [revenue])

    const chartOptions = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
            }
        },
        colors: ['#3454d1'],
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: { fontSize: '12px' }
            }
        },
        yaxis: {
            labels: {
                formatter: (value) => `$${value.toLocaleString()}`,
                style: { fontSize: '12px' }
            }
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 5
        },
        tooltip: {
            y: {
                formatter: (value) => `$${value.toLocaleString()}`
            }
        }
    }

    const totalRevenue = revenue?.byStatus?.find(s => s._id === 'paid')?.total || 0
    const pendingRevenue = revenue?.byStatus?.find(s => s._id === 'pending')?.total || 0
    const unpaidRevenue = revenue?.byStatus?.find(s => s._id === 'unpaid')?.total || 0

    return (
        <div className="col-xxl-8 col-xl-12">
            <div className="card stretch stretch-full">
                <div className="card-header">
                    <h5 className="card-title">Revenue Analytics</h5>
                    <div className="card-header-action">
                        <select 
                            className="form-select form-select-sm"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                </div>
                <div className="card-body custom-card-action p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <ReactApexChart
                            options={chartOptions}
                            series={chartData.series}
                            type="area"
                            height={300}
                        />
                    )}
                </div>
                <div className="card-footer">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="p-3 border border-dashed rounded">
                                <div className="fs-12 text-muted mb-1">Total Paid</div>
                                <h6 className="fw-bold text-dark">${totalRevenue.toLocaleString()}</h6>
                                <div className="progress mt-2 ht-3">
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="p-3 border border-dashed rounded">
                                <div className="fs-12 text-muted mb-1">Pending</div>
                                <h6 className="fw-bold text-dark">${pendingRevenue.toLocaleString()}</h6>
                                <div className="progress mt-2 ht-3">
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="p-3 border border-dashed rounded">
                                <div className="fs-12 text-muted mb-1">Unpaid</div>
                                <h6 className="fw-bold text-dark">${unpaidRevenue.toLocaleString()}</h6>
                                <div className="progress mt-2 ht-3">
                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RevenueChart

