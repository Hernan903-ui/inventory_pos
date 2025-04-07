from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    business_name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(Enum('admin', 'employee'), default='employee')
    
    # Relaciones
    products = relationship('Product', back_populates='business')
    suppliers = relationship('Supplier', back_populates='business')
    inventory_history = relationship('Inventory', back_populates='business')
    sales = relationship('Sale', back_populates='business')
    
    def __init__(self, username, email, password, business_name, role='employee'):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.business_name = business_name
        self.role = role
    
    def verify_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'business_name': self.business_name,
            'created_at': self.created_at.isoformat(),
            'role': self.role
        }