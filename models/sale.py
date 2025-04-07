# backend/models/sale.py
from datetime import datetime
from extensions import db

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer)
    total = db.Column(db.Float)
    sale_date = db.Column(db.DateTime, default=datetime.utcnow)