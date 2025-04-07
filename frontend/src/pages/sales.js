import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Sales = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products').then(res => setProducts(res.data));
    }, []);

    const handleCheckout = async () => {
        try {
            await axios.post('/api/sales', { items: cart }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCart([]);
            alert("Venta registrada!");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div>
            <h1>Registrar Venta</h1>
            {/* Implementar interfaz de venta */}
        </div>
    );
};

export default Sales;