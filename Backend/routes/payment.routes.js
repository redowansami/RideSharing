const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Test endpoint without authentication
router.post('/test-payment', async (req, res) => {
    try {
        // Mock payment order for testing
        const mockOrder = {
            id: 'order_' + Date.now(),
            amount: 15000, // 150 taka in paisa
            currency: 'BDT',
            status: 'created'
        };

        res.status(200).json({
            success: true,
            order: mockOrder,
            key: process.env.RAZORPAY_KEY_ID || 'test_key',
            amount: 15000,
            currency: 'BDT',
            name: 'RideShare Test',
            description: 'Test payment for ride-sharing app',
            prefill: {
                name: 'Test User',
                email: 'test@example.com',
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create payment order for a ride
router.post('/create-order',
    authMiddleware.authUser,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required')
    ],
    paymentController.createPaymentOrder
);

// Verify payment after successful payment
router.post('/verify',
    authMiddleware.authUser,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
        body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
        body('razorpay_signature').notEmpty().withMessage('Signature is required')
    ],
    paymentController.verifyPayment
);

// Get payment status for a ride
router.get('/status/:rideId',
    authMiddleware.authUser,
    paymentController.getPaymentStatus
);

// Refund payment (in case of ride cancellation)
router.post('/refund',
    authMiddleware.authUser,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('reason').optional().isString().withMessage('Reason must be a string')
    ],
    paymentController.refundPayment
);

module.exports = router;
