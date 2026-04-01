from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes import auth, receipts
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(receipts.router)

@app.get("/")
def home():
    return {"message": "Warranty API running 🚀"}