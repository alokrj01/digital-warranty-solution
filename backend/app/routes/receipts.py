from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.product import Product
from app.utils.dependencies import get_current_user
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import shutil
import os
import uuid
from pathlib import Path
from app.services.ocr_service import extract_text
from app.services.parser_service import extract_data
from datetime import datetime
from dateutil.relativedelta import relativedelta
import logging

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/receipts", tags=["Receipts"])

@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...),
                         warranty_months: int = 12,
                         db: Session = Depends(get_db),
                         current_user = Depends(get_current_user)
                         ):
    os.makedirs("uploads", exist_ok=True)
    # Sanitize filename to prevent path traversal
    safe_filename = Path(file.filename).name if file.filename else "unknown"
    unique_filename = f"{uuid.uuid4()}_{safe_filename}"
    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    logger.debug("File saved: %s", file_path)


    # OCR call
    extracted_text = extract_text(file_path)
    
    #parsing
    parsed_data = extract_data(extracted_text)

    logger.debug("OCR text preview: %s", extracted_text[:100] if extracted_text else "")

    #expiry calculation
    expiry_date = None

    try:
      purchase_dt = datetime.strptime(parsed_data["date"], "%Y-%m-%d")
      expiry_dt = purchase_dt + relativedelta(months=warranty_months)
      expiry_date = expiry_dt.strftime("%Y-%m-%d")
      logger.debug("Expiry calculated: %s", expiry_date)
    except Exception as e:
      logger.warning("Failed to calculate expiry date: %s", e)
      expiry_date = None

    # Parsing required fields
    product_name = parsed_data.get("product")
    purchase_date = parsed_data.get("date")
    amount = parsed_data.get("amount")

    if not product_name or not purchase_date:
     raise HTTPException(
        status_code=422,
        detail="Could not extract required fields from receipt. Please upload a clearer image."
    )

    # Save to DB
    new_product = Product(
        name=product_name,
        purchase_date=purchase_date,
        amount=amount,
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