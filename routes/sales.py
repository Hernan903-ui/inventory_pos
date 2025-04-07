from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.sale import Sale
from models.product import Product

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/sales', methods=['POST'])
@jwt_required()
def create_sale():
    data = request.get_json()
    product = Product.query.get_or_404(data['product_id'])
    
    if product.stock < data['quantity']:
        return jsonify({"error": "Stock insuficiente"}), 400
    
    # Actualizar stock
    product.stock -= data['quantity']
    db.session.add(product)
    
    # Crear venta
    new_sale = Sale(
        product_id=data['product_id'],
        quantity=data['quantity'],
        total=data['quantity'] * product.price,
        user_id=get_jwt_identity()
    )
    db.session.add(new_sale)
    db.session.commit()
    
    return jsonify(new_sale.to_dict()), 201