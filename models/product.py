from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    barcode = Column(String(13), nullable=False, unique=True, index=True)  # Agregar índice
    name = Column(String(100), nullable=False)
    cost_price = Column(Numeric(10, 2), nullable=False)
    sale_price = Column(Numeric(10, 2), nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    business_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)  # Agregar índice
    
    # Relaciones
    supplier = relationship('Supplier', back_populates='products')
    business = relationship('User', back_populates='products')
    inventory_history = relationship('Inventory', back_populates='product')
    sales = relationship('Sale', back_populates='product')
    
    def __init__(self, barcode, name, cost_price, sale_price, supplier_id, business_id):
        self.barcode = barcode
        self.name = name
        self.cost_price = cost_price
        self.sale_price = sale_price
        self.supplier_id = supplier_id
        self.business_id = business_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'barcode': self.barcode,
            'name': self.name,
            'cost_price': float(self.cost_price),
            'sale_price': float(self.sale_price),
            'last_updated': self.last_updated.isoformat(),
            'supplier_id': self.supplier_id,
            'business_id': self.business_id,
            'supplier': self.supplier.to_dict() if self.supplier else None
        }
    
    @property
    def stock(self):
        # Calcular stock actual
        entries = sum(entry.quantity for entry in self.inventory_history if entry.type == 'entry')
        exits = sum(exit.quantity for exit in self.inventory_history if exit.type == 'exit')
        return entries - exits