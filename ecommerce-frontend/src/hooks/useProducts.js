import { useState, useEffect } from 'react';
import { initialProducts } from '../data/mockData';

export function useProducts() {
    // Force initialize if storage is empty or missing data using 'products' key
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        if (!saved || JSON.parse(saved).length === 0) {
            localStorage.setItem('products', JSON.stringify(initialProducts));
            return initialProducts;
        }
        return JSON.parse(saved);
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('products');
            if (saved) {
                setProducts(JSON.parse(saved));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage-update', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-update', handleStorageChange);
        };
    }, []);

    const saveAndBroadcast = (updatedProducts) => {
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('local-storage-update'));
    };

    const addProduct = (newProduct) => {
        const updated = [{ ...newProduct, id: Date.now().toString(), active: true }, ...products];
        saveAndBroadcast(updated);
    };

    const updateProduct = (id, updatedFields) => {
        const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
        saveAndBroadcast(updated);
    };

    const toggleProductStatus = (id) => {
        const updated = products.map(p => p.id === id ? { ...p, active: !p.active } : p);
        saveAndBroadcast(updated);
    };

    return { products, addProduct, updateProduct, toggleProductStatus };
}