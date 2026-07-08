from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str

# --- Farm Schemas ---
class FarmBase(BaseModel):
    name: str
    owner: str
    location: str
    crop_type: str
    area_acres: float
    expected_yield_tons: float
    status: str = "Growing"

class FarmCreate(FarmBase):
    id: str

class Farm(FarmBase):
    id: str
    class Config:
        from_attributes = True

# --- HarvestLot Schemas ---
class HarvestLotBase(BaseModel):
    farm_id: str
    weight_tons: float
    quality_grade: Optional[str] = None
    status: str = "Intake"

class HarvestLotCreate(HarvestLotBase):
    id: str

class HarvestLot(HarvestLotBase):
    id: str
    logged_at: datetime
    class Config:
        from_attributes = True

# --- Buyer Schemas ---
class BuyerBase(BaseModel):
    company_name: str
    country: str
    contact_name: str
    email: str
    ltv: str
    status: str = "Active"

class BuyerCreate(BuyerBase):
    id: str

class Buyer(BuyerBase):
    id: str
    class Config:
        from_attributes = True

# --- Shipment Schemas ---
class ShipmentBase(BaseModel):
    buyer_id: str
    container_number: str
    status: str = "Planned"
    internal_temp: Optional[float] = None
    eta: Optional[datetime] = None

class ShipmentCreate(ShipmentBase):
    id: str

class Shipment(ShipmentBase):
    id: str
    class Config:
        from_attributes = True
