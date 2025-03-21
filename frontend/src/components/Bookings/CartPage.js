import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cart';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [error, setError] = useState('');
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format expiry date (MM/YY)
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{2})/, '$1/$2')
        .replace(/(\d{2})(\d{1})/, '$1/$2');
    }

    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim();
    }

    // Format CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCard = () => {
    const errors = [];
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    const expiry = cardDetails.expiry;

    if (!cardNumber || cardNumber.length !== 16) {
      errors.push('Invalid card number');
    }

    if (!expiry || !expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.push('Invalid expiry date (MM/YY)');
    } else {
      const [month, year] = expiry.split('/');
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      if (expDate < today) {
        errors.push('Card has expired');
      }
    }

    if (!cardDetails.cvc || cardDetails.cvc.length !== 3) {
      errors.push('Invalid CVC');
    }

    if (!cardDetails.name) {
      errors.push('Cardholder name is required');
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
      return false;
    }

    setError('');
    return true;
  };

  const handlePayment = async () => {
    try {
      if (!validateCard()) {
        return;
      }

      setLoading(true);

      // Get the token first
      const tokenResponse = await axios.get('/api/v1/payment/braintree/token');
      const clientToken = tokenResponse.data?.clientToken;

      if (!clientToken) {
        throw new Error('Could not get payment token');
      }

      // Process the payment
      const { data } = await axios.post('/api/v1/payment/braintree/payment', {
        cart,
        cardDetails: {
          ...cardDetails,
          number: cardDetails.number.replace(/\s/g, ''),
        },
      });

      if (data?.ok) {
        // Clear cart
        setCart([]);
        localStorage.removeItem('cart');
        
        // Show success message
        toast.success('Payment successful! Redirecting to your bookings...');
        
        // Redirect to user bookings
        setTimeout(() => {
          navigate('/user');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Futsal Courts Price
      </Typography>
      
      {cart?.length === 0 ? (
        <Box 
          textAlign="center" 
          py={4} 
          sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            p: 4
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/futsalCourts')}
            sx={{ 
              mt: 2,
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)'
            }}
          >
            Browse Courts
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card 
                key={item._id} 
                sx={{ 
                  mb: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                    {item.courtName}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        📅 Date: {new Date(item.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        ⏰ Time: {item.timeSlot}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#1a237e' }}>
                        ${item.price}
                      </Typography>
                      <Button 
                        onClick={() => handleRemoveItem(item._id)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              position: 'sticky', 
              top: 20,
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                  Payment Details
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Card Number"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    sx={{ '& .MuiOutlinedInput-root': { background: 'white' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Card Holder Name"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleInputChange}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'white' } }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Expiry Date"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        sx={{ '& .MuiOutlinedInput-root': { background: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="CVC"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        sx={{ '& .MuiOutlinedInput-root': { background: 'white' } }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, mb: 2, p: 2, background: 'rgba(26, 35, 126, 0.05)', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                      Order Summary
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {cart.map((item) => (
                      <Box key={item._id} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          {item.courtName} ({item.timeSlot})
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1a237e' }}>
                          ${item.price}
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" sx={{ color: '#1a237e' }}>Total</Typography>
                      <Typography variant="h6" sx={{ color: '#1a237e' }}>${calculateTotal()}</Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading || cart.length === 0}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                      boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Pay $${calculateTotal()}`
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
