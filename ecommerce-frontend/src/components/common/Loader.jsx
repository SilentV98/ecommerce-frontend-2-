function Loader({ size = '40px', text = 'Loading...' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1rem' }}>
            <div style={{
                width: size,
                height: size,
                border: '4px solid var(--bg-secondary)',
                borderTop: '4px solid var(--secondary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{text}</p>}

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default Loader;