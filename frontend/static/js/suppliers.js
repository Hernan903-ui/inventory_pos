// Cargar lista de proveedores
async function loadSuppliers() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        const response = await fetch('/api/suppliers', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar proveedores');
        }
        
        const suppliers = await response.json();
        
        // Actualizar tabla de proveedores
        const suppliersTable = document.getElementById('suppliersTable').getElementsByTagName('tbody')[0];
        suppliersTable.innerHTML = '';
        
        suppliers.forEach(supplier => {
            const row = suppliersTable.insertRow();
            row.insertCell(0).textContent = supplier.name;
            row.insertCell(1).textContent = supplier.contact_info;
            
            // Cargar cantidad de productos del proveedor
            const productsCell = row.insertCell(2);
            loadSupplierProductsCount(supplier.id, productsCell);
            
            const actionsCell = row.insertCell(3);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary btn-sm';
            editButton.textContent = 'Editar';
            editButton.onclick = () => openEditSupplierModal(supplier.id);
            actionsCell.appendChild(editButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm ml-1';
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteSupplier(supplier.id);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar proveedores');
    }
}

// Cargar cantidad de productos de un proveedor
async function loadSupplierProductsCount(supplierId, cell) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/suppliers/${supplierId}/products-count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const count = await response.json();
        cell.textContent = count;
    } catch (error) {
        console.error('Error:', error);
        cell.textContent = '0';
    }
}

// Abrir modal para agregar/editar proveedor
function openAddSupplierModal() {
    document.getElementById('modalSupplierTitle').textContent = 'Agregar Proveedor';
    document.getElementById('supplierId').value = '';
    document.getElementById('supplierForm').reset();
    $('#supplierModal').modal('show');
}

async function openEditSupplierModal(supplierId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/suppliers/${supplierId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar proveedor');
        }
        
        const supplier = await response.json();
        
        document.getElementById('modalSupplierTitle').textContent = 'Editar Proveedor';
        document.getElementById('supplierId').value = supplier.id;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('contactInfo').value = supplier.contact_info;
        
        $('#supplierModal').modal('show');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar proveedor');
    }
}

// Guardar proveedor
document.getElementById('saveSupplier').addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');
        const supplierId = document.getElementById('supplierId').value;
        const name = document.getElementById('supplierName').value;
        const contactInfo = document.getElementById('contactInfo').value;
        
        if (!name || !contactInfo) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        const method = supplierId ? 'PUT' : 'POST';
        const url = supplierId ? `/api/suppliers/${supplierId}` : '/api/suppliers';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, contact_info: contactInfo })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar proveedor');
        }
        
        alert('Proveedor guardado exitosamente');
        $('#supplierModal').modal('hide');
        loadSuppliers();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar proveedor');
    }
});

// Eliminar proveedor
async function deleteSupplier(supplierId) {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/suppliers/${supplierId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar proveedor');
        }
        
        alert('Proveedor eliminado exitosamente');
        loadSuppliers();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar proveedor');
    }
}

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadSuppliers();
});