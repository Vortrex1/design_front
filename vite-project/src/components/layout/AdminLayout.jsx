// src/components/layout/AdminLayout.jsx
import React from 'react';
import Header from './Header';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminPanel}>
      <div className="container-fluid py-4">
        <div className="row">
          <div className={`col-md-2 ${styles.sidebarWrapper} p-0`}>
            <AdminSidebar />
          </div>
          <div className={`col-md-10 ${styles.contentWrapper}`}> 
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;