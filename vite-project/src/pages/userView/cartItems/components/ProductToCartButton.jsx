import React, { memo, useEffect, useState, useCallback } from 'react';
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import CartItemModal from '../cartItemsModals/CartItemModal';
import useActions from '../../../../hooks/useActions';

const ProductToCartButton = memo(({ productId }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const userId = useSelector((state) => state.user.currentUser?.id);
  const { createCartItem } = useActions();
  const navigate = useNavigate();

  // Перевіряємо, чи товар вже є в кошику
  useEffect(() => {
    if (cartItems && userId) {
      const isProductInCart = cartItems.some(
        (item) => item.productId === productId && item.userId === userId
      );
      setIsInCart(isProductInCart);
    }
  }, [cartItems, userId, productId]);

  // Функції для керування модальним вікном
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  // Додаємо товар до кошика
  const handleAddToCart = useCallback(() => {
    if (isInCart) {
      openModal();
    } else {
      const cartItem = { productId, userId, quantity: 1 };
      createCartItem(cartItem).then((response) => {
        if (response.success) {
          toast.success('Товар додано до кошика!');
          setIsInCart(true);
        } else {
          toast.error(response.message || 'Помилка при додаванні товару.');
        }
      });
    }
  }, [isInCart, productId, userId, createCartItem, openModal]);

  // Переходимо до кошика
  const handleGoToCart = useCallback(() => {
    closeModal();
    navigate('/cartItems');
  }, [closeModal, navigate]);

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="btn btn-primary w-100 rounded-pill px-4 py-2 mb-3 shadow-sm"
      >
        <span>Додати до кошика</span>
        {isInCart ? (
          <FaCheckCircle size={24} color="green" title="У кошику" />
        ) : (
          <FaShoppingCart size={24} color="gray" title="Додати до кошика" />
        )}
      </button>

      {/* Модальне вікно */}
      <CartItemModal
        open={showModal}
        onClose={closeModal}
        onGoToCart={handleGoToCart}
      />
    </div>
  );
});

export default ProductToCartButton;