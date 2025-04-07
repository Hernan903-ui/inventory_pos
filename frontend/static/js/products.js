// Cargar lista de productos
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const products = await response.json();
        
        // Actualizar tabla de productos
        const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            const row = productsTable.insertRow();
            row.insertCell(0).textContent = product.barcode;
            row.insertCell(1).textContent = product.name;
            row.insertCell(2).textContent = product.supplier.name;
            row.insertCell(3).textContent = `$${product.cost_price.toFixed(2)}`;
            row.insertCell(4).textContent = `$${product.sale_price.toFixed(2)}`;
            row.insertCell(5).textContent = product.stock;
            row.insertCell(6).textContent = new Date(product.last_updated).toLocaleDateString();
            
            const actionsCell = row.insertCell(7);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary btn-sm';
            editButton.textContent = 'Editar';
            editButton.onclick = () => openEditProductModal(product.id);
            actionsCell.appendChild(editButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm ml-1';
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteProduct(product.id);
            actionsCell.appendChild(deleteButton);
        });
        
        // Cargar proveedores para el select
        loadSuppliers();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar productos');
    }
}

// Cargar proveedores
async function loadSuppliers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/suppliers', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar proveedores');
        }
        
        const suppliers = await response.json();
        
        const supplierSelect = document.getElementById('supplier');
        supplierSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
        
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Abrir modal para agregar/editar producto
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Producto';
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
    $('#productModal').modal('show');
}

async function openEditProductModal(productId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar producto');
        }
        
        const product = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id;
        document.getElementById('barcode').value = product.barcode;
        document.getElementById('productName').value = product.name;
        document.getElementById('costPrice').value = product.cost_price;
        document.getElementById('salePrice').value = product.sale_price;
        document.getElementById('supplier').value = product.supplier_id;
        
        $('#productModal').modal('show');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar producto');
    }
}

// Guardar producto
document.getElementById('saveProduct').addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');
        const productId = document.getElementById('productId').value;
        const barcode = document.getElementById('barcode').value;
        const name = document.getElementById('productName').value;
        const costPrice = parseFloat(document.getElementById('costPrice').value);
        const salePrice = parseFloat(document.getElementById('salePrice').value);
        const supplierId = document.getElementById('supplier').value;
        
        if (!barcode || !name || isNaN(costPrice) || isNaN(salePrice) || !supplierId) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `/api/products/${productId}` : '/api/products';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ barcode, name, cost_price: costPrice, sale_price: salePrice, supplier_id: supplierId })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar producto');
        }
        
        alert('Producto guardado exitosamente');
        $('#productModal').modal('hide');
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
});

// Eliminar producto
async function deleteProduct(productId) {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }
        
        alert('Producto eliminado exitosamente');
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar producto');
    }
}

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadProducts();
});