import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { initialCategories } from '../data/mockData';

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { products } = useProducts();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/products');
        }
    };

    // Filter active products and slice the first 4 for featured display
    const featuredProducts = products.filter(p => p.active !== false).slice(0, 4);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* 1. Hero Section */}
            <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                    Discover Next-Gen Tech & Gadgets
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    Explore our exclusive collection with premium quality and unmatched prices tailored for tech enthusiasts.
                </p>

                {/* Search Input Bar */}
                <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, padding: '12px' }}
                    />
                    <button type="submit" className="btn-secondary" style={{ padding: '0 20px' }}>
                        Search
                    </button>
                </form>
            </section>

            {/* Main Content Container */}
            <div style={{ padding: '3rem 4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

                {/* 2. Categories Section (Dynamic from mockData) */}
                <section>
                    <h2>Top Categories</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        {initialCategories.map(cat => {
                            const count = products.filter(p => p.category === cat && p.active !== false).length;
                            return (
                                <div
                                    key={cat}
                                    className="card"
                                    onClick={() => navigate(`/products?category=${cat}`)}
                                    style={{ textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                                >
                                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>{cat}</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} items available</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Featured & Latest Products (ProductCard) */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Featured Products</h2>
                        <Link to="/products" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>View All &rarr;</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        {featuredProducts.map(product => {
                            const isOutOfStock = product.stock === 0;

                            return (
                                <div
                                    key={product.id}
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        opacity: isOutOfStock ? 0.65 : 1,
                                        position: 'relative'
                                    }}
                                >
                                    <div>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '150px', background: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>No Image</div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                                            {isOutOfStock && (
                                                <span style={{ fontSize: '0.75rem', background: 'var(--danger)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                        <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${product.price}</p>
                                    </div>

                                    {/* Out of Stock State Handling for Button */}
                                    {isOutOfStock ? (
                                        <button
                                            disabled
                                            style={{
                                                background: 'var(--border-color)',
                                                color: 'var(--text-muted)',
                                                cursor: 'not-allowed',
                                                padding: '10px',
                                                border: 'none',
                                                borderRadius: 'var(--radius)',
                                                textAlign: 'center',
                                                marginTop: '1.5rem',
                                                width: '100%',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Unavailable
                                        </button>
                                    ) : (
                                        <Link to={`/products/${product.id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem', display: 'block' }}>
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Promotional Banner Section */}
                <section className="card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, #1E1A29 100%)', border: '1px solid var(--secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem' }}>
                    <div>
                        <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>Limited Time Offer</span>
                        <h2 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>Summer Tech Sale - Up to 40% Off</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Grab top-tier gadgets and electronics before stock runs out.</p>
                    </div>
                    <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 24px', whiteSpace: 'nowrap' }}>
                        Shop Sale Now
                    </Link>
                </section>

            </div>

        </div>
    );
}

export default Home;