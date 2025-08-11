const paymentService = require('../services/payment.service');
const rideModel = require('../models/ride.model');
const { validationResult } = require('express-validator');

module.exports.createPaymentOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        
        // Find the ride
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if ride belongs to the authenticated user
        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to ride' });
        }

        // Check if ride is completed (commented out for testing)
        // if (ride.status !== 'completed') {
        //     return res.status(400).json({ message: 'Payment can only be made for completed rides' });
        // }

        // Check if payment already exists
        if (ride.paymentID) {
            return res.status(400).json({ message: 'Payment already made for this ride' });
        }

        // Create payment order
        const order = await paymentService.createPaymentOrder({
            amount: ride.fare,
            receipt: `ride_${rideId}`,
        });

        // Update ride with order ID
        ride.orderId = order.id;
        await ride.save();

        res.status(201).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            amount: ride.fare * 100, // amount in paisa (multiply by 100 for taka)
            currency: 'BDT',
            name: 'RideShare',
            description: `Payment for ride from ${ride.pickup} to ${ride.destination}`,
            prefill: {
                name: req.user.fullname.firstname + ' ' + req.user.fullname.lastname,
                email: req.user.email,
            }
        });
    } catch (error) {
        console.error('Payment order creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.verifyPayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Find the ride
        const ride = await rideModel.findById(rideId);
        if (!ride) 
        {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if ride belongs to the authenticated user
        if (ride.user.toString() !== req.user._id.toString()) 
        {
            return res.status(403).json({ message: 'Unauthorized access to ride' });
        }

        // Verify payment signature
        const isValidSignature = await paymentService.verifyPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        if (!isValidSignature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment signature' 
            });
        }

        // Update ride with payment details
        ride.paymentID = razorpay_payment_id;
        ride.signature = razorpay_signature;
        await ride.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.getPaymentStatus = async (req, res) => {
    try {
        const { rideId } = req.params;
        
        // Find the ride
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if ride belongs to the authenticated user
        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to ride' });
        }

        if (!ride.paymentID) {
            return res.status(200).json({
                success: false,
                message: 'Payment not made yet',
                paymentStatus: 'pending'
            });
        }

        // Get payment details from Razorpay
        const paymentDetails = await paymentService.getPaymentDetails(ride.paymentID);

        res.status(200).json({
            success: true,
            paymentStatus: paymentDetails.status,
            paymentMethod: paymentDetails.method,
            amount: paymentDetails.amount / 100, // convert from paisa to taka
            paymentId: ride.paymentID
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.refundPayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId, reason } = req.body;
        
        // Find the ride
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if ride belongs to the authenticated user
        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to ride' });
        }

        if (!ride.paymentID) {
            return res.status(400).json({ message: 'No payment found for this ride' });
        }

        // Create refund
        const refund = await paymentService.createRefund({
            paymentId: ride.paymentID,
            amount: ride.fare,
            notes: {
                reason: reason || 'Ride cancellation',
                rideId: rideId
            }
        });

        res.status(200).json({
            success: true,
            message: 'Refund initiated successfully',
            refundId: refund.id,
            amount: refund.amount / 100 // convert from paisa to taka
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ message: error.message });
    }
};
