function FormField({ label, type = 'text', placeholder, value, onChange, error, required = false }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
            {label && <label style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
                    color: 'var(--text-main)',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    width: '100%'
                }}
            />
            {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</span>}
        </div>
    );
}

export default FormField;