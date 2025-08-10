const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createPaymentOrder = async ({ amount, currency = 'BDT', receipt }) => {
    try {
        const options = {
            amount: amount * 100, // amount in paisa (multiply by 100 for taka)
            currency,
            receipt,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw new Error(`Payment order creation failed: ${error.message}`);
    }
};

module.exports.verifyPaymentSignature = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === razorpay_signature;
    } catch (error) {
        throw new Error(`Payment verification failed: ${error.message}`);
    }
};

module.exports.getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        throw new Error(`Failed to fetch payment details: ${error.message}`);
    }
};

module.exports.createRefund = async ({ paymentId, amount, notes = {} }) => {
    try {
        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount * 100, // amount in paisa
            notes
        });
        return refund;
    } catch (error) {
        throw new Error(`Refund creation failed: ${error.message}`);
    }
};
