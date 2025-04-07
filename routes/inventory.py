from flask import Blueprint, jsonify, request
from extensions import db
from models import Product  # Asegúrate de tener este modelo

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@inventory_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())