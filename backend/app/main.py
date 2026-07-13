from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import uuid
import time
import logging

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from . import models, schemas
from .database import engine, get_db
from .auth import authenticate_user, create_access_token, get_current_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES

logger = logging.getLogger(__name__)

# Roles that are allowed to perform write operations.
WRITE_ROLES = {"Admin", "Operations"}

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="AgriFlow API",
    description="Enterprise API for the AgriFlow Platform",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS so the React frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        # Production
        "https://agriflow-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https://agriflow-.*\.vercel\.app",
)

@app.on_event("startup")
def startup():
    # Retry DB connection — Render's free-tier DB may still be provisioning
    for attempt in range(5):
        try:
            models.Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully.")
            break
        except Exception as e:
            wait = 2 ** attempt  # 1, 2, 4, 8, 16 seconds
            logger.warning(f"DB connection attempt {attempt + 1}/5 failed: {e}. Retrying in {wait}s...")
            time.sleep(wait)
    else:
        logger.error("Could not connect to database after 5 attempts. Tables not created.")
        return

def require_write_role(current_user: models.User = Depends(get_current_user)) -> models.User:
    """RBAC: only Admin/Operations can mutate data."""
    if current_user.role not in WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{current_user.role}' is not allowed to modify data.",
        )
    return current_user

@app.get("/")
@limiter.limit("100/minute")
def read_root(request: Request):
    return {"message": "Welcome to the AgriFlow Enterprise API"}

@app.post("/api/auth/login")
@limiter.limit("5/minute")
def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "role": user.role, "full_name": user.full_name}}

