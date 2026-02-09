import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const CartItemModal = ({ open, onClose, onGoToCart }) => {
  return (
    <Modal
      open={open}
      onClose={onClose} // Переконуємося, що onClose передається як пропс
      aria-labelledby="cart-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="cart-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Ви додали цей товар до кошика. Щоб редагувати кошик, натисніть "Перейти до кошика".
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={onGoToCart}>
            Перейти до кошика
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Закрити
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CartItemModal; 