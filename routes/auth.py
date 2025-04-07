from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
import logging
from utils.logging import log_request

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
@log_request
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.verify_password(password):
        access_token = create_access_token(identity={
            'id': user.id,
            'business_id': user.id
        })
        return jsonify(access_token=access_token)
    
    return jsonify({"msg": "Credenciales incorrectas"}), 401

@bp.route('/register', methods=['POST'])
@log_request
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    business_name = data.get('business_name')
    
    if User.query.filter_by(business_name=business_name).first():
        return jsonify({"msg": "Nombre de negocio ya existe"}), 409
    
    hashed_password = User.hash_password(password)
    new_user = User(username, email, hashed_password, business_name)
    
    try:
        new_user.save()
        return jsonify({"msg": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        return jsonify({"msg": "Error al registrar usuario", "error": str(e)}), 500