import React from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import TeacherDetailView from '@/components/teachers/TeacherDetailView'

const TeacherView = () => {
    const { id } = useParams()

    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Teacher Details</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <TeacherDetailView teacherId={id} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default TeacherView

