import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Typography, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HttpClient from '../../../../utils/http/HttpClient';
import styles from './OrderPage.module.css';

const OrderPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const [branches, setBranches] = useState([]);
  const [postomats, setPostomats] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPostomat, setSelectedPostomat] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingPostomats, setLoadingPostomats] = useState(false);
  const [error, setError] = useState('');
  const [showBranches, setShowBranches] = useState(false);
  const [showPostomats, setShowPostomats] = useState(false);
  const navigate = useNavigate();

  // Create HttpClient instance for API calls
  const httpClient = new HttpClient({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL + 'api'
  });

  // Load branches when city filter changes
  useEffect(() => {
    if (cityFilter && cityFilter.length >= 2) {
      setLoadingBranches(true);
      // Don't clear selectedBranch here - let it be handled after data loads
      const normalizedCity = cityFilter.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      const params = new URLSearchParams();
      params.append('city', normalizedCity);
      params.append('limit', '300');

      console.log('Fetching branches for city:', normalizedCity);

      const url = `/Location/warehouses/branches?${params.toString()}`;
      console.log('Full branches URL:', url);
      httpClient.get(url)
        .then(response => {
          console.log('Branches response:', response);
          if (Array.isArray(response)) {
            setBranches(response);
            console.log('Branches streets:', response.map(b => ({ street: b.street, number: b.number })));
            console.log('Current selectedBranch before:', selectedBranch);
            // Only clear selection if current selection is not in the new data
            if (selectedBranch && !response.find(branch => branch.street === selectedBranch)) {
              console.log('Clearing selectedBranch because not found in new data');
              setSelectedBranch('');
            } else {
              console.log('Keeping selectedBranch:', selectedBranch);
            }
          } else {
            console.error('Invalid branches response format:', response);
            setBranches([]);
          }
          setError('');
        })
        .catch(error => {
          console.error('Error fetching branches:', error);
          setBranches([]);
          setError(`Помилка при завантаженні відділень: ${error.message}`);
        })
        .finally(() => {
          setLoadingBranches(false);
        });
    } else {
      setBranches([]);
      // Only clear if we're actually clearing the filter
      if (cityFilter === '') {
        setSelectedBranch('');
      }
    }
  }, [cityFilter]);

  // Load postomats when city filter changes
  useEffect(() => {
    if (cityFilter && cityFilter.length >= 2) {
      setLoadingPostomats(true);
      // Don't clear selectedPostomat here - let it be handled after data loads
      const normalizedCity = cityFilter.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      const params = new URLSearchParams();
      params.append('city', normalizedCity);
      params.append('limit', '300');

      console.log('Fetching postomats for city:', normalizedCity);

      const url = `/Location/warehouses/postomats?${params.toString()}`;
      console.log('Full postomats URL:', url);
      httpClient.get(url)
        .then(response => {
          console.log('Postomats response:', response);
          if (Array.isArray(response)) {
            setPostomats(response);
            // Only clear selection if current selection is not in the new data
            if (selectedPostomat && !response.find(postomat => postomat.street === selectedPostomat)) {
              setSelectedPostomat('');
            }
          } else {
            console.error('Invalid postomats response format:', response);
            setPostomats([]);
          }
        })
        .catch(error => {
          console.error('Error fetching postomats:', error);
          setPostomats([]);
        })
        .finally(() => {
          setLoadingPostomats(false);
        });
    } else {
      setPostomats([]);
      // Only clear if we're actually clearing the filter
      if (cityFilter === '') {
        setSelectedPostomat('');
      }
    }
  }, [cityFilter]);

  const handlePlaceOrder = async () => {
    try {
      // Визначаємо, яку локацію використовувати
      const selectedLocation = getSelectedLocation();

      if (!selectedLocation) {
        alert('Будь ласка, оберіть локацію доставки');
        return;
      }

      // Формуємо адресу доставки
      const shippingAddress = `${selectedLocation.type_of_warehouse ? 'Поштомат' : 'Відділення'} №${selectedLocation.number}, ${selectedLocation.city}, вул. ${selectedLocation.street}`;

      // Зберігаємо адресу в localStorage для передачі на CheckoutPage
      localStorage.setItem('shippingAddress', shippingAddress);

      // Переходимо на сторінку оплати
      navigate('/checkout');
    } catch (error) {
      console.error('Error preparing order:', error);
      alert('Помилка при підготовці замовлення');
    }
  };

  const handleLoadBranches = () => {
    setShowBranches(!showBranches);
    setShowPostomats(false);
  };

  const handleLoadPostomats = () => {
    setShowPostomats(!showPostomats);
    setShowBranches(false);
  };

  // Отримуємо вибрану локацію для відображення
  const getSelectedLocation = () => {
    if (selectedBranch && selectedBranch !== '') {
      return branches.find(branch => branch.street === selectedBranch);
    } else if (selectedPostomat && selectedPostomat !== '') {
      return postomats.find(postomat => postomat.street === selectedPostomat);
    }
    return null;
  };

  // Перевіряємо, чи обрана хоча б одна локація
  const isLocationSelected = selectedBranch || selectedPostomat;

  return (
    <div className="container mt-4">
      <Typography variant="h4" gutterBottom>Оформлення замовлення</Typography>

      {/* Секція даних користувача */}
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Контактні дані</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <div className={styles.userAvatar}>
            {currentUser?.photo ? (
              <img
                src={`${import.meta.env.VITE_REACT_APP_BASE_URL}images/userImages/${currentUser.photo}`}
                alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {currentUser?.firstName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              {currentUser?.lastName} {currentUser?.firstName} {currentUser?.middleName}
            </div>
            <div className={styles.userEmail}>{currentUser?.email}</div>
          </div>
        </Box>
      </Box>

      {/* Секція товарів */}
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Товари у замовленні</Typography>
        <List>
          {cartItems.map(item => (
            <ListItem key={item.id} className={styles.productItem}>
              <div className={styles.productAvatar}>
                {item.product?.mainImage ? (
                  <img
                    src={item.product.mainImage}
                    alt={item.product?.name}
                  />
                ) : (
                  <div className={styles.productAvatarPlaceholder}>
                    {item.product?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{item.product?.name}</div>
                <div className={styles.productDetails}>
                  Кількість: {item.quantity} × {item.product?.price?.toFixed(2)} грн
                </div>
              </div>
              <div className={styles.productPrice}>
                {(item.quantity * item.product?.price).toFixed(2)} грн
              </div>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Секція вибраної локації доставки */}
      {isLocationSelected && getSelectedLocation() && (
        <Box sx={{ mb: 4, p: 3, border: '2px solid #4caf50', borderRadius: 2, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
            ✅ Обрана адреса доставки
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Тип:</strong> {getSelectedLocation().type_of_warehouse ? 'Поштомат' : 'Відділення'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Номер:</strong> №{getSelectedLocation().number}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Місто:</strong> {getSelectedLocation().city}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Адреса:</strong> вул. {getSelectedLocation().street}
            </Typography>
            {getSelectedLocation().latitude && getSelectedLocation().longitude && (
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                <strong>Координати:</strong> {getSelectedLocation().latitude}, {getSelectedLocation().longitude}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Вибір локації доставки */}
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Адреса доставки</Typography>

        {/* Поле для введення міста */}
        <TextField
          fullWidth
          label="Введіть місто для фільтрації"
          variant="outlined"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Спробуйте: Дубно, Київ, Львів"
        />

        {/* Кнопки для вибору типу відділення */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant={showBranches ? "contained" : "outlined"}
            onClick={handleLoadBranches}
            disabled={!cityFilter || cityFilter.length < 2}
          >
            Показати відділення
          </Button>
          <Button
            variant={showPostomats ? "contained" : "outlined"}
            onClick={handleLoadPostomats}
            disabled={!cityFilter || cityFilter.length < 2}
          >
            Показати поштомати
          </Button>
        </Box>

        {/* Відділення */}
        {showBranches && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Відділення Нової Пошти</InputLabel>
            <Select
              value={selectedBranch}
              onChange={(e, child) => {
                const value = e.target.value;
                console.log('Selected branch value:', value, 'Child:', child);
                console.log('Available branches:', branches.map(b => ({ id: b.id, number: b.number })));
                setSelectedBranch(value);
              }}
              label="Відділення Нової Пошти"
              disabled={loadingBranches}
            >
              <MenuItem value="">
                <em>Оберіть відділення</em>
              </MenuItem>
              {branches.map(branch => (
                <MenuItem key={`branch-${branch.street}`} value={branch.street}>
                  №{branch.number} - {branch.city}, вул. {branch.street}
                </MenuItem>
              ))}
            </Select>
            {loadingBranches && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Завантаження відділень...
              </Typography>
            )}
            {!loadingBranches && branches.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Відділення не знайдені для міста "{cityFilter.trim()}"
              </Typography>
            )}
          </FormControl>
        )}

        {/* Поштомати */}
        {showPostomats && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Поштомат Нової Пошти</InputLabel>
            <Select
              value={selectedPostomat ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log('Selected postomat value:', value, 'Type:', typeof value);
                setSelectedPostomat(value);
              }}
              label="Поштомат Нової Пошти"
              disabled={loadingPostomats}
            >
              <MenuItem value="">
                <em>Оберіть поштомат</em>
              </MenuItem>
              {postomats.map(postomat => (
                <MenuItem key={`postomat-${postomat.street}`} value={postomat.street}>
                  №{postomat.number} - {postomat.city}, вул. {postomat.street}
                </MenuItem>
              ))}
            </Select>
            {loadingPostomats && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Завантаження поштоматів...
              </Typography>
            )}
            {!loadingPostomats && postomats.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Поштомати не знайдені для міста "{cityFilter.trim()}"
              </Typography>
            )}
          </FormControl>
        )}

        {/* Відображення вибраної локації під комбобоксами */}
        {isLocationSelected && getSelectedLocation() && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {getSelectedLocation().type_of_warehouse ? 'Поштомат' : 'Відділення'}: №{getSelectedLocation().number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getSelectedLocation().city}, вул. {getSelectedLocation().street}
            </Typography>
          </Box>
        )}

        {/* Інформація про помилки */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Інформація про завантаження */}
        {loadingBranches && (
          <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
            Завантаження відділень...
          </Typography>
        )}
        {loadingPostomats && (
          <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
            Завантаження поштоматів...
          </Typography>
        )}

        {/* Повідомлення про порожні списки */}
        {cityFilter && !loadingBranches && branches.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Відділення не знайдені для міста "{cityFilter.trim()}"
          </Typography>
        )}
        {cityFilter && !loadingPostomats && postomats.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Поштомати не знайдені для міста "{cityFilter.trim()}"
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handlePlaceOrder}
        disabled={!isLocationSelected}
      >
        Оформити замовлення
      </Button>
    </div>
  );
};

export default OrderPage;
