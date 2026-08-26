import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { initialCategories } from '../data/mockData';

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products: productsCatalog } = useProducts();

    // Loading & Error States for data simulation/fetching
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1500);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [visibleCount, setVisibleCount] = useState(8);

    // Function to simulate fetching products with error handling & retry support
    const loadProductsData = () => {
        setIsLoading(true);
        setHasError(false);

        const timer = setTimeout(() => {
            // Simulated condition: If productsCatalog fails or to test error state, 
            // you can toggle this. Here we simulate normal loading completion.
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    };

    useEffect(() => {
        loadProductsData();
    }, []);

    // Filter logic
    const filteredProducts = useMemo(() => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        const isAdmin = user && user.role === 'admin';

        return productsCatalog.filter(product => {
            if (!isAdmin && product.active === false) return false;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesPrice = product.price <= priceRange;
            const matchesStock = !inStockOnly || product.stock > 0;
            return matchesSearch && matchesCategory && matchesPrice && matchesStock;
        });
    }, [productsCatalog, searchQuery, selectedCategory, priceRange, inStockOnly]);

    // Sorting logic
    const sortedProducts = useMemo(() => {
        const productsCopy = [...filteredProducts];
        if (sortBy === 'name-asc') productsCopy.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === 'name-desc') productsCopy.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortBy === 'price-asc') productsCopy.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') productsCopy.sort((a, b) => b.price - a.price);
        return productsCopy;
    }, [filteredProducts, sortBy]);

    const visibleProducts = sortedProducts.slice(0, visibleCount);

    // 1. Error State with Retry Button
    if (hasError) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '5rem auto' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: '10px' }}>Failed to Load Products</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    An error occurred while connecting to the server. Please check your connection and try again.
                </p>
                <button
                    onClick={loadProductsData}
                    className="btn-secondary"
                    style={{ padding: '10px 25px' }}
                >
                    Retry
                </button>
            </div>
        );
    }

    // Loading State with Skeleton UI
    if (isLoading) {
        return (
            <div style={{ padding: '3rem 4rem', maxWidth: '1200px', margin: 'auto' }}>
                <h2>Products Catalog</h2>

                {/* Filter Bar Skeleton */}
                <div className="card" style={{ margin: '1.5rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', height: '60px', opacity: 0.5 }}>
                    <div style={{ flex: 1, height: '35px', background: 'var(--bg-secondary)', borderRadius: '4px' }}></div>
                    <div style={{ width: '180px', height: '35px', background: 'var(--bg-secondary)', borderRadius: '4px' }}></div>
                    <div style={{ width: '180px', height: '35px', background: 'var(--bg-secondary)', borderRadius: '4px' }}></div>
                </div>

                <div style={{ height: '20px', width: '200px', background: 'var(--bg-secondary)', marginBottom: '1.5rem', borderRadius: '4px', opacity: 0.5 }}></div>

                {/* Product Cards Skeleton Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="card" style={{ height: '320px', background: 'var(--bg-secondary)', opacity: 0.6, animation: 'pulse 1.5s infinite', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ width: '100%', height: '160px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '10px' }}></div>
                                <div style={{ height: '14px', width: '40%', background: 'var(--border-color)', marginBottom: '8px', borderRadius: '4px' }}></div>
                                <div style={{ height: '20px', width: '80%', background: 'var(--border-color)', marginBottom: '8px', borderRadius: '4px' }}></div>
                            </div>
                            <div style={{ height: '35px', background: 'var(--border-color)', borderRadius: 'var(--radius)' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 4rem', maxWidth: '1200px', margin: 'auto' }}>
            <h2>Products Catalog</h2>

            <div className="card" style={{ margin: '1.5rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(8); }}
                    style={{ flex: 1, minWidth: '220px' }}
                />

                {/* Dynamically Populated Categories Dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setVisibleCount(8); }}
                    style={{ width: '180px' }}
                >
                    <option value="All">All Categories</option>
                    {initialCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '180px' }}
                >
                    <option value="default">Sort by: Featured</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Showing <strong>{visibleProducts.length}</strong> of <strong>{sortedProducts.length}</strong> results found.
            </p>

            {/* No Results State */}
            {sortedProducts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>No Results Found</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                        We couldn't find any products matching your search criteria or filters. Try adjusting your search or filters.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('default'); }}
                        className="btn-secondary"
                        style={{ padding: '10px 20px' }}
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        {visibleProducts.map((product) => {
                            // 2. Out of Stock State Check
                            const isOutOfStock = product.stock <= 0;

                            return (
                                <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: product.active === false ? 0.6 : 1 }}>
                                    <div>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '160px', background: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>No Image</div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>{product.category}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: !isOutOfStock ? 'var(--success)' : 'var(--danger)' }}>
                                                {!isOutOfStock ? `Stock: ${product.stock}` : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${product.price}</p>
                                    </div>

                                    {/* Out of Stock State: Disables action / shows notice */}
                                    {isOutOfStock ? (
                                        <button
                                            disabled
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '1.5rem',
                                                width: '100%',
                                                padding: '10px',
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-muted)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius)',
                                                cursor: 'not-allowed',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Out of Stock
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

                    {visibleCount < sortedProducts.length && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button
                                onClick={() => setVisibleCount(prev => prev + 4)}
                                className="btn-secondary"
                                style={{ padding: '12px 30px' }}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Products;