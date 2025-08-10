import React, { useState, useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { usePayment } from '../context/PaymentContext';
import PaymentModal from '../components/PaymentModal';

const PaymentTest = () => {
    const { user } = useContext(UserDataContext);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    // Mock ride data for testing
    const mockRide = {
        _id: '65a1234567890abcdef12345', // Mock ride ID
        pickup: 'Upper East Side',
        destination: 'Harlem',
        fare: 150,
        status: 'completed',
        paymentStatus: 'pending'
    };

    const handlePaymentSuccess = (paymentResult) => {
        console.log('Payment successful:', paymentResult);
        alert('Payment completed successfully!');
        setIsPaymentModalOpen(false);
    };

    const checkUserAuth = () => {
        const authInfo = {
            user: user,
            token: user?.token,
            tokenType: typeof user?.token,
            localStorage: localStorage.getItem('token'),
            localStorageUser: localStorage.getItem('user')
        };
        setDebugInfo(JSON.stringify(authInfo, null, 2));
        console.log('Auth Debug Info:', authInfo);
    };

    const handleTestPayment = () => {
        console.log('=== PAYMENT DEBUG INFO ===');
        console.log('User object:', user);
        console.log('User token:', user?.token);
        console.log('Token type:', typeof user?.token);
        console.log('Token length:', user?.token?.length);
        console.log('Token starts with:', user?.token?.substring(0, 20));
        
        if (!user) {
            alert('No user found! Please login first.');
            return;
        }
        
        if (!user.token) {
            alert('No token found! Please login again.');
            return;
        }
        
        console.log('Opening payment modal...');
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Payment Test Page</h1>
                
                <div className="mb-4">
                    <button 
                        onClick={checkUserAuth}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700"
                    >
                        Debug Auth Info
                    </button>
                    
                    {debugInfo && (
                        <pre className="bg-gray-100 p-2 text-xs overflow-auto max-h-32 mb-4">
                            {debugInfo}
                        </pre>
                    )}
                </div>

                {user ? (
                    <div>
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold mb-2">User Info:</h3>
                            <p>Name: {user.fullname?.firstname} {user.fullname?.lastname}</p>
                            <p>Email: {user.email}</p>
                            <p className="text-sm text-gray-600">Token: {user.token ? 'Present' : 'Missing'}</p>
                        </div>

                        <div className="mb-6 p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Mock Ride Details:</h3>
                            <p>From: {mockRide.pickup}</p>
                            <p>To: {mockRide.destination}</p>
                            <p>Fare: ৳{mockRide.fare}</p>
                            <p>Status: {mockRide.status}</p>
                        </div>

                        <button
                            onClick={handleTestPayment}
                            className={`w-full py-3 px-4 rounded-lg font-semibold ${
                                user.token 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            }`}
                            disabled={!user.token}
                        >
                            {user.token ? `Test Payment (৳${mockRide.fare})` : 'Token Missing - Cannot Pay'}
                        </button>

                        <div className="mt-4 text-sm text-gray-600 text-center">
                            <p>This is a test page to verify payment integration.</p>
                            <p>Use test card: 4111 1111 1111 1111</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Please login to test payments</p>
                        <a href="/login" className="text-blue-600 underline">Go to Login</a>
                    </div>
                )}

                <PaymentModal
                    ride={mockRide}
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                    token={user?.token}
                />
            </div>
        </div>
    );
};

export default PaymentTest;
