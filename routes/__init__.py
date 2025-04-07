# backend/routes/__init__.py
from .suppliers import suppliers_bp
from .inventory import inventory_bp
from .sales import sales_bp
from .auth import auth_bp         
from .barcode import barcode_bp    
from .products import products_bp 
from .reports import reports_bp    

__all__ = [
    "suppliers_bp", 
    "inventory_bp", 
    "sales_bp", 
    "auth_bp", 
    "barcode_bp", 
    "products_bp", 
    "reports_bp"
]