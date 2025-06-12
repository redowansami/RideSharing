from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.ride import Ride, RideStatus, CancellationBy
from app.schemas.ride import RideCreate, RideOut
from app.models.user import User
from fastapi import HTTPException
import requests
from app.config import settings

class RideService:
    @staticmethod
    def create_ride(db: Session, ride: RideCreate, ride_seeker_id: int):
        # Calculate fare (mocked with Google Maps Distance Matrix API)
        fare = RideService.calculate_fare(ride.pickup, ride.dropoff)
        db_ride = Ride(
            ride_seeker_id=ride_seeker_id,
            pickup=ride.pickup,
            dropoff=ride.dropoff,
            vehicle_type=ride.vehicle_type,
            fare=fare
        )
        db.add(db_ride)
        db.commit()
        db.refresh(db_ride)
        return db_ride

    @staticmethod
    def get_available_rides(db: Session):
        return db.query(Ride).filter(Ride.status == RideStatus.pending).all()

    @staticmethod
    def accept_ride(db: Session, ride_id: int, rider_id: int):
        ride = db.query(Ride).filter(Ride.id == ride_id).first()
        if not ride or ride.status != RideStatus.pending:
            return None
        ride.rider_id = rider_id
        ride.status = RideStatus.accepted
        db.commit()
        db.refresh(ride)
        return ride

    @staticmethod
    def start_ride(db: Session, ride_id: int, rider_id: int):
        ride = db.query(Ride).filter(and_(Ride.id == ride_id, Ride.rider_id == rider_id)).first()
        if not ride or ride.status != RideStatus.accepted:
            return None
        ride.status = RideStatus.on_trip
        db.commit()
        db.refresh(ride)
        return ride

    @staticmethod
    def complete_ride(db: Session, ride_id: int, rider_id: int):
        ride = db.query(Ride).filter(and_(Ride.id == ride_id, Ride.rider_id == rider_id)).first()
        if not ride or ride.status != RideStatus.on_trip:
            raise HTTPException(status_code=400, detail="Cannot complete ride")
        ride.status = RideStatus.completed
        db.commit()
        db.refresh(ride)
        return ride

    @staticmethod
    def cancel_ride(db: Session, ride_id: int, user_id: int, cancel_by: CancellationBy, reason: str):
        ride = db.query(Ride).filter(Ride.id == ride_id).first()
        if not ride:
            raise HTTPException(status_code=404, detail="Ride not found")
        
        # Validate cancellation permissions
        if cancel_by == CancellationBy.seeker and ride.ride_seeker_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to cancel as seeker")
        if cancel_by == CancellationBy.rider and (ride.rider_id != user_id or not ride.rider_id):
            raise HTTPException(status_code=403, detail="Not authorized to cancel as rider")
        
        # Check if ride can be cancelled
        if ride.status == RideStatus.completed:
            raise HTTPException(status_code=400, detail="Cannot cancel completed ride")
        
        ride.status = RideStatus.cancelled
        ride.cancellation_by = cancel_by
        ride.cancellation_reason = reason
        ride.cancellation_time = db.func.now()
        db.commit()
        db.refresh(ride)
        return ride

    @staticmethod
    def calculate_fare(pickup: str, dropoff: str):
        # Mock Google Maps Distance Matrix API call
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={pickup}&destinations={dropoff}&key={settings.GOOGLE_MAPS_API_KEY}"
        # For demo, return a fixed fare
        return 10.0  # Replace with actual API call in production