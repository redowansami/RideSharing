from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, Token
from app.services.auth import AuthService
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate

router = APIRouter()

@router.post("/register", response_model=Token)
async def register_user(user: UserCreate, vehicle: Optional[VehicleCreate] = None, db: Session = Depends(get_db)):
    db_user = AuthService.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    created_user = AuthService.create_user(db, user)
    if user.role == "rider" and vehicle:
        db_vehicle = Vehicle(**vehicle.dict(), user_id=created_user.id)
        db.add(db_vehicle)
        db.commit()
    access_token = AuthService.create_access_token(data=created_user.email)
    return access_token

@router.post("/login", response_model=Token)
async def login_user(form_data: FormData = Depends(OAuth2PasswordRequestForm), db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = AuthService.create_access_token(data=user.email)
    return access_token
</xai>

#### 15. app/routes/rides.py

<xaiArtifact artifact_id="f5f203ac-c0d0-415f-9063-efe14d8e0fc1" artifact_version_id="da61be23-588f-4d37-8373-3724fe6e2b16" title="rides.py" contentType="text/python">
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.ride import RideCreate, RideRead, RideCancel
from app.schemas.user import UserSchema
from app.services.ride import RideService
from app.dependencies import get_current_ride_seeker, get_current_rider

router = APIRouter()

@router.post("/request", response_model=RideRead)
async def create_ride_request(ride: RideRequest, user: UserModel = Depends(get_current_ride_seeker), db: Session = Depends(get_db)):
    return RideService.create_ride(db, ride, user.id)

@router.get("/available", response_model=List[RideModel])
async def get_available_rides(user: UserModel = Depends(get_current_rider), db: Session = Depends(get_db)):
    return RideService.get_available_rides(db)

@router.post("/{ride_id}/accept", response_model=RideResponse)
async def accept_ride(ride_id: int, user: UserModel = Depends(get_current_rider), db: Session = Depends(get_db)):
    ride = RideService.accept_ride(db, ride_id, user.id)
    if not ride:
        raise HTTPException(status_code=400, detail="Ride not available or already accepted")
    return ride

@router.post("/{ride_id}/start", response_model=RideResponse)
async def start_ride(ride_id: int, user: UserModel = Depends(get_current_rider), db: int = Depends(get_db)):
    ride = RideService.start_ride(db, ride_id, user.id)
    if not ride:
        raise HTTPException(status_code=400, detail="Cannot start ride")
    return ride

@router.post("/{ride_id}/complete", response_model=RideResponse)
async def complete_ride(ride_id: int, user: UserModel = Depends(get_current_rider), db: Session = Depends(get_db)):
    ride = RideService.complete_ride(db, ride_id, user.id)
    return ride

@router.post("/{ride_id}/cancel", response_model=RideResponse)
async def cancel_ride(ride_id: int, cancel_data: RideCancelRequest, user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    ride = RideService.cancel_ride(db, ride_id, user.id, cancel_data.cancel_by, cancel_data.reason)
    return ride
</xai>

#### 16. app/routes/payments.py

<xai<payments artifact_id="o7q8r9s0-1t2a-3b4c-5d6e-7f8g9h0i1j2k" title="payment.py" contentType="text/python">
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment import PaymentCreate, PaymentOut
from app.services.payment import PaymentService
from app.dependencies import get_current_ride_seeker

router = APIRouter()

@router.post("/ride/{ride_id}", response_model=PaymentOut)
async def process_payment(ride_id: int, payment: PaymentCreate, user: User = Depends(get_current_ride_seeker), db: Session = Depends(get_db)):
    payment = PaymentService.process_payment(db, ride_id, user.id, payment)
    return payment