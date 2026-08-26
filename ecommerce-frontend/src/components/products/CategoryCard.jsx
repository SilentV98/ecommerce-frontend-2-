import { useNavigate } from 'react-router-dom';

function CategoryCard({ category, count }) {
    const navigate = useNavigate();

    return (
        <div
            className="card"
            onClick={() => navigate(`/products?category=${category}`)}
            style={{ textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
        >
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>{category}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count || 'Available'}</p>
        </div>
    );
}

export default CategoryCard;