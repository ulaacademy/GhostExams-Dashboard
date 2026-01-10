import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactApexChart from 'react-apexcharts'
import { fetchSubscriptionAnalytics, selectSubscriptionAnalytics, selectAnalyticsLoading } from '@/store/analyticsSlice'

const SubscriptionChart = () => {
    const dispatch = useDispatch()
    const subscriptions = useSelector(selectSubscriptionAnalytics)
    const loading = useSelector(selectAnalyticsLoading)

    useEffect(() => {
        dispatch(fetchSubscriptionAnalytics())
    }, [dispatch])

    const chartData = React.useMemo(() => {
        if (!subscriptions || !subscriptions.byStatus) {
            return {
                series: [],
                labels: []
            }
        }

        return {
            series: subscriptions.byStatus.map(item => item.count),
            labels: subscriptions.byStatus.map(item => {
                if (!item._id) return 'Unknown'
                return item._id.charAt(0).toUpperCase() + item._id.slice(1)
            })
        }
    }, [subscriptions])

    const chartOptions = {
        chart: {
            type: 'donut',
            height: 300
        },
        labels: chartData.labels,
        colors: ['#3454d1', '#10b759', '#ff6b6b', '#ffc107'],
        legend: {
            position: 'bottom',
            fontSize: '14px'
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600
                        }
                    }
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { height: 250 },
                legend: { position: 'bottom' }
            }
        }]
    }

    const totalSubscriptions = chartData.series.reduce((a, b) => a + b, 0)
    const expiringSoon = subscriptions?.expiringSoon || 0

    return (
        <div className="col-xxl-4 col-xl-6">
            <div className="card stretch stretch-full">
                <div className="card-header">
                    <h5 className="card-title">Subscriptions Status</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : chartData.series.length > 0 ? (
                        <ReactApexChart
                            options={chartOptions}
                            series={chartData.series}
                            type="donut"
                            height={300}
                        />
                    ) : (
                        <div className="text-center text-muted py-5">
                            <p>No subscription data available</p>
                        </div>
                    )}
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center p-3 border border-dashed rounded">
                            <div>
                                <div className="fs-12 text-muted">Total Subscriptions</div>
                                <h5 className="fw-bold mb-0">{totalSubscriptions}</h5>
                            </div>
                            <div className="text-end">
                                <div className="fs-12 text-muted">Expiring Soon</div>
                                <h5 className="fw-bold mb-0 text-warning">{expiringSoon}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionChart

