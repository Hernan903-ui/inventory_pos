from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Inventory(Base):
    __tablename__ = 'inventory_history'
    
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)  # Agregar índice
    quantity = Column(Integer, nullable=False)
    type = Column(Enum('entry', 'exit'), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))
    business_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)  # Agregar índice
    
    # Relaciones
    product = relationship('Product', back_populates='inventory_history')
    supplier = relationship('Supplier', back_populates='inventory_entries')
    business = relationship('User', back_populates='inventory_history')
    
    def __init__(self, product_id, quantity, type, supplier_id=None, business_id=None):
        self.product_id = product_id
        self.quantity = quantity
        self.type = type
        self.supplier_id = supplier_id
        self.business_id = business_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'type': self.type,
            'date': self.date.isoformat(),
            'supplier_id': self.supplier_id,
            'business_id': self.business_id,
            'product': self.product.to_dict() if self.product else None,
            'supplier': self.supplier.to_dict() if self.supplier else None
        }