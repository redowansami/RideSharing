import React from 'react';

const WaitingForDriver = ({ ride, setVehicleFound, setWaitingForDriver, waitingForDriver }) => {
  // Fallback values for when ride or captain is undefined
  const captainName = ride?.captain?.fullname?.firstname
    ? `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname || ''}`
    : 'Waiting for a captain...';
  const vehiclePlate = ride?.captain?.vehicle?.plate || 'N/A';
  const vehicleType = ride?.captain?.vehicle?.vehicleType || 'N/A';
 
  const otp = ride?.otp || 'N/A';
  const pickup = ride?.pickup || 'N/A';
  const destination = ride?.destination || 'N/A';
  const fare = ride?.fare || 'N/A';

  const handleCancel = () => {
    setVehicleFound(false);
    setWaitingForDriver(false);
  };

  return (
    <div className="relative">
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={handleCancel}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between p-4">
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Vehicle"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">{captainName}</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">{vehiclePlate}</h4>
          <p className="text-sm text-gray-600">{vehicleType}</p>
          <h1 className="text-lg font-semibold">{otp}</h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center p-4">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>
      
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>
        
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">৳{fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;