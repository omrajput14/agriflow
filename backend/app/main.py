from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import engine, get_db

# Create all database tables based on models
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriFlow API",
    description="Enterprise API for the AgriFlow Platform",
    version="1.0.0"
)

# Configure CORS so the React frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AgriFlow Enterprise API"}

# --- Farm Routes ---
@app.get("/api/farms", response_model=List[schemas.Farm])
def get_farms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    farms = db.query(models.Farm).offset(skip).limit(limit).all()
    return farms

@app.post("/api/farms", response_model=schemas.Farm)
def create_farm(farm: schemas.FarmCreate, db: Session = Depends(get_db)):
    db_farm = db.query(models.Farm).filter(models.Farm.id == farm.id).first()
    if db_farm:
        raise HTTPException(status_code=400, detail="Farm ID already registered")
    new_farm = models.Farm(**farm.model_dump())
    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)
    return new_farm

# --- Buyer Routes ---
@app.get("/api/buyers", response_model=List[schemas.Buyer])
def get_buyers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    buyers = db.query(models.Buyer).offset(skip).limit(limit).all()
    return buyers

@app.post("/api/buyers", response_model=schemas.Buyer)
def create_buyer(buyer: schemas.BuyerCreate, db: Session = Depends(get_db)):
    db_buyer = db.query(models.Buyer).filter(models.Buyer.id == buyer.id).first()
    if db_buyer:
        raise HTTPException(status_code=400, detail="Buyer ID already registered")
    new_buyer = models.Buyer(**buyer.model_dump())
    db.add(new_buyer)
    db.commit()
    db.refresh(new_buyer)
    return new_buyer

# --- Shipment Routes ---
@app.get("/api/shipments", response_model=List[schemas.Shipment])
def get_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shipments = db.query(models.Shipment).offset(skip).limit(limit).all()
    return shipments

@app.get("/api/shipments/{shipment_id}/telemetry", response_model=schemas.Shipment)
def get_shipment_telemetry(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@app.patch("/api/shipments/{shipment_id}/advance", response_model=schemas.Shipment)
def advance_shipment(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    if shipment.status == "Planned":
        shipment.status = "In Transit"
        import random
        shipment.internal_temp = round(random.uniform(1.8, 2.8), 1)
    elif shipment.status == "In Transit":
        shipment.status = "Delivered"
        
    db.commit()
    db.refresh(shipment)
    return shipment

@app.post("/api/shipments", response_model=schemas.Shipment)
def create_shipment(shipment: schemas.ShipmentCreate, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment.id).first()
    if db_shipment:
        raise HTTPException(status_code=400, detail="Shipment ID already exists")
    new_shipment = models.Shipment(**shipment.model_dump())
    db.add(new_shipment)
    db.commit()
    db.refresh(new_shipment)
    return new_shipment

# --- Harvest Lot Routes ---
@app.get("/api/harvest-lots", response_model=List[schemas.HarvestLot])
def get_harvest_lots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    lots = db.query(models.HarvestLot).offset(skip).limit(limit).all()
    return lots

@app.post("/api/harvest-lots", response_model=schemas.HarvestLot)
def create_harvest_lot(lot: schemas.HarvestLotCreate, db: Session = Depends(get_db)):
    db_lot = db.query(models.HarvestLot).filter(models.HarvestLot.id == lot.id).first()
    if db_lot:
        raise HTTPException(status_code=400, detail="Lot ID already exists")
    new_lot = models.HarvestLot(**lot.model_dump())
    db.add(new_lot)
    db.commit()
    db.refresh(new_lot)
    return new_lot
