// src/pages/adminPages/products/AdminProductsPage.jsx
import React from "react";
import AdminProductsList from "./components/AdminProductsList.jsx";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import "../AdminPages.css";

const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <div className="admin-luxury-container">
        <div className="admin-luxury-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h1 className="admin-luxury-title">Продукти</h1>
            <div className="admin-luxury-header-actions">
              <Link to={`/admin/product/add`} className="admin-luxury-btn">
                <img
                  src="/Icons for functions/free-icon-plus-3303893.png"
                  alt="Create New"
                  height="20"
                />
                Додати продукт
              </Link>
            </div>
          </div>
        </div>
        <AdminProductsList />
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;