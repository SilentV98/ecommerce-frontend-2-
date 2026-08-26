import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const backgroundColor = type === 'error' ? 'var(--danger)' : 'var(--success, #2e7d32)';

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: backgroundColor,
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1100,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            {message}
        </div>
    );
}