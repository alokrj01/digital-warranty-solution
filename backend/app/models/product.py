from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    purchase_date = Column(String)
    amount = Column(Numeric(10, 2))
    warranty_months = Column(Integer, default=12)
    expiry_date = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)