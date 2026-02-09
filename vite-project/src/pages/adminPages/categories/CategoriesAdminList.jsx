import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useActions from "../../../hooks/useActions";
import { useSelector } from "react-redux";
import CategoryAdminMapper from "./components/CategoryAdminMapper";
import AdminLayout from "../../../components/layout/AdminLayout";
import "../AdminPages.css";

const CategoriesAdminList = () => {
  const { getCategories } = useActions();
  const { categoryList } = useSelector((store) => store.category);
  const { categoryId } = useParams();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-luxury-container">
        <div className="admin-luxury-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h1 className="admin-luxury-title">Категорії</h1>
            <div className="admin-luxury-header-actions">
              <Link to="/admin/category/create" className="admin-luxury-btn">
                <img
                  src="/Icons for functions/free-icon-plus-3303893.png"
                  alt="Create New"
                  height="20"
                />
                Створити категорію
              </Link>
            </div>
          </div>
        </div>
        <div className="admin-luxury-table-container">
          <CategoryAdminMapper />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesAdminList;