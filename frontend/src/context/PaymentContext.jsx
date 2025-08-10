import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const baseURL = import.meta.env.VITE_BASE_URL;

    const createPaymentOrder = async (rideId, token) => {
        try {
            setPaymentLoading(true);
            setPaymentError(null);
            
            // For testing purposes, use the test endpoint if no valid token
            const endpoint = token && token !== 'undefined' && token !== 'null' 
                ? `${baseURL}/payments/create-order`
                : `${baseURL}/payments/test-payment`;
            
            const requestData = token && token !== 'undefined' && token !== 'null'
                ? { rideId }
                : {}; // No data needed for test endpoint
            
            const headers = token && token !== 'undefined' && token !== 'null'
                ? {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                : {
                    'Content-Type': 'application/json'
                };
            
            const response = await axios.post(endpoint, requestData, { headers });
            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create payment order';
            setPaymentError(errorMessage);
            console.error('Payment order error:', error.response?.data || error.message);
            throw error;
        } finally {
            setPaymentLoading(false);
        }
    };

    const verifyPayment = async (paymentData, token) => {
        try {
            setPaymentLoading(true);
            setPaymentError(null);
            
            // For test payments, just return success
            if (!token || token === 'undefined' || token === 'null') {
                return {
                    success: true,
                    message: 'Test payment completed successfully',
                    paymentId: paymentData.razorpay_payment_id
                };
            }
            
            const response = await axios.post(
                `${baseURL}/payments/verify`,
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Payment verification failed';
            setPaymentError(errorMessage);
            console.error('Payment verification error:', error.response?.data || error.message);
            throw error;
        } finally {
            setPaymentLoading(false);
        }
    };

    const getPaymentStatus = async (rideId, token) => {
        try {
            const response = await axios.get(
                `${baseURL}/payments/status/${rideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Failed to get payment status:', error);
            throw error;
        }
    };

    const processPayment = async (rideId, token) => {
        try {
            // Create payment order
            const orderData = await createPaymentOrder(rideId, token);
            
            return new Promise((resolve, reject) => {
                const options = {
                    key: orderData.key,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: orderData.name,
                    description: orderData.description,
                    order_id: orderData.order.id,
                    prefill: orderData.prefill,
                    theme: {
                        color: '#10b981' // Green color matching your app theme
                    },
                    handler: async function (response) {
                        try {
                            // Verify payment on backend
                            const verificationData = {
                                rideId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            };
                            
                            const verificationResult = await verifyPayment(verificationData, token);
                            resolve(verificationResult);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            reject(new Error('Payment cancelled by user'));
                        }
                    }
                };

                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            });
        } catch (error) {
            throw error;
        }
    };

    const value = {
        paymentLoading,
        paymentError,
        setPaymentError,
        createPaymentOrder,
        verifyPayment,
        getPaymentStatus,
        processPayment
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};
