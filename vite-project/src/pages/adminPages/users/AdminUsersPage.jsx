import React from "react";
import AdminUsersTableContainer from "./components/AdminUsersTableContainer";
import AdminLayout from "../../../components/layout/AdminLayout";
import "../AdminPages.css";

const AdminUsersPage = () => {
  return (
    <AdminLayout>
      <div className="admin-luxury-container">
        <div className="admin-luxury-header">
          <h1 className="admin-luxury-title">Користувачі</h1>
        </div>
        <AdminUsersTableContainer />
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
