import { Link } from 'react-router-dom';

function ProductCard({ product }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: product.active === false ? 0.6 : 1 }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>{product.category}</span>
                    <span style={{ fontSize: '0.75rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                </div>
                <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${product.price}</p>
            </div>
            <Link to={`/products/${product.id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem', display: 'block' }}>
                View Details
            </Link>
        </div>
    );
}

export default ProductCard;