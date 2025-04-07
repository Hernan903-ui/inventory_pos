// Cargar historial de inventario
async function loadInventoryHistory() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        // Cargar proveedores para el filtro
        loadProductsForFilter();
        
        // Cargar historial
        const response = await fetch('/api/inventory/history', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar historial');
        }
        
        const history = await response.json();
        
        // Actualizar tabla de historial
        const historyTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        historyTable.innerHTML = '';
        
        history.forEach(entry => {
            const row = historyTable.insertRow();
            row.insertCell(0).textContent = new Date(entry.date).toLocaleDateString();
            row.insertCell(1).textContent = entry.product.name;
            row.insertCell(2).textContent = entry.product.barcode;
            row.insertCell(3).textContent = entry.quantity;
            row.insertCell(4).textContent = entry.type === 'entry' ? 'Entrada' : 'Salida';
            row.insertCell(5).textContent = entry.supplier ? entry.supplier.name : '-';
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar historial de inventario');
    }
}

// Cargar productos para el filtro
async function loadProductsForFilter() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const products = await response.json();
        
        const productSelect = document.getElementById('productFilter');
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Aplicar filtros
document.getElementById('filterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        const productId = document.getElementById('productFilter').value;
        const type = document.getElementById('typeFilter').value;
        const date = document.getElementById('dateFilter').value;
        
        const response = await fetch('/api/inventory/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId, type, date })
        });
        
        if (!response.ok) {
            throw new Error('Error al aplicar filtros');
        }
        
        const filteredHistory = await response.json();
        
        // Actualizar tabla de historial
        const historyTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        historyTable.innerHTML = '';
        
        filteredHistory.forEach(entry => {
            const row = historyTable.insertRow();
            row.insertCell(0).textContent = new Date(entry.date).toLocaleDateString();
            row.insertCell(1).textContent = entry.product.name;
            row.insertCell(2).textContent = entry.product.barcode;
            row.insertCell(3).textContent = entry.quantity;
            row.insertCell(4).textContent = entry.type === 'entry' ? 'Entrada' : 'Salida';
            row.insertCell(5).textContent = entry.supplier ? entry.supplier.name : '-';
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al aplicar filtros');
    }
});

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadInventoryHistory();
});