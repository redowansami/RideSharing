import React, { createContext, useState, useEffect } from 'react'

// Create the context
const UserDataContext = createContext()

// Default user state
const defaultUserState = {
    email: '',
    fullname: {
        firstname: '',
        lastname: ''
    },
    token: null
}

const UserContext = ({ children }) => {
    const [user, setUser] = useState(defaultUserState)

    // Load user data from localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser({
                    ...parsedUser,
                    token: token
                });
                console.log('Loaded user from localStorage:', parsedUser);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    // Function to update user and persist to localStorage
    const updateUser = (userData, token) => {
        const userWithToken = {
            ...userData,
            token: token
        };
        
        setUser(userWithToken);
        
        // Persist to localStorage
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        
        console.log('User updated and persisted:', userWithToken);
    };

    // Function to logout user
    const logoutUser = () => {
        setUser(defaultUserState);
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        console.log('User logged out and localStorage cleared');
    };

    const contextValue = {
        user, 
        setUser, 
        updateUser, 
        logoutUser
    };

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    )
}

// Export context and provider separately to avoid Fast Refresh issues
export { UserDataContext }
export default UserContext