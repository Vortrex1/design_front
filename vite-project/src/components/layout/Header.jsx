import React, { memo, use, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import HeadersLinks from "./HeadersLinks";
import useActions from "../../hooks/useActions";
import { useNavigate } from "react-router-dom";
import noImgUser from '../../assets/images/noImgUser.png';

import REMOTE_HOST_NAME from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'images/userImages/';

const Header = memo(() => {
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const logoutUser = useActions().logoutUser;
  const { getUser } = useActions();
  const navigate = useNavigate();
  const favoriteProducts = useSelector((state) => state.user.favoriteProducts);
  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const {user} = useSelector((store) => store.users);


  const logoutHandler = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (currentUser?.id) {
      getUser(currentUser.id);
    }
  }, [currentUser?.id]);

  const userId = currentUser?.id;
  const userCartItems = cartItems.filter((item) => item.userId === userId);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <HeadersLinks />
        
        <div className="d-flex align-items-center">
          {isAuthenticated && (
            <>
              <Link to="/favorites" className="nav-link position-relative mx-2">
                <Favorite className="text-white" style={{ fontSize: '1.5rem' }} />
                {favoriteProducts?.length > 0 && (
                  <Badge 
                    badgeContent={favoriteProducts.length} 
                    color="error"
                    className="position-absolute top-0 start-100 translate-middle"
                  />
                )}
              </Link>
              
              <Link to="/cartItems" className="nav-link position-relative mx-2">
                <ShoppingCart className="text-white" style={{ fontSize: '1.5rem' }} />
                {userCartItems?.length > 0 && (
                  <Badge 
                    badgeContent={userCartItems.length} 
                    color="error"
                    className="position-absolute top-0 start-100 translate-middle"
                  />
                )}
              </Link>
            </>
          )}
          
          {/* Профіль користувача */}
          {isAuthenticated && user ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img 
                  src={user.photo ? API_URL + user?.photo : noImgUser} 
                  alt="User" 
                  className="rounded-circle me-2" 
                  width="32" 
                  height="32"
                />
                <span className="d-none d-md-inline">{user?.email}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>Профіль
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/orders">
                    <i className="bi bi-box-seam me-2"></i>Мої замовлення
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logoutHandler}>
                    <i className="bi bi-box-arrow-right me-2"></i>Вийти
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="ms-3">
              <Link to="/login" className="btn btn-outline-light me-2">
                Увійти
              </Link>
              <Link to="/register" className="btn btn-primary">
                Зареєструватись
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Header;