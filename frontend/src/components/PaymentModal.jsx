import React, { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';

const PaymentModal = ({ 
    ride, 
    isOpen, 
    onClose, 
    onPaymentSuccess, 
    token 
}) => {
    const { processPayment, paymentLoading, paymentError, setPaymentError } = usePayment();
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        if (paymentError) {
            const timer = setTimeout(() => {
                setPaymentError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [paymentError, setPaymentError]);

    const handlePayment = async () => {
        try {
            setPaymentStatus('processing');
            console.log('Starting payment with token:', token);
            
            const result = await processPayment(ride._id, token);
         
            setPaymentStatus('success');
            setTimeout(() => {
                onPaymentSuccess(result);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus('failed');
            
            // If it's a token error, show helpful message
            if (error.response?.data?.message?.includes('token') || 
                error.message?.includes('token')) {
                console.log('Token error detected, this might be a test payment');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Payment</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        disabled={paymentLoading}
                    >
                        ×
                    </button>
                </div>

                {/* Ride Details */}
                <div className="mb-6">
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <i className="ri-map-pin-fill text-green-600"></i>
                            <div>
                                <p className="text-sm text-gray-600">Pickup</p>
                                <p className="font-medium">{ride?.pickup}</p>
                            </div>
                        </div>
                       
                        <div className="flex items-center gap-3 mb-3">
                            <i className="ri-map-pin-2-fill text-red-600"></i>
                            <div>
                                <p className="text-sm text-gray-600">Destination</p>
                                <p className="font-medium">{ride?.destination}</p>
                            </div>
                        </div>
                      
                        <div className="flex items-center gap-3">
                            <i className="ri-currency-line text-blue-600"></i>
                            <div>
                                <p className="text-sm text-gray-600">Fare</p>
                                <p className="font-medium text-lg">৳{ride?.fare}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                {paymentStatus && (
                    <div className="mb-4">
                        {paymentStatus === 'processing' && (
                            <div className="flex items-center gap-2 text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span>Processing payment...</span>
                            </div>
                        )}
                        {paymentStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-600">
                                <i className="ri-check-circle-fill"></i>
                                <span>Payment successful!</span>
                            </div>
                        )}
                        {paymentStatus === 'failed' && (
                            <div className="flex items-center gap-2 text-red-600">
                                <i className="ri-error-warning-fill"></i>
                                <span>Payment failed. Please try again.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {paymentError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {paymentError}
                    </div>
                )}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={paymentLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors
                        ${(paymentLoading || paymentStatus === 'processing' || paymentStatus === 'success')
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                        }`}
                >
                    {paymentLoading || paymentStatus === 'processing' ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                        </div>
                    ) : paymentStatus === 'success' ? (
                        'Payment Successful!'
                    ) : (
                        `Pay ৳${ride?.fare}`
                    )}
                </button>

                {/* Payment Info */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <i className="ri-shield-check-line"></i>
                        <span>Secure payment powered by Razorpay</span>
                    </div>
                    <p>Your payment information is encrypted and secure</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
