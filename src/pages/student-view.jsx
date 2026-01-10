import React from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import StudentDetailView from '@/components/students/StudentDetailView'

const StudentView = () => {
    const { id } = useParams()

    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Student Details</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <StudentDetailView studentId={id} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StudentView

