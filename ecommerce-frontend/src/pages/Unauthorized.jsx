import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '4rem auto' }}>
            <h2 style={{ color: 'var(--danger)', fontSize: '2rem', marginBottom: '1rem' }}>403 - Access Denied</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                You do not have the necessary administrative privileges to view this page.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                    Go to Home
                </Link>
                <Link to="/login" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>
                    Login as Admin
                </Link>
            </div>
        </div>
    );
}

export default Unauthorized;