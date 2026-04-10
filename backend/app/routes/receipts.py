from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.product import Product
from app.utils.dependencies import get_current_user
from fastapi import APIRouter, UploadFile, File, Depends
import shutil
import os
from app.services.ocr_service import extract_text
from app.services.parser_service import extract_data
from datetime import datetime
from dateutil.relativedelta import relativedelta


router = APIRouter(prefix="/receipts", tags=["Receipts"])

@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...),
                         warranty_months: int = 12,
                         db: Session = Depends(get_db),
                         current_user = Depends(get_current_user)
                         ):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("FILE SAVED:", file_path)  # 🔥 DEBUG


    # OCR call
    extracted_text = extract_text(file_path)
    
    #parsing
    parsed_data = extract_data(extracted_text)

    print("OCR TEXT:", extracted_text[:100])  # 🔥 DEBUG

    #expiry calculation
    expiry_date = None

    try:
      print("DATE FROM PARSER:", parsed_data["date"])
      purchase_dt = datetime.strptime(parsed_data["date"], "%Y-%m-%d")
      print("PURCHASE DT:", purchase_dt)
      expiry_dt = purchase_dt + relativedelta(months=warranty_months)
      print("EXPIRY DT:", expiry_dt) 
      expiry_date = expiry_dt.strftime("%Y-%m-%d")
      print("EXPIRY CALCULATED:", expiry_date)
    except Exception as e:
      print("EXPIRY ERROR:", e)
      expiry_date = None

    # Save to DB
    new_product = Product(
        name=parsed_data["product"],
        purchase_date=parsed_data["date"],
        amount=parsed_data["amount"],
        warranty_months=warranty_months,
        expiry_date=expiry_date,
        user_id=current_user.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Saved successfully",
        "data": {
          "id": new_product.id,
          "name": new_product.name,
          "amount": new_product.amount,
          "purchase_date": new_product.purchase_date,
          "expiry_date": new_product.expiry_date,
          "warranty_months": new_product.warranty_months
        }
    }