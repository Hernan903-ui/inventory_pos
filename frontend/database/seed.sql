-- Insertar usuario administrador
INSERT INTO users (username, email, password, business_name, role)
VALUES (
    'admin',
    'admin@example.com',
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGgaYl',
    'Tienda Principal',
    'admin'
);

-- Insertar proveedores de ejemplo
INSERT INTO suppliers (name, contact_info, business_id)
VALUES 
('Proveedor 1', 'contacto@proveedor1.com', 1),
('Proveedor 2', 'info@proveedor2.com', 1);

-- Insertar productos de ejemplo
INSERT INTO products (barcode, name, cost_price, sale_price, supplier_id, business_id)
VALUES 
('1234567890123', 'Producto 1', 10.00, 15.00, 1, 1),
('9876543210987', 'Producto 2', 20.00, 25.00, 2, 1);

-- Insertar historial de inventario
INSERT INTO inventory_history (product_id, quantity, type, business_id)
VALUES 
(1, 50, 'entry', 1),
(2, 30, 'entry', 1),
(1, 10, 'exit', 1);

-- Insertar ventas de ejemplo
INSERT INTO sales (product_id, quantity, price, business_id)
VALUES 
(1, 5, 15.00, 1),
(2, 3, 25.00, 1);