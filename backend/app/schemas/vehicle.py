from pydantic import BaseModel

class VehicleBase(BaseModel):
    vehicle_type: str
    plate_number: str
    license_url: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True