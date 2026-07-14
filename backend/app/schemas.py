from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime
import re

# --- User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 100:
            raise ValueError('Full name must be between 2 and 100 characters')
        if re.search(r'<[^>]*>', v):
            raise ValueError('Name cannot contain HTML tags')
        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 10:
            raise ValueError('Password must be at least 10 characters')
        return v

class RoleUpdate(BaseModel):
    role: str

    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        allowed = {'Admin', 'Operations', 'Farmer', 'Buyer', 'Exporter'}
        if v not in allowed:
            raise ValueError(f'Role must be one of: {", ".join(sorted(allowed))}')
        return v

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
