from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date

from app.models.product import Product
from app.utils.dependencies import get_current_user, get_db

router = APIRouter(prefix="/products", tags=["Products"])

def get_warranty_status(expiry_date_str):
    try:
        expiry = datetime.strptime(expiry_date_str, "%Y-%m-%d").date()
        days_left = (expiry - date.today()).days
        if days_left < 0:
            return "expired"
        elif days_left <= 30:
            return "expiring_soon"
        else:
            return "active"
    except:
        return "unknown"

@router.get("")
def get_products(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.user_id == current_user.id).all()
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "purchase_date": p.purchase_date,
            "amount": p.amount,
        })
    return {"products": result}