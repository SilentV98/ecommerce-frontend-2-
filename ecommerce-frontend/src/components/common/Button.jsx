function Button({ children, type = 'button', variant = 'primary', disabled = false, loading = false, onClick, style }) {
    let bg = 'var(--primary)';
    let color = '#fff';
    if (variant === 'secondary') {
        bg = 'var(--secondary)';
        color = '#121019';
    } else if (variant === 'danger') {
        bg = 'var(--danger)';
        color = '#fff';
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                background: bg,
                color: color,
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius)',
                cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: (disabled || loading) ? 0.6 : 1,
                transition: 'var(--transition)',
                ...style
            }}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
}

export default Button;