import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreeTokenController, brainTreePaymentController } from '../controllers/PaymentController.js';

const router = express.Router();

// Get Braintree token
router.get('/braintree/token', requireSignIn, braintreeTokenController);

// Process payment
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

export default router;
