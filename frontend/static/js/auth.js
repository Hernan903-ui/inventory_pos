// Variables globales
let currentUser = null;

// Función para manejar el login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            currentUser = data.user;
            window.location.href = 'dashboard.html';
        } else {
            alert(data.msg || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
});

// Función para manejar el registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const businessName = document.getElementById('businessName').value;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, business_name: businessName })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registro exitoso. Por favor inicia sesión.');
            window.location.href = 'index.html';
        } else {
            alert(data.msg || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
});

// Función para cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    currentUser = null;
    window.location.href = 'index.html';
});

// Función para cargar el nombre del usuario
function loadUserName() {
    const token = localStorage.getItem('token');
    if (token) {
        // Aquí deberías validar el token y obtener el usuario
        // Por simplicidad, usaremos un nombre predeterminado
        document.getElementById('userName').textContent = 'Administrador';
    }
}

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    loadUserName();
});