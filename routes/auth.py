from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El usuario ya existe"}), 409
    
    new_user = User(
        email=data['email'],
        password=generate_password_hash(data['password']),
        role='user'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Credenciales inválidas"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200