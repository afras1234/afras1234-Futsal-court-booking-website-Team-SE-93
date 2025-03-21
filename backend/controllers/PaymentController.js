import braintree from 'braintree';
import dotenv from 'dotenv';
import Booking from '../models/Bookings.js';

dotenv.config();

// Configure Braintree
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID || 'your_merchant_id',
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || 'your_public_key',
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || 'your_private_key',
});

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.status(200).send({
      ok: true,
      clientToken: response.clientToken,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send({
      ok: false,
      error: 'Could not generate payment token',
    });
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, cardDetails } = req.body;
    
    if (!cart || !cardDetails) {
      return res.status(400).json({
        ok: false,
        error: 'Missing cart or card details',
      });
    }

    // Create payment method from card details
    const paymentMethodResult = await gateway.paymentMethod.create({
      customerId: req.user.id,
      paymentMethodNonce: 'fake-valid-nonce', // In production, you'd get this from your frontend
      cardholderName: cardDetails.name,
      number: cardDetails.number,
      expirationDate: cardDetails.expiry,
      cvv: cardDetails.cvc,
      options: {
        verifyCard: true,
      },
    });

    if (!paymentMethodResult.success) {
      return res.status(400).json({
        ok: false,
        error: paymentMethodResult.message,
      });
    }

    // Calculate total amount
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // Process the transaction
    const result = await gateway.transaction.sale({
      amount: totalAmount.toString(),
      paymentMethodToken: paymentMethodResult.paymentMethod.token,
      options: {
        submitForSettlement: true,
      },
    });

    if (!result.success) {
      return res.status(400).json({
        ok: false,
        error: result.message,
      });
    }

    // Update booking records with payment information
    const updatePromises = cart.map(item => 
      Booking.findByIdAndUpdate(
        item._id,
        {
          isPaid: true,
          paymentId: result.transaction.id,
          paymentStatus: 'completed',
          paymentDate: new Date(),
        },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      ok: true,
      transactionId: result.transaction.id,
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to process payment',
    });
  }
};