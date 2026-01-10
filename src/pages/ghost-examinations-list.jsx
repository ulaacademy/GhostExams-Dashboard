import React from 'react'
import GhostExaminationsTable from '@/components/ghost-examinations/GhostExaminationsTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const GhostExaminationsList = () => {
    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Ghost Examinations Management</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <GhostExaminationsTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default GhostExaminationsList

