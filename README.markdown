# RideSharing

## Overview
RideSharing is a web-based application designed to facilitate ride-sharing services, connecting drivers with passengers efficiently. This project aims to provide a seamless user experience for booking, managing, and tracking rides in real-time.

## Features
- **User Authentication**: Secure login and registration for drivers and passengers.
- **Ride Booking**: Users can search for available rides, select a driver, and book a trip.
- **Real-Time Tracking**: Track the driver's location and estimated arrival time.
- **Payment Integration**: Secure payment processing for completed rides.
- **Driver Management**: Drivers can manage their availability and ride requests.
- **Rating System**: Users can rate drivers and provide feedback after each ride.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript (React.js)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Google Maps API for location services, Stripe for payment processing
- **Authentication**: JWT (JSON Web Tokens)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/redowansami/RideSharing.git
   ```
2. Navigate to the project directory:
   ```bash
   cd RideSharing
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd client && npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```plaintext
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. Start the frontend development server:
   ```bash
   cd client && npm start
   ```

## Usage
- Open your browser and navigate to `http://localhost:3000` to access the frontend.
- Register as a passenger or driver to start using the platform.
- Drivers can set their availability and accept ride requests.
- Passengers can search for rides, book a trip, and track the driver in real-time.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please reach out to [redowansami](https://github.com/redowansami).