import React, { useState, useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { usePayment } from '../context/PaymentContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import PaymentModal from '../components/PaymentModal'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)
    const { getPaymentStatus } = usePayment()
    const navigate = useNavigate()
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('pending')
    const [rideData, setRideData] = useState(ride)

    // Debug logs
    console.log('Riding component loaded');
    console.log('Ride data:', rideData);
    console.log('User data:', user);
    console.log('Payment status:', paymentStatus);

    useEffect(() => {
        if (ride?._id && user?.token) {
            checkPaymentStatus()
        }
    }, [ride, user])

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    const checkPaymentStatus = async () => {
        try {
            const status = await getPaymentStatus(ride._id, user.token)
            setPaymentStatus(status.paymentStatus || 'pending')
        } catch (error) {
            console.error('Failed to check payment status:', error)
        }
    }

    const handlePaymentClick = () => {
        if (paymentStatus === 'pending') {
            setIsPaymentModalOpen(true)
        }
    }

    const handlePaymentSuccess = (paymentResult) => {
        setPaymentStatus('completed')
        setRideData(prev => ({
            ...prev,
            paymentStatus: 'completed',
            paymentID: paymentResult.paymentId
        }))
    }

    const getPaymentButtonText = () => {
        console.log('Current payment status:', paymentStatus); // Debug log
        switch (paymentStatus) {
            case 'completed':
                return 'Payment Completed ✓'
            case 'failed':
                return 'Retry Payment'
            case 'pending':
            default:
                return 'Make a Payment'
        }
    }

    const getPaymentButtonClass = () => {
        switch (paymentStatus) {
            case 'completed':
                return 'w-full mt-5 bg-green-800 text-white font-semibold p-2 rounded-lg cursor-not-allowed'
            case 'failed':
                return 'w-full mt-5 bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700'
            case 'pending':
            default:
                return 'w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700'
        }
    }

    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                <LiveTracking />
            </div>
            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{rideData?.captain?.fullname?.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{rideData?.captain?.vehicle?.plate}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{rideData?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>৳{rideData?.fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>
                                    {paymentStatus === 'completed' ? 'Paid Online' : 'Payment Pending'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                    className={getPaymentButtonClass()}
                    onClick={handlePaymentClick}
                    disabled={paymentStatus === 'completed'}
                >
                    {getPaymentButtonText()}
                </button>

                {/* Payment Status Indicator */}
                {paymentStatus === 'completed' && (
                    <div className="mt-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                        <i className="ri-check-circle-fill mr-2"></i>
                        Payment completed successfully
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            <PaymentModal
                ride={rideData}
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                token={user?.token}
            />
        </div>
    )
}

export default Riding