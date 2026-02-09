// src/components/layout/HeadersLinks.jsx
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HeadersLinks = () => {
    const user = useSelector((state) => state.user.currentUser);
    const userRoles = user ? (Array.isArray(user.role) ? user.role : [user.role]) : [];
    
    return (
        <div className="navbar-collapse">
            <Link className="navbar-brand d-flex align-items-center me-4" to="/">
                <img
                    src="/image-removebg-preview.png"
                    height="40"
                    alt="CoffeMaker Logo"
                    loading="lazy"
                    className="d-inline-block align-top"
                />
                <span className="ms-2 text-white fw-bold fs-4">CoffeMaker</span>
            </Link>
            <ul className="navbar-nav me-auto">
                { (userRoles.includes("Manager") || userRoles.includes("Administrator")) && (
                    <li className="nav-item">
                        <Link className="nav-link text-white px-3" to="/admin/products">
                            Адмін Панель
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default memo(HeadersLinks);