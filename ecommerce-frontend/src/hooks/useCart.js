import { useLocalStorage } from './useLocalStorage';

export function useCart() {
    const [cart, setCart] = useLocalStorage('cart', []);
    const [orders, setOrders] = useLocalStorage('userOrders', []);

    const addToCart = (product, quantity = 1) => {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        let updatedCart = [...cart];

        if (existingIndex > -1) {
            updatedCart[existingIndex].quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }
        setCart(updatedCart);
    };

    const updateCartQuantity = (id, quantity) => {
        const updated = cart.map(item => item.id === id ? { ...item, quantity } : item);
        setCart(updated);
    };

    const removeFromCart = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
    };

    const clearCart = () => setCart([]);

    return { cart, orders, addToCart, updateCartQuantity, removeFromCart, clearCart, setOrders };
}