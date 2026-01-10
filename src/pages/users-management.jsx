import React from 'react'
import UsersManagementTable from '@/components/users/UsersManagementTable'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

const UsersManagementPage = () => {
    return (
        <>
            <PageHeader>
                <h4 className="mb-0">Users Management</h4>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <UsersManagementTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UsersManagementPage


