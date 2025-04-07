import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sales from './pages/sales';
import Products from './pages/Products';
import Login from './pages/Login';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/products" element={<Products />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;