@app.post("/api/auth/register")
@limiter.limit("5/minute")
def register_user(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    import uuid
    new_user_id = f"USR-{str(uuid.uuid4())[:8].upper()}"
    new_user = models.User(
        id=new_user_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        hashed_password=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.get("/api/auth/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "role": current_user.role, "full_name": current_user.full_name}

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    current_password: str | None = None
    new_password: str | None = None

@app.patch("/api/auth/update-profile")
def update_profile(request: Request, update: ProfileUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if update.full_name:
        current_user.full_name = update.full_name
    if update.email:
        existing = db.query(models.User).filter(models.User.email == update.email, models.User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = update.email
    if update.new_password:
        if not update.current_password:
            raise HTTPException(status_code=400, detail="Current password required to set new password")
        from .auth import verify_password
        if not verify_password(update.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        current_user.hashed_password = get_password_hash(update.new_password)
    db.commit()
    db.refresh(current_user)
    return {"id": current_user.id, "email": current_user.email, "role": current_user.role, "full_name": current_user.full_name}

# --- Farm Routes ---
@app.get("/api/farms", response_model=List[schemas.Farm])
def get_farms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    farms = db.query(models.Farm).offset(skip).limit(limit).all()
    return farms

@app.post("/api/farms", response_model=schemas.Farm)
def create_farm(farm: schemas.FarmCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_farm = db.query(models.Farm).filter(models.Farm.id == farm.id).first()
    if db_farm:
        raise HTTPException(status_code=400, detail="Farm ID already registered")
    new_farm = models.Farm(**farm.model_dump())
    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)
    return new_farm

@app.put("/api/farms/{farm_id}", response_model=schemas.Farm)
def update_farm(farm_id: str, farm: schemas.FarmBase, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_farm = db.query(models.Farm).filter(models.Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    for key, value in farm.model_dump().items():
        setattr(db_farm, key, value)
    db.commit()
    db.refresh(db_farm)
    return db_farm

@app.delete("/api/farms/{farm_id}")
def delete_farm(farm_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_farm = db.query(models.Farm).filter(models.Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    db.delete(db_farm)
    db.commit()
    return {"message": f"Farm {farm_id} deleted"}

# --- Buyer Routes ---
@app.get("/api/buyers", response_model=List[schemas.Buyer])
def get_buyers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    buyers = db.query(models.Buyer).offset(skip).limit(limit).all()
    return buyers

@app.post("/api/buyers", response_model=schemas.Buyer)
def create_buyer(buyer: schemas.BuyerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_buyer = db.query(models.Buyer).filter(models.Buyer.id == buyer.id).first()
    if db_buyer:
        raise HTTPException(status_code=400, detail="Buyer ID already registered")
    new_buyer = models.Buyer(**buyer.model_dump())
    db.add(new_buyer)
    db.commit()
    db.refresh(new_buyer)
    return new_buyer

@app.put("/api/buyers/{buyer_id}", response_model=schemas.Buyer)
def update_buyer(buyer_id: str, buyer: schemas.BuyerBase, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_buyer = db.query(models.Buyer).filter(models.Buyer.id == buyer_id).first()
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    for key, value in buyer.model_dump().items():
        setattr(db_buyer, key, value)
    db.commit()
    db.refresh(db_buyer)
    return db_buyer

@app.delete("/api/buyers/{buyer_id}")
def delete_buyer(buyer_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_buyer = db.query(models.Buyer).filter(models.Buyer.id == buyer_id).first()
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    db.delete(db_buyer)
    db.commit()
    return {"message": f"Buyer {buyer_id} deleted"}

# --- Shipment Routes ---
@app.get("/api/shipments", response_model=List[schemas.Shipment])
def get_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    shipments = db.query(models.Shipment).offset(skip).limit(limit).all()
    return shipments

@app.get("/api/shipments/{shipment_id}/telemetry", response_model=schemas.Shipment)
def get_shipment_telemetry(shipment_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@app.patch("/api/shipments/{shipment_id}/advance", response_model=schemas.Shipment)
def advance_shipment(shipment_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
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
def create_shipment(shipment: schemas.ShipmentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment.id).first()
    if db_shipment:
        raise HTTPException(status_code=400, detail="Shipment ID already exists")
    new_shipment = models.Shipment(**shipment.model_dump())
    db.add(new_shipment)
    db.commit()
    db.refresh(new_shipment)
    return new_shipment

@app.delete("/api/shipments/{shipment_id}")
def delete_shipment(shipment_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    db.delete(shipment)
    db.commit()
    return {"message": f"Shipment {shipment_id} deleted"}

# --- Harvest Lot Routes ---
@app.get("/api/harvest-lots", response_model=List[schemas.HarvestLot])
def get_harvest_lots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lots = db.query(models.HarvestLot).offset(skip).limit(limit).all()
    return lots

@app.post("/api/harvest-lots", response_model=schemas.HarvestLot)
def create_harvest_lot(lot: schemas.HarvestLotCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_lot = db.query(models.HarvestLot).filter(models.HarvestLot.id == lot.id).first()
    if db_lot:
        raise HTTPException(status_code=400, detail="Lot ID already exists")
    new_lot = models.HarvestLot(**lot.model_dump())
    db.add(new_lot)
    db.commit()
    db.refresh(new_lot)
    return new_lot

@app.put("/api/harvest-lots/{lot_id}", response_model=schemas.HarvestLot)
def update_harvest_lot(lot_id: str, lot: schemas.HarvestLotBase, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_lot = db.query(models.HarvestLot).filter(models.HarvestLot.id == lot_id).first()
    if not db_lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    for key, value in lot.model_dump().items():
        setattr(db_lot, key, value)
    db.commit()
    db.refresh(db_lot)
    return db_lot

@app.delete("/api/harvest-lots/{lot_id}")
def delete_harvest_lot(lot_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_lot = db.query(models.HarvestLot).filter(models.HarvestLot.id == lot_id).first()
    if not db_lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    db.delete(db_lot)
    db.commit()
    return {"message": f"Lot {lot_id} deleted"}

from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: str

@app.patch("/api/harvest-lots/{lot_id}/status", response_model=schemas.HarvestLot)
def update_harvest_lot_status(lot_id: str, status_update: StatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(require_write_role)):
    db_lot = db.query(models.HarvestLot).filter(models.HarvestLot.id == lot_id).first()
    if not db_lot:
        raise HTTPException(status_code=404, detail="Lot not found")

    db_lot.status = status_update.status
    db.commit()
    db.refresh(db_lot)
    return db_lot
