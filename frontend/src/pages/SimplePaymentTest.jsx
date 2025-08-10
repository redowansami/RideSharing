import React, { useState } from 'react';
import axios from 'axios';

const SimplePaymentTest = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

    const testPayment = async () => {
        try {
            setLoading(true);
            setMessage('Creating test payment...');

            // Call the test endpoint (no auth required)
            const response = await axios.post(`${baseURL}/payments/test-payment`);
            
            if (response.data.success) {
                setMessage('✅ Payment API is working! Integration successful.');
                
                // If Razorpay is available, test the payment flow
                if (window.Razorpay) {
                    const options = {
                        key: response.data.key,
                        amount: response.data.amount,
                        currency: response.data.currency,
                        name: response.data.name,
                        description: response.data.description,
                        order_id: response.data.order.id,
                        prefill: response.data.prefill,
                        theme: {
                            color: '#10b981'
                        },
                        handler: function (paymentResponse) {
                            setMessage('✅ Payment completed successfully! ID: ' + paymentResponse.razorpay_payment_id);
                        },
                        modal: {
                            ondismiss: function() {
                                setMessage('❌ Payment cancelled by user');
                            }
                        }
                    };

                    const razorpayInstance = new window.Razorpay(options);
                    razorpayInstance.open();
                } else {
                    setMessage('⚠️ Razorpay script not loaded. Check your internet connection.');
                }
            }
        } catch (error) {
            console.error('Payment test error:', error);
            setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Simple Payment Test</h1>
                
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Test Details:</h3>
                    <p>• No login required</p>
                    <p>• Tests basic payment integration</p>
                    <p>• Uses test Razorpay credentials</p>
                    <p>• Amount: ৳150</p>
                </div>

                <button
                    onClick={testPayment}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {loading ? 'Testing...' : 'Test Payment Gateway'}
                </button>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg ${
                        message.includes('✅') 
                            ? 'bg-green-100 text-green-800' 
                            : message.includes('❌') 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-sm text-gray-600">
                    <h4 className="font-semibold mb-2">Test Card Numbers:</h4>
                    <p>• Success: 4111 1111 1111 1111</p>
                    <p>• Failure: 4000 0000 0000 0002</p>
                    <p>• Use any future date for expiry</p>
                    <p>• Use any 3-digit CVV</p>
                </div>

                <div className="mt-4 text-center">
                    <a href="/payment-test" className="text-blue-600 underline text-sm">
                        Go to Advanced Payment Test (requires login)
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SimplePaymentTest;
