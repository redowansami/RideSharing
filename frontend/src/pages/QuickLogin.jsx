import React, { useState, useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const QuickLogin = () => {
    const { updateUser, user, logoutUser } = useContext(UserDataContext);
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('Logging in...');

            const response = await axios.post(`${baseURL}/users/login`, {
                email,
                password
            });

            if (response.data.token) {
                updateUser(response.data.user, response.data.token);
                setMessage('✅ Login successful! You can now test payments.');
            } else {
                setMessage('❌ Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('❌ Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        setMessage('Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Quick Login for Testing</h1>
                
                {user.token ? (
                    <div>
                        <div className="mb-6 p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold mb-2 text-green-800">✅ Logged In</h3>
                            <p>Name: {user.fullname?.firstname} {user.fullname?.lastname}</p>
                            <p>Email: {user.email}</p>
                            <p className="text-sm text-gray-600">Token: {user.token?.substring(0, 20)}...</p>
                        </div>

                        <div className="space-y-3">
                            <a 
                                href="/payment-test" 
                                className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-green-700"
                            >
                                Go to Payment Test
                            </a>
                            
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                )}

                {message && (
                    <div className={`mt-4 p-3 rounded-lg ${
                        message.includes('✅') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-sm text-gray-600">
                    <p className="font-semibold mb-2">Test Credentials:</p>
                    <p>Email: test@example.com</p>
                    <p>Password: password123</p>
                    <p className="mt-2 text-xs">
                        (Create this user in your database or use existing credentials)
                    </p>
                </div>

                <div className="mt-4 text-center space-y-2">
                    <a href="/simple-payment-test" className="block text-blue-600 underline text-sm">
                        Simple Payment Test (No Login Required)
                    </a>
                    <a href="/signup" className="block text-blue-600 underline text-sm">
                        Create New Account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default QuickLogin;
