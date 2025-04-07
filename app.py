from flask import Flask
from flask_cors import CORS  # Importar CORS
from routes import auth, products, reports, barcode, suppliers, inventory, sales
from utils.logging import setup_logging
from utils.auth import init_jwt
from models.database import init_db

app = Flask(__name__)
app.config.from_object('config.Config')

# Inicializar JWT
jwt = init_jwt(app)

# Registrar rutas
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(products.bp, url_prefix='/api/products')
app.register_blueprint(reports.bp, url_prefix='/api/reports')
app.register_blueprint(barcode.bp, url_prefix='/api/barcode')
app.register_blueprint(suppliers.bp, url_prefix='/api/suppliers')
app.register_blueprint(inventory.bp, url_prefix='/api/inventory')
app.register_blueprint(sales.bp, url_prefix='/api/sales')

# Configurar CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configurar logging
setup_logging(app)

# Inicializar la base de datos
init_db(app.config['MYSQL_URI'])

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])