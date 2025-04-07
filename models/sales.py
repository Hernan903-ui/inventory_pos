from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime  # Añade esta línea

Base = declarative_base()

class Sale(Base):
    __tablename__ = 'sales'
    
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    business_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    customer_name = Column(String(100))
    payment_method = Column(String(50))
    
    # Relaciones
    product = relationship('Product', back_populates='sales')
    business = relationship('User', back_populates='sales')
    
    def __init__(self, product_id, quantity, price, business_id, customer_name=None, payment_method=None):
        self.product_id = product_id
        self.quantity = quantity
        self.price = price
        self.business_id = business_id
        self.customer_name = customer_name
        self.payment_method = payment_method
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': float(self.price),
            'date': self.date.isoformat(),
            'business_id': self.business_id,
            'customer_name': self.customer_name,
            'payment_method': self.payment_method,
            'product': self.product.to_dict() if self.product else None
        }