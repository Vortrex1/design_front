import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import OrderService from '../../../utils/services/OrderService';
import { useSelector } from 'react-redux';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const orderCreatedRef = React.useRef(false);
  
  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item?.quantity * item.product?.price,
    0
  );

  React.useEffect(() => {
    if (!orderCreatedRef.current) {
      orderCreatedRef.current = true;
      createOrder();
    }
  }, []);

  const createOrder = async () => {
    if (!currentUser) {
      setError('Please login to continue');
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate cart items have products with prices
    const invalidItems = cartItems.filter(item => !item.product || !item.product.price);
    if (invalidItems.length > 0) {
      setError('Some items in your cart are no longer available');
      return;
    }

    if (!currentUser.email) {
      setError('Email is required for checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get shipping address from localStorage (set by OrderPage) or use default
      const shippingAddress = localStorage.getItem('shippingAddress') || currentUser.address || 'No address provided';
      
      // Clear shipping address from localStorage after reading
      localStorage.removeItem('shippingAddress');

      const orderData = {
        userId: currentUser.id,
        cartItemIds: cartItems.map(item => item.id),
        shippingAddress: shippingAddress,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || '',
        currency: 'uah'
      };

      console.log('Creating order with data:', orderData);

      const order = await OrderService.createOrder(orderData);
      
      if (!order || !order.stripeClientSecret) {
        throw new Error('Invalid response from server - missing payment details');
      }

      console.log('Order created successfully:', order.id);
      
      setClientSecret(order.stripeClientSecret);
      setOrderId(order.id);
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err.response?.data?.title 
        || err.response?.data?.message 
        || err.message 
        || 'Failed to create order. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1976d2',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="container" mt={4}>
        <Alert severity="error" onClose={() => navigate('/cart')}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="container" mt={4} mb={4}>
      <Typography variant="h4" gutterBottom align="center">
        Complete Your Payment
      </Typography>
      
      <Box display="flex" justifyContent="center" mb={2}>
        <Typography variant="h6" color="primary">
          Total Amount: ₴{totalAmount.toFixed(2)}
        </Typography>
      </Box>

      {clientSecret && (
        <Box maxWidth="600px" mx="auto" mt={4}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutPage;
