import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => navigate('/cartItems')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Pay now'}
        </Button>
      </Box>

      {message && (
        <Box mt={2}>
          <Alert severity="error">{message}</Alert>
        </Box>
      )}
    </form>
  );
};

export default CheckoutForm;
