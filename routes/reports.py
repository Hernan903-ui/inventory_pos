from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.product import Product
from models.inventory import Inventory
from models.sales import Sale
from utils.pdf_generator import generate_pdf_report
import logging
from utils.logging import log_request

bp = Blueprint('reports', __name__)

@bp.route('/sales-by-product', methods=['GET'])
@jwt_required()
@log_request
def get_sales_by_product():
    try:
        sales_by_product = Sale.query.with_entities(
            Sale.product_id,
            Product.name,
            Product.sale_price,
            Sale.quantity
        ).join(Product).all()
        
        result = []
        for sale in sales_by_product:
            product_id, name, sale_price, quantity = sale
            product_data = next((item for item in result if item['product_id'] == product_id), None)
            
            if product_data:
                product_data['total_sold'] += quantity
                product_data['total_revenue'] += sale_price * quantity
            else:
                result.append({
                    'product_id': product_id,
                    'name': name,
                    'total_sold': quantity,
                    'total_revenue': sale_price * quantity
                })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"msg": "Error al obtener ventas por producto", "error": str(e)}), 500

@bp.route('/stock', methods=['GET'])
@jwt_required()
@log_request
def get_stock():
    try:
        products = Product.query.all()
        stock_data = []
        
        for product in products:
            # Calcular stock actual
            entries = Inventory.query.filter_by(
                product_id=product.id,
                type='entry'
            ).all()
            exits = Inventory.query.filter_by(
                product_id=product.id,
                type='exit'
            ).all()
            
            total_entries = sum(entry.quantity for entry in entries)
            total_exits = sum(exit.quantity for exit in exits)
            current_stock = total_entries - total_exits
            
            stock_data.append({
                'id': product.id,
                'name': product.name,
                'barcode': product.barcode,
                'stock': current_stock
            })
        
        return jsonify(stock_data)
    except Exception as e:
        return jsonify({"msg": "Error al obtener stock", "error": str(e)}), 500

@bp.route('/top-products', methods=['GET'])
@jwt_required()
@log_request
def get_top_products():
    try:
        sales = Sale.query.with_entities(
            Sale.product_id,
            Product.name,
            Product.sale_price,
            Sale.quantity
        ).join(Product).all()
        
        result = []
        for sale in sales:
            product_id, name, sale_price, quantity = sale
            product_data = next((item for item in result if item['product_id'] == product_id), None)
            
            if product_data:
                product_data['total_sold'] += quantity
                product_data['total_revenue'] += sale_price * quantity
            else:
                result.append({
                    'product_id': product_id,
                    'name': name,
                    'total_sold': quantity,
                    'total_revenue': sale_price * quantity
                })
        
        # Ordenar por ventas descendentes
        result.sort(key=lambda x: x['total_sold'], reverse=True)
        return jsonify(result[:5])  # Top 5 productos
    except Exception as e:
        return jsonify({"msg": "Error al obtener productos más vendidos", "error": str(e)}), 500

@bp.route('/generate-pdf', methods=['POST'])
@jwt_required()
@log_request
def generate_pdf():
    data = request.get_json()
    report_type = data.get('type')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    try:
        pdf_data = generate_pdf_report(report_type, start_date, end_date)
        return jsonify({"pdf_data": pdf_data})
    except Exception as e:
        return jsonify({"msg": "Error al generar PDF", "error": str(e)}), 500