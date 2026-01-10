import React from 'react'
// Removed template-specific customers components
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import UsersManagementTable from '@/components/users/UsersManagementTable'

const CustomersList = () => {
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

export default CustomersList