// eslint-disable-next-line no-unused-vars
import React from 'react'
import StudentPlansTable from '@/components/student-plans/StudentPlansTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const StudentPlansList = () => {
    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Student Plans Management</h4>
            </PageHeader>

            <div className='main-content'>
                <div className='row'>
                    <StudentPlansTable />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default StudentPlansList
