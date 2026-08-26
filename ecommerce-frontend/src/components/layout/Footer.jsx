import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '2.5rem 4rem', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h3 style={{ color: 'var(--secondary)', margin: '0 0 10px 0' }}>Silent Store</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: 0 }}>
                        Your ultimate online shopping destination for secure, fast, and modern e-commerce solutions.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                            <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link></li>
                            <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</Link></li>
                            <li><Link to="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cart</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                &copy; 2026 E-Store Frontend. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;