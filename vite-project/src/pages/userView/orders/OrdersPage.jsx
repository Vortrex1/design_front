import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import OrderService from '../../../utils/services/OrderService';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await OrderService.getAllOrders();
      // Sort by created date descending
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'Оплачено';
      case 'pending':
        return 'Очікується';
      case 'processing':
        return 'В обробці';
      case 'failed':
        return 'Невдала';
      default:
        return status;
    }
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="container" mt={4} mb={4}>
      <Typography variant="h4" gutterBottom>
        Мої замовлення
      </Typography>

      {orders.length === 0 ? (
        <Alert severity="info">
          У вас поки немає замовлень
        </Alert>
      ) : (
        <Grid container spacing={3} mt={1}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h6">
                        Замовлення #{order.id.substring(0, 8)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(order.paymentStatus)}
                      color={getStatusColor(order.paymentStatus)}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Сума замовлення:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {order.totalAmount.toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Валюта:
                      </Typography>
                      <Typography variant="body1">
                        {order.currency.toUpperCase()}
                      </Typography>
                    </Grid>

                    {order.shippingAddress && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Адреса доставки:
                        </Typography>
                        <Typography variant="body1">
                          {order.shippingAddress}
                        </Typography>
                      </Grid>
                    )}

                    {order.customerEmail && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Email:
                        </Typography>
                        <Typography variant="body1">
                          {order.customerEmail}
                        </Typography>
                      </Grid>
                    )}

                    {order.customerPhone && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Телефон:
                        </Typography>
                        <Typography variant="body1">
                          {order.customerPhone}
                        </Typography>
                      </Grid>
                    )}

                    {order.paidAt && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Оплачено:
                        </Typography>
                        <Typography variant="body1" color="success.main">
                          {new Date(order.paidAt).toLocaleString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrdersPage;
