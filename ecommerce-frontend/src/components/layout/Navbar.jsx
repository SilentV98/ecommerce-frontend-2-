import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [totalCartItemsCount, setTotalCartItemsCount] = useState(0);

    // Synchronize user and cart state using useEffect and storage listeners
    useEffect(() => {
        const updateNavbarState = () => {
            const userString = localStorage.getItem('user');
            setUser(userString ? JSON.parse(userString) : null);

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const count = cart.reduce((acc, item) => acc + item.quantity, 0);
            setTotalCartItemsCount(count);
        };

        updateNavbarState();

        window.addEventListener('storage', updateNavbarState);
        window.addEventListener('local-storage-update', updateNavbarState);

        return () => {
            window.removeEventListener('storage', updateNavbarState);
            window.removeEventListener('local-storage-update', updateNavbarState);
        };
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out of your account?')) {
            localStorage.removeItem('user');
            setUser(null);
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('local-storage-update'));
            navigate('/login');
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav style={{ padding: '1rem 2rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            {/* Left Side / Store Name */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" onClick={closeMobileMenu} style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Silent Store
                </Link>

                {/* Desktop Links (Hidden on Mobile via CSS) */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav-links">
                    <Link to="/products" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Products</Link>
                    <Link to="/cart" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Cart
                        {totalCartItemsCount > 0 && (
                            <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                                {totalCartItemsCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Hamburger Toggle Button (Hidden on Desktop via CSS) */}
            <button
                onClick={toggleMobileMenu}
                className="mobile-menu-toggle"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Desktop Right Side / Auth Links (Hidden on Mobile via CSS) */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="desktop-auth-links">
                {user ? (
                    <>
                        {user.role === 'admin' && <Link to="/admin" onClick={closeMobileMenu} style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Admin Dashboard</Link>}
                        <Link to="/profile" onClick={closeMobileMenu} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Profile</Link>
                        <button onClick={handleLogout} style={{ background: 'var(--danger)', padding: '6px 12px', fontSize: '0.9rem', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMobileMenu} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" onClick={closeMobileMenu} className="btn-secondary" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.9rem' }}>Register</Link>
                    </>
                )}
            </div>

            {/* Mobile Dropdown / Drawer Menu */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    gap: '1rem',
                    boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    <Link to="/products" onClick={closeMobileMenu} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Products</Link>
                    <Link to="/cart" onClick={closeMobileMenu} style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
                        Cart
                        {totalCartItemsCount > 0 && (
                            <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                                {totalCartItemsCount}
                            </span>
                        )}
                    </Link>
                    <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin" onClick={closeMobileMenu} style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Admin Dashboard</Link>}
                            <Link to="/profile" onClick={closeMobileMenu} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Profile</Link>
                            <button onClick={() => { closeMobileMenu(); handleLogout(); }} style={{ background: 'var(--danger)', padding: '8px 12px', fontSize: '0.9rem', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer', textAlign: 'center' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMobileMenu} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" onClick={closeMobileMenu} className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 12px', fontSize: '0.9rem', textAlign: 'center' }}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;