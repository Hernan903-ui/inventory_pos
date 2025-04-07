// Cargar datos para los reportes
async function loadReportsData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        // Cargar ventas por producto
        const salesByProductResponse = await fetch('/api/reports/sales-by-product', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!salesByProductResponse.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const salesByProductData = await salesByProductResponse.json();
        
        // Cargar stock actual
        const stockResponse = await fetch('/api/reports/stock', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!stockResponse.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const stockData = await stockResponse.json();
        
        // Cargar productos más vendidos
        const topProductsResponse = await fetch('/api/reports/top-products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!topProductsResponse.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const topProductsData = await topProductsResponse.json();
        
        // Actualizar tabla de productos más vendidos
        const topProductsTable = document.getElementById('topProductsTable').getElementsByTagName('tbody')[0];
        topProductsTable.innerHTML = '';
        
        topProductsData.forEach(product => {
            const row = topProductsTable.insertRow();
            row.insertCell(0).textContent = product.name;
            row.insertCell(1).textContent = product.total_sold;
            row.insertCell(2).textContent = `$${product.total_revenue.toFixed(2)}`;
        });
        
        // Cargar gráficos
        loadSalesByProductChart(salesByProductData);
        loadStockChart(stockData);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos de reportes');
    }
}

// Cargar gráfico de ventas por producto
function loadSalesByProductChart(data) {
    const ctx = document.getElementById('salesByProductChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: 'Ventas',
                data: data.map(item => item.total_sold),
                backgroundColor: 'rgba(78, 115, 223, 0.5)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Cargar gráfico de stock
function loadStockChart(data) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: 'Stock',
                data: data.map(item => item.stock),
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
        }
    });
}

// Generar PDF
document.getElementById('generatePdfBtn').addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');
        const reportType = document.getElementById('reportType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        const response = await fetch('/api/reports/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type: reportType, start_date: startDate, end_date: endDate })
        });
        
        if (!response.ok) {
            throw new Error('Error al generar PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar PDF');
    }
});

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadReportsData();
});