from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_type = Column(String, nullable=False)
    plate_number = Column(String, nullable=False)
    license_url = Column(String, nullable=True)