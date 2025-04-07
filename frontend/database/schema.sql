-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventory_pos;
USE inventory_pos;

-- Tabla de usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('admin', 'employee') DEFAULT 'employee'
);

-- Tabla de proveedores
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255),
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    barcode VARCHAR(13) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    supplier_id INT NOT NULL,
    business_id INT NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de historial de inventario
CREATE TABLE inventory_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    type ENUM('entry', 'exit') NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    business_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de ventas
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    business_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de alertas de stock bajo
CREATE TABLE low_stock_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    business_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
);