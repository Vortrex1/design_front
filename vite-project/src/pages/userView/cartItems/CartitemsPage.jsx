import { Typography, Button } from "@mui/material";
import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "./components/CartItemCard";
import useActions from "../../../hooks/useActions";

const MemoizedTypography = memo(Typography);

const CartItemsPage = () => {
  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const userId = useSelector((state) => state.user.currentUser?.id);
  const { getCartItemsByUserId } = useActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      getCartItemsByUserId(userId);
    }
  }, [userId]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item?.quantity * item.product?.price,
    0
  );

  const handleCheckout = () => {
    navigate('/order-delivery');
  };

  return (
    <div className="container">
      {/* Вивід загальної ціни */}
      <div className="float-end d-flex gap-2">
        <MemoizedTypography variant="h6">Total price:</MemoizedTypography>
        <Typography variant="h6" sx={{ color: "red" }}>
          {totalPrice.toFixed(2)} ₴
        </Typography>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <MemoizedTypography variant="h4" gutterBottom>
          Your Cart
        </MemoizedTypography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>

      {/* Відображення товарів у кошику */}
      {cartItems.length > 0 ? (
        cartItems.map((item) => <CartItemCard cartItem={item} key={item.id} />)
      ) : (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty!
        </Typography>
      )}
    </div>
  );
};

export default CartItemsPage;

