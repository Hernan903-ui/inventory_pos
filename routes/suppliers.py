from flask import Blueprint, jsonify, request
from extensions import db
from models import Supplier  # Asegúrate de tener este modelo definido

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([s.to_dict() for s in suppliers])

@suppliers_bp.route('/suppliers', methods=['POST'])
def create_supplier():
    data = request.get_json()
    new_supplier = Supplier(
        name=data['name'],
        contact=data.get('contact', '')
    )
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify(new_supplier.to_dict()), 201