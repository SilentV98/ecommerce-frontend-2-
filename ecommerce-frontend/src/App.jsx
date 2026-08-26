import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized'; // Added Unauthorized Page import
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>

                {/* Navbar appears globally on all pages */}
                <Navbar />

                {/* Main Content Router */}
                <div style={{ flex: 1 }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Checkout Route */}
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected User Profile Route */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Admin Dashboard Route (Admin Role Only) */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Unauthorized State Route */}
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* 404 Fallback Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                {/* Footer appears globally on general pages */}
                <Footer />

            </div>
        </Router>
    );
}

export default App;