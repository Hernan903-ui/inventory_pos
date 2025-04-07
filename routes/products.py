from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.product import Product
from models.supplier import Supplier
import logging
from utils.logging import log_request

bp = Blueprint('products', __name__)

@bp.route('', methods=['GET'])
@jwt_required()
@log_request
def get_products():
    try:
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({"msg": "Error al obtener productos", "error": str(e)}), 500

@bp.route('', methods=['POST'])
@jwt_required()
@log_request
def create_product():
    data = request.get_json()
    barcode = data.get('barcode')
    name = data.get('name')
    cost_price = data.get('cost_price')
    sale_price = data.get('sale_price')
    supplier_id = data.get('supplier_id')
    
    # Verificar si el código de barras ya existe
    if Product.query.filter_by(barcode=barcode).first():
        return jsonify({"msg": "Código de barras ya existe"}), 409
    
    try:
        new_product = Product(barcode, name, cost_price, sale_price, supplier_id, get_jwt_identity()['business_id'])
        new_product.save()
        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        return jsonify({"msg": "Error al crear producto", "error": str(e)}), 500

@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
@log_request
def update_product(id):
    data = request.get_json()
    product = Product.query.get(id)
    
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    
    try:
        product.barcode = data.get('barcode', product.barcode)
        product.name = data.get('name', product.name)
        product.cost_price = data.get('cost_price', product.cost_price)
        product.sale_price = data.get('sale_price', product.sale_price)
        product.supplier_id = data.get('supplier_id', product.supplier_id)
        product.save()
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({"msg": "Error al actualizar producto", "error": str(e)}), 500

@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@log_request
def delete_product(id):
    product = Product.query.get(id)
    
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    
    try:
        product.delete()
        return jsonify({"msg": "Producto eliminado exitosamente"})
    except Exception as e:
        return jsonify({"msg": "Error al eliminar producto", "error": str(e)}), 500

@bp.route('/search', methods=['GET'])
@jwt_required()
@log_request
def search_products():
    query = request.args.get('q')
    
    if not query:
        return jsonify({"msg": "Parámetro de búsqueda requerido"}), 400
    
    try:
        products = Product.query.filter(
            (Product.name.ilike(f'%{query}%')) | (Product.barcode.ilike(f'%{query}%'))
        ).all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({"msg": "Error al buscar productos", "error": str(e)}), 500