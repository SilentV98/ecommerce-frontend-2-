import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = localStorage.getItem(key);
                if (item) setStoredValue(JSON.parse(item));
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage-update', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-update', handleStorageChange);
        };
    }, [key]);

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new Event('local-storage-update'));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}