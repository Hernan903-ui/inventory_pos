// Cargar datos del dashboard
// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        const response = await fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const data = await response.json();
        
        // Actualizar estadísticas
        document.getElementById('totalProducts').textContent = data.totalProducts;
        document.getElementById('totalSales').textContent = data.totalSales;
        document.getElementById('lowStock').textContent = data.lowStock;
        document.getElementById('totalSuppliers').textContent = data.totalSuppliers;
        
        // Actualizar tabla de ventas recientes
        const salesTable = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTable.innerHTML = '';
        
        data.recentSales.forEach(sale => {
            const row = salesTable.insertRow();
            row.insertCell(0).textContent = new Date(sale.date).toLocaleDateString();
            row.insertCell(1).textContent = sale.product_name;
            row.insertCell(2).textContent = sale.quantity;
            row.insertCell(3).textContent = `$${sale.price.toFixed(2)}`;
        });
        
        // Actualizar tabla de productos con stock bajo
        const lowStockTable = document.getElementById('lowStockTable').getElementsByTagName('tbody')[0];
        lowStockTable.innerHTML = '';
        
        data.lowStockProducts.forEach(product => {
            const row = lowStockTable.insertRow();
            row.insertCell(0).textContent = product.name;
            row.insertCell(1).textContent = product.barcode;
            row.insertCell(2).textContent = product.stock;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos del dashboard');
    }
}

// Cargar gráficos
async function loadCharts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        // Obtener datos para los gráficos
        const [salesByProductResponse, stockResponse, topProductsResponse] = await Promise.all([
            fetch('/api/reports/sales-by-product', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('/api/reports/stock', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('/api/reports/top-products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        ]);
        
        if (!salesByProductResponse.ok || !stockResponse.ok || !topProductsResponse.ok) {
            throw new Error('Error al cargar datos para los gráficos');
        }
        
        const salesByProductData = await salesByProductResponse.json();
        const stockData = await stockResponse.json();
        const topProductsData = await topProductsResponse.json();
        
        // Cargar gráfico de ventas por producto
        loadSalesByProductChart(salesByProductData);
        
        // Cargar gráfico de stock actual
        loadStockChart(stockData);
        
        // Cargar gráfico de productos más vendidos
        loadTopProductsChart(topProductsData);
    } catch (error) {
        console.error('Error al cargar gráficos:', error);
        alert('Error al cargar gráficos');
    }
}

// Cargar gráfico de ventas por producto
function loadSalesByProductChart(data) {
    const ctx = document.getElementById('salesByProductChart').getContext('2d');
    
    // Procesar datos
    const productNames = data.map(item => item.name);
    const totalSold = data.map(item => item.total_sold);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Ventas',
                data: totalSold,
                backgroundColor: 'rgba(78, 115, 223, 0.5)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value;
                        }
                    }
                }
            }
        }
    });
}

// Cargar gráfico de stock actual
function loadStockChart(data) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Procesar datos
    const productNames = data.map(item => item.name);
    const stockValues = data.map(item => item.stock);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Stock',
                data: stockValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Cargar gráfico de productos más vendidos
function loadTopProductsChart(data) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    // Procesar datos
    const productNames = data.map(item => item.name);
    const totalSold = data.map(item => item.total_sold);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Ventas',
                data: totalSold,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadDashboardData();
    loadCharts();
});