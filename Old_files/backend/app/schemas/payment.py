from pydantic import BaseModel
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float
    method: str

class PaymentCreate(PaymentBase):
    ride_id: int

class PaymentOut(PaymentBase):
    id: int
    ride_id: int
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True