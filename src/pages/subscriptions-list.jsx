import React from 'react'
import SubscriptionsTable from '@/components/subscriptions/SubscriptionsTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const SubscriptionsList = () => {
    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Subscriptions Management</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <SubscriptionsTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SubscriptionsList
