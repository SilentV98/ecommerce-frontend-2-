function Alert({ type = 'info', message, onClose }) {
    let bg = 'rgba(0, 123, 255, 0.15)';
    let border = '#007bff';
    let color = '#007bff';

    if (type === 'success') {
        bg = 'rgba(0, 230, 118, 0.15)';
        border = 'var(--secondary)';
        color = 'var(--secondary)';
    } else if (type === 'error') {
        bg = 'rgba(255, 82, 82, 0.15)';
        border = 'var(--danger)';
        color = 'var(--danger)';
    } else if (type === 'warning') {
        bg = 'rgba(255, 215, 64, 0.15)';
        border = 'var(--warning)';
        color = 'var(--warning)';
    }

    if (!message) return null;

    return (
        <div style={{ padding: '12px 16px', background: bg, border: `1px solid ${border}`, color: color, borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', fontSize: '0.9rem' }}>
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: color, fontSize: '1rem', cursor: 'pointer', padding: '0 0 0 10px' }}>
                    &times;
                </button>
            )}
        </div>
    );
}

export default Alert;