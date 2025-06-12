from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.models.ride import Ride, RideStatus
from app.schemas.payment import PaymentCreate
from fastapi import HTTPException
import stripe
from app.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    @staticmethod
    def process_payment(db: Session, ride_id: int, user_id: int, payment: PaymentCreate):
        ride = db.query(Ride).filter(Ride.id == ride_id).first()
        if not ride or ride.ride_seeker_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if ride.status != RideStatus.completed:
            raise HTTPException(status_code=400, detail="Ride not completed")
        
        # Mock Stripe payment processing
        try:
            # In production, create a Stripe PaymentIntent
            db_payment = Payment(
                ride_id=ride_id,
                amount=payment.amount,
                method=payment.method,
                status="succeeded"
            )
            db.add(db_payment)
            db.commit()
            db.refresh(db_payment)
            return db_payment
        except stripe.error.StripeError:
            raise HTTPException(status_code=400, detail="Payment failed")