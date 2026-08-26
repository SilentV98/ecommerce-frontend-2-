import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/design-system.css'
import App from './App.jsx'
import { initAuth } from './utils/auth'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

initAuth();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </StrictMode>,
)