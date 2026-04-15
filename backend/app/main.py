from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes import auth, receipts
from app.routes import products
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(receipts.router)
app.include_router(products.router)

@app.get("/")
def home():
    return {"message": "Warranty API running 🚀"}