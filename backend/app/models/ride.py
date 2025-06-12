from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Float, TEXT
from sqlalchemy.sql import func
from app.database import Base
import enum

class RideStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    on_trip = "on_trip"
    completed = "completed"
    cancelled = "cancelled"

class CancellationBy(str, enum.Enum):
    seeker = "seeker"
    rider = "rider"
    system = "system"

class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    ride_seeker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pickup = Column(String, nullable=False)
    dropoff = Column(String, nullable=False)
    vehicle_type = Column(String, nullable=False)
    status = Column(Enum(RideStatus), default=RideStatus.pending)
    fare = Column(Float, nullable=True)
    cancellation_by = Column(Enum(CancellationBy), nullable=True)
    cancellation_reason = Column(TEXT, nullable=True)
    cancellation_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())