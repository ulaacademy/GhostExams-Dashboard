import React from 'react'
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview'
import RevenueChart from '@/components/analytics/RevenueChart'
import SubscriptionChart from '@/components/analytics/SubscriptionChart'
import ExamAnalyticsChart from '@/components/analytics/ExamAnalyticsChart'
import UserGrowthChart from '@/components/analytics/UserGrowthChart'
import RecentActivities from '@/components/analytics/RecentActivities'

const Home = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    {/* Analytics Overview - Key Metrics */}
                    <AnalyticsOverview />
                    
                    {/* Revenue Analytics */}
                    <RevenueChart />
                    
                    {/* Subscription Status */}
                    <SubscriptionChart />
                    
                    {/* Exam Analytics */}
                    <ExamAnalyticsChart />
                    
                    {/* User Growth Chart */}
                    <UserGrowthChart />
                    
                    {/* Recent Activities */}
                    <RecentActivities />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home