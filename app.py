from flask import Flask
from flask_migrate import Migrate
from extensions import db, init_extensions  # Importa 'db' e 'init_extensions'
from routes import suppliers_bp, inventory_bp, sales_bp, auth_bp

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///inventory.db"
app.config["JWT_SECRET_KEY"] = "clave_secreta"

# Inicializa extensiones (BD, JWT, etc.)
init_extensions(app)

# Configura Flask-Migrate
migrate = Migrate(app, db)

# Registra blueprints
app.register_blueprint(suppliers_bp, url_prefix="/api")
app.register_blueprint(inventory_bp, url_prefix="/api")
app.register_blueprint(sales_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route("/")
def home():
    return "¡API funcionando! 🚀"

if __name__ == "__main__":
    app.run(debug=True)