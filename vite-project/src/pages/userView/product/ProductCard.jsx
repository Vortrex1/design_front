import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import REMOTE_HOST_NAME from '../../../env/index';
import productNotFound from '../../../assets/images/productNotFound.png';
import useActions from '../../../hooks/useActions';
import { useSelector } from 'react-redux';
import StarRating from '../../../components/common/starRating/StarRating';

const API_URL_IMAGES_Product = REMOTE_HOST_NAME + 'images/productImages/';

const ProductCard = ({ product }) => {
  const { addProductToFavorites, removeProductFromFavorites } = useActions();
  const favoriteProducts = useSelector(state => state.user.favoriteProducts);
  const userId = useSelector(state => state.user.currentUser.id);

  const isFavorite = favoriteProducts?.some((fav) => fav.productId === product.id);

const toggleFavorite = async (e) => {
    e.preventDefault();
    const favorite = favoriteProducts.find(fav => fav.productId === product.id);
    if (isFavorite && favorite) {
        await removeProductFromFavorites(favorite.id);
    } else {
        await addProductToFavorites(userId, product.id);
    }
};


  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
      <Link to={`/product/detail/${product.id}`} className="text-decoration-none text-dark">
        <img
          src={product.photos?.[0] ? API_URL_IMAGES_Product + product.photos[0] : productNotFound}
          alt={product.name}
          className="card-img-top"
          style={{ aspectRatio: '4/3', objectFit: 'cover' }}
        />

        <button
          onClick={toggleFavorite}
          className="btn btn-light position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm"
        >
          <i className={`${isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart text-secondary'}`}></i>
        </button>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
          <p className="card-text text-muted flex-grow-1">{product.description}</p>

          {/* Рейтинг продукту */}
          <div className="product-rating mb-2">
            <StarRating rating={product.rating || 0} readOnly={true} compact={true} />
            <small className="text-muted ms-2">
              ({product.reviewsCount || 0})
            </small>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <h6 className="text-primary mb-0">
              {product.price} {product.currency === 1 ? 'USD' : product.currency === 2 ? 'EUR' : 'UAH'}
            </h6>
            <button className="btn btn-outline-primary btn-sm rounded-pill">Детальніше</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
