from fastapi import FastAPI
from app.routes import auth, rides, payments
from app.database import engine
from app.models import user, vehicle, ride, payment

app = FastAPI(title="Ride Sharing API")

# Create database tables
user.Base.metadata.create_all(bind=engine)
vehicle.Base.metadata.create_all(bind=engine)
ride.Base.metadata.create_all(bind=engine)
payment.Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(rides.router, prefix="/rides", tags=["rides"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])

@app.get("/")
async def root():
    return {"message": "Ride Sharing API is running"}