from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="Farmer") # Admin, Operations, Farmer, Buyer

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, index=True) # e.g., 'FRM-001'
    name = Column(String, index=True)
    owner = Column(String)
    location = Column(String)
    crop_type = Column(String)
    area_acres = Column(Float)
    expected_yield_tons = Column(Float)
    status = Column(String, default="Growing")
    
    # Relationships
    harvest_lots = relationship("HarvestLot", back_populates="farm")

class HarvestLot(Base):
    __tablename__ = "harvest_lots"

    id = Column(String, primary_key=True, index=True) # e.g., 'LOT-BAN-001'
    farm_id = Column(String, ForeignKey("farms.id"))
    weight_tons = Column(Float)
    quality_grade = Column(String, nullable=True) # e.g., 'Grade A'
    status = Column(String, default="Intake") # Intake, Quality, Packing, Storage
    logged_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    farm = relationship("Farm", back_populates="harvest_lots")

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(String, primary_key=True, index=True) # e.g., 'BYR-001'
    company_name = Column(String, index=True)
    country = Column(String)
    contact_name = Column(String)
    email = Column(String)
    ltv = Column(String) # Lifetime Value, e.g. '$1.2M'
    status = Column(String, default="Active")
    
    # Relationships
    shipments = relationship("Shipment", back_populates="buyer")

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True, index=True) # e.g., 'SHP-8924'
    buyer_id = Column(String, ForeignKey("buyers.id"))
    container_number = Column(String)
    status = Column(String, default="Planned") # Planned, In Transit, Delivered
    internal_temp = Column(Float, nullable=True) # Live telemetry
    eta = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    buyer = relationship("Buyer", back_populates="shipments")
