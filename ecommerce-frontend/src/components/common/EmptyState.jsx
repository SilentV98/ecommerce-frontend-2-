import { Link } from 'react-router-dom';

function EmptyState({ title = 'No Results Found', message = 'There are no items to display right now.', actionText = 'Browse Products', actionLink = '/products' }) {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{message}</p>
            <Link to={actionLink} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                {actionText}
            </Link>
        </div>
    );
}

export default EmptyState;