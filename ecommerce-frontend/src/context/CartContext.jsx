import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useLocalStorage('cart', []);

    const addToCart = (product, quantity = 1) => {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        let updatedCart = [...cart];

        if (existingIndex > -1) {
            updatedCart[existingIndex] = {
                ...updatedCart[existingIndex],
                quantity: updatedCart[existingIndex].quantity + quantity
            };
        } else {
            updatedCart.push({ ...product, quantity });
        }
        setCart(updatedCart);
        window.dispatchEvent(new Event('storage'));
    };

    const updateQuantity = (id, newQty) => {
        const updated = cart.map(item => item.id === id ? { ...item, quantity: newQty } : item);
        setCart(updated);
        window.dispatchEvent(new Event('storage'));
    };

    const removeFromCart = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        window.dispatchEvent(new Event('storage'));
    };

    const clearCart = () => {
        setCart([]);
        window.dispatchEvent(new Event('storage'));
    };

    /* New function to handle stock adjustments and order delivery completion */
    const checkoutAndDeliverOrder = (updateStockCallback) => {
        if (updateStockCallback && typeof updateStockCallback === 'function') {
            // Pass current cart items to update inventory stock levels
            updateStockCallback(cart);
        }
        clearCart();
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, checkoutAndDeliverOrder }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    return useContext(CartContext);
}