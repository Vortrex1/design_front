import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminSidebar = () => {
  return (
    <nav className={styles.sidebarWrapper}>
      {/* Хедер */}
      <div className={styles.sidebarHeader}>
        <i className={`fas fa-tachometer-alt ${styles.sidebarHeaderIcon}`}></i>
        <span className={styles.sidebarHeaderTitle}>Адмін Панель</span>
      </div>

      {/* Навігація */}
      <ul className={styles.sidebarNav}>
        <li className={styles.sidebarNavItem}>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${styles.sidebarNavLink} ${isActive ? styles.sidebarNavLinkActive : ''}`
            }
          >
            <i className="fas fa-box-archive"></i>
            <span>Продукти</span>
          </NavLink>
        </li>
        <li className={styles.sidebarNavItem}>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.sidebarNavLink} ${isActive ? styles.sidebarNavLinkActive : ''}`
            }
          >
            <i className="fas fa-users"></i>
            <span>Користувачі</span>
          </NavLink>
        </li>
        <li className={styles.sidebarNavItem}>
          <NavLink
            to="/admin/category"
            className={({ isActive }) =>
              `${styles.sidebarNavLink} ${isActive ? styles.sidebarNavLinkActive : ''}`
            }
          >
            <i className="fas fa-layer-group"></i>
            <span>Категорії</span>
          </NavLink>
        </li>
      </ul>

      {/* Футер */}
      <div className={styles.sidebarFooter}>
        <small className={styles.sidebarFooterText}>
          © 2025 CoffeMaker
        </small>
      </div>
    </nav>
  );
};

export default AdminSidebar;