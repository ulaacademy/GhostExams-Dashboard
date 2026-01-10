import React from 'react'
import PlansTable from '@/components/plans/PlansTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const PlansList = () => {
    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Plans Management</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <PlansTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PlansList
