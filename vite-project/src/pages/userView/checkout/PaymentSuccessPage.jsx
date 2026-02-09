import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OrderService from '../../../utils/services/OrderService';
import { useDispatch } from 'react-redux';
import { getCartItemsByUserId } from '../../../store/state/actions/cartItemActions';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      checkPaymentStatusAndFetchOrder();
    } else {
      setError('Order ID not found');
      setLoading(false);
      setCheckingStatus(false);
    }
  }, [orderId]);

  const checkPaymentStatusAndFetchOrder = async () => {
    try {
      // First check payment status (this will update backend if needed)
      await OrderService.checkPaymentStatus(orderId);
      
      // Wait a bit for backend to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then fetch updated order
      const orderData = await OrderService.getOrderById(orderId);
      setOrder(orderData);
      
      // Refresh cart to show items removed - get current user from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.id) {
            dispatch(getCartItemsByUserId(user.id));
          }
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
      setCheckingStatus(false);
    }
  };

  if (loading || checkingStatus) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="container" mt={4}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')} 
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box className="container" mt={4} mb={4}>
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        textAlign="center"
        maxWidth="600px"
        mx="auto"
        p={4}
      >
        <CheckCircleOutlineIcon 
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }} 
        />
        
        <Typography variant="h4" gutterBottom color="success.main">
          Payment Successful!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your purchase. Your order has been confirmed.
        </Typography>

        {order && (
          <Box mt={3} p={3} bgcolor="grey.100" borderRadius={2} width="100%">
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Typography variant="body2">
              Order ID: {order.id}
            </Typography>
            <Typography variant="body2">
              Amount: ₴{order.totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2">
              Status: {order.paymentStatus}
            </Typography>
            {order.paidAt && (
              <Typography variant="body2">
                Paid at: {new Date(order.paidAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}

        <Box mt={4} display="flex" gap={2}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentSuccessPage;
