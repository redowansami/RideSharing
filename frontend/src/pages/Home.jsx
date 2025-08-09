import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = React.useContext(SocketContext);
  const { user } = React.useContext(UserDataContext);

  const allowedAreas = ['Upper East Side', 'Harlem', 'Williamsburg', 'Bushwick'];

  useEffect(() => {
    socket.emit('join', { userType: 'user', userId: user._id });

    socket.on('ride-confirmed', (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on('ride-started', (ride) => {
      setWaitingForDriver(false);
      navigate('/riding', { state: { ride } });
    });

    return () => {
      socket.off('ride-confirmed');
      socket.off('ride-started');
    };
  }, [socket, user._id, navigate]);

  const findTrip = async () => {
    if (!pickup || !destination) {
      alert('Please select both pickup and destination');
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFare(response.data);
      setVehiclePanel(true);
    } catch (error) {
      console.error('Error fetching fare:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to fetch fare');
    }
  };

  const createRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        { userId: user._id, pickup, destination, vehicleType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setRide(response.data);
      setConfirmRidePanel(false);
      setVehicleFound(true);
    } catch (error) {
      console.error('Error creating ride:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to create ride');
    }
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: 'auto', duration: 0.3 });
    } else {
      gsap.to(panelRef.current, { height: 0, duration: 0.3 });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, { transform: 'translateY(0)', duration: 0.3 });
    } else {
      gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)', duration: 0.3 });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, { transform: 'translateY(0)', duration: 0.3 });
    } else {
      gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)', duration: 0.3 });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, { transform: 'translateY(0)', duration: 0.3 });
    } else {
      gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)', duration: 0.3 });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, { transform: 'translateY(0)', duration: 0.3 });
    } else {
      gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)', duration: 0.3 });
    }
  }, [waitingForDriver]);

  return (
    <div className='h-screen flex flex-col'>
      <div className='h-1/2 bg-[#eee]'>
        <img className='h-full w-full object-cover' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' alt='' />
      </div>
      <div className='h-1/2 p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold mb-3'>Where to?</h2>
          <div className='flex gap-4 mb-4'>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className='bg-[#eee] px-4 py-2 text-lg rounded-lg w-full'
            >
              <option value='' disabled>Select pickup location</option>
              {allowedAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='bg-[#eee] px-4 py-2 text-lg rounded-lg w-full'
            >
              <option value='' disabled>Select destination</option>
              {allowedAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={findTrip}
            className='bg-black text-white px-4 py-2 rounded-lg w-full'
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className='bg-white h-0'>
          <LocationSearchPanel
            suggestions={allowedAreas}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={null}
          />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;