from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Supplier(Base):
    __tablename__ = 'suppliers'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    contact_info = Column(String(255))
    business_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relaciones
    business = relationship('User', back_populates='suppliers')
    products = relationship('Product', back_populates='supplier')
    inventory_entries = relationship('Inventory', back_populates='supplier', foreign_keys='Inventory.supplier_id')
    
    def __init__(self, name, contact_info, business_id):
        self.name = name
        self.contact_info = contact_info
        self.business_id = business_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_info': self.contact_info,
            'business_id': self.business_id
        }