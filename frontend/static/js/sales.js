// Variables globales
let currentSaleItems = [];
let scanner = null;
let isScanning = false;

// Iniciar escáner de códigos de barras
document.getElementById('startScannerBtn').addEventListener('click', async () => {
    try {
        const videoElement = document.getElementById('preview');
        scanner = new Instascan.Scanner({ video: videoElement });
        
        Instascan.Camera.getCameras().then(cameras => {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
                scanner.addListener('scan', handleScan);
                isScanning = true;
                document.getElementById('startScannerBtn').classList.add('d-none');
                document.getElementById('stopScannerBtn').classList.remove('d-none');
            } else {
                alert('No se encontró cámara');
            }
        }).catch(error => {
            console.error('Error al acceder a la cámara:', error);
            alert('Error al acceder a la cámara');
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar el escáner');
    }
});

// Detener escáner
document.getElementById('stopScannerBtn').addEventListener('click', () => {
    if (scanner) {
        scanner.stop();
        isScanning = false;
        document.getElementById('startScannerBtn').classList.remove('d-none');
        document.getElementById('stopScannerBtn').classList.add('d-none');
    }
});

// Manejar escaneo de código de barras
function handleScan(content) {
    if (!isScanning) return;
    
    // Buscar producto por código de barras
    searchProductByBarcode(content);
}

// Buscar producto por código de barras
async function searchProductByBarcode(barcode) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/search?barcode=${barcode}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al buscar producto');
        }
        
        const products = await response.json();
        
        if (products.length === 0) {
            alert('Producto no encontrado');
            return;
        }
        
        const product = products[0];
        addToSaleItems(product);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar producto');
    }
}

// Agregar producto a la venta
function addToSaleItems(product) {
    const existingItemIndex = currentSaleItems.findIndex(item => item.product_id === product.id);
    
    if (existingItemIndex !== -1) {
        currentSaleItems[existingItemIndex].quantity += 1;
        currentSaleItems[existingItemIndex].subtotal = product.sale_price * currentSaleItems[existingItemIndex].quantity;
    } else {
        currentSaleItems.push({
            product_id: product.id,
            name: product.name,
            barcode: product.barcode,
            price: product.sale_price,
            quantity: 1,
            subtotal: product.sale_price
        });
    }
    
    updateSaleItemsTable();
    updateTotalAmount();
}

// Actualizar tabla de productos en venta
function updateSaleItemsTable() {
    const table = document.getElementById('saleItemsTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    
    currentSaleItems.forEach((item, index) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.barcode;
        row.insertCell(2).textContent = `$${item.price.toFixed(2)}`;
        
        const quantityCell = row.insertCell(3);
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.onchange = () => {
            item.quantity = parseInt(quantityInput.value);
            item.subtotal = item.price * item.quantity;
            updateSaleItemsTable();
            updateTotalAmount();
        };
        quantityCell.appendChild(quantityInput);
        
        row.insertCell(4).textContent = `$${item.subtotal.toFixed(2)}`;
        
        const actionsCell = row.insertCell(5);
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Eliminar';
        removeButton.onclick = () => {
            currentSaleItems.splice(index, 1);
            updateSaleItemsTable();
            updateTotalAmount();
        };
        actionsCell.appendChild(removeButton);
    });
}

// Actualizar monto total
function updateTotalAmount() {
    const total = currentSaleItems.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById('totalAmount').value = `$${total.toFixed(2)}`;
}

// Buscar producto
document.getElementById('searchProduct').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 3) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/search?q=${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al buscar producto');
        }
        
        const products = await response.json();
        
        // Actualizar tabla de resultados
        const table = document.getElementById('searchResultsTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        
        products.forEach(product => {
            const row = table.insertRow();
            row.insertCell(0).textContent = product.name;
            row.insertCell(1).textContent = `$${product.sale_price.toFixed(2)}`;
            
            const actionsCell = row.insertCell(2);
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-primary btn-sm';
            addButton.textContent = 'Agregar';
            addButton.onclick = () => {
                addToSaleItems(product);
                document.getElementById('searchProduct').value = '';
            };
            actionsCell.appendChild(addButton);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

// Completar venta
document.getElementById('completeSaleBtn').addEventListener('click', async () => {
    if (currentSaleItems.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const customerName = document.getElementById('customerName').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        const saleData = {
            customer_name: customerName,
            payment_method: paymentMethod,
            items: currentSaleItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        };
        
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saleData)
        });
        
        if (!response.ok) {
            throw new Error('Error al completar venta');
        }
        
        alert('Venta completada exitosamente');
        currentSaleItems = [];
        updateSaleItemsTable();
        updateTotalAmount();
        document.getElementById('customerName').value = '';
        document.getElementById('paymentMethod').value = 'cash';
        
        if (isScanning) {
            scanner.stop();
            isScanning = false;
            document.getElementById('startScannerBtn').classList.remove('d-none');
            document.getElementById('stopScannerBtn').classList.add('d-none');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al completar venta');
    }
});

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    // Inicializar variables
    currentSaleItems = [];
    updateSaleItemsTable();
    updateTotalAmount();
});