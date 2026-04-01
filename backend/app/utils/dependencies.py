from fastapi import Depends, HTTPException, Header
from jose import jwt
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    
    print("AUTH HEADER:", authorization)  # 🔥 DEBUG

    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("PAYLOAD:", payload)  # 🔥 DEBUG

        email = payload.get("sub")

    except Exception as e:
        print("JWT ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user