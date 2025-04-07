from flask_jwt_extended import JWTManager, create_access_token, verify_jwt_in_request
from flask import request, jsonify
from functools import wraps

def init_jwt(app):
    jwt = JWTManager(app)
    return jwt

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        from models.user import User
        current_user_id = request.headers.get('X-User-ID')
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({"msg": "Acceso no autorizado"}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper