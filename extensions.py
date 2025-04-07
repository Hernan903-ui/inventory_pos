# backend/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager  # ¡Corregido aquí!

# Inicializar extensiones
db = SQLAlchemy()
jwt = JWTManager()  # Usa JWTManager en lugar de JWT

def init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)  # Inicializa JWTManager
    
    # Crear tablas si no existen
    with app.app_context():
        db.create_all()