import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-main)' }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>404</h1>
            <h3 style={{ marginBottom: '1rem' }}>Page Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 20px', display: 'inline-block' }}>
                Return to Homepage
            </Link>
        </div>
    );
}

export default NotFound;