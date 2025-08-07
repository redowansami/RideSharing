from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class RideStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    on_trip = "on_trip"
    completed = "completed"
    cancelled = "cancelled"

class CancellationBy(str, Enum):
    seeker = "seeker"
    rider = "rider"
    system = "system"

class RideBase(BaseModel):
    pickup: str
    dropoff: str
    vehicle_type: str
    additional_note: Optional[str] = None

class RideCreate(RideBase):
    pass

class RideOut(RideBase):
    id: int
    ride_seeker_id: int
    rider_id: Optional[int]
    status: RideStatus
    fare: Optional[float]
    cancellation_by: Optional[CancellationBy]
    cancellation_reason: Optional[str]
    cancellation_time: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True

class RideCancel(BaseModel):
    cancel_by: CancellationBy
    reason: str