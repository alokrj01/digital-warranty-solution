from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter(prefix="/receipts", tags=["Receipts"])

@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded", "file": file.filename}