import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import StudentSubscriptionsTable from "@/components/student-subscriptions/StudentSubscriptionsTable";

const StudentSubscriptionsList = () => {
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Student Subscriptions Management</h4>
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <StudentSubscriptionsTable />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentSubscriptionsList;
