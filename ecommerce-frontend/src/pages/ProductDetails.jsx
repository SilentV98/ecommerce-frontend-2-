import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Toast from '../components/common/Toast';

function ProductDetails() {
    const { id } = useParams();
    const { products: allProducts } = useProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);

    // Simulate loading state when fetching product data
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [id]);

    const product = allProducts.find(p => p.id === id) || allProducts[0];

    // Loading State with Skeleton UI
    if (isLoading || !product) {
        return (
            <div style={{ padding: '3rem 4rem', maxWidth: '1000px', margin: 'auto' }}>
                <div style={{ width: '120px', height: '20px', background: 'var(--border-color)', marginBottom: '1.5rem', borderRadius: '4px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}></div>
                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem', alignItems: 'start' }}>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', height: '280px', opacity: 0.6, animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ height: '15px', width: '30%', background: 'var(--border-color)', borderRadius: '4px', opacity: 0.6 }}></div>
                        <div style={{ height: '30px', width: '70%', background: 'var(--border-color)', borderRadius: '4px', opacity: 0.6 }}></div>
                        <div style={{ height: '25px', width: '25%', background: 'var(--border-color)', borderRadius: '4px', opacity: 0.6 }}></div>
                        <div style={{ height: '60px', width: '100%', background: 'var(--border-color)', borderRadius: '4px', opacity: 0.6 }}></div>
                        <div style={{ height: '40px', width: '100%', background: 'var(--border-color)', borderRadius: '4px', opacity: 0.6 }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Determine stock status text and color (Out of Stock / Low Stock / In Stock States)
    let stockStatusText = 'In Stock';
    let stockStatusColor = 'var(--success)';
    if (product.stock === 0 || product.active === false) {
        stockStatusText = product.active === false ? 'Deactivated by Admin' : 'Out of Stock';
        stockStatusColor = 'var(--danger)';
    } else if (product.stock < 5) {
        stockStatusText = `Low Stock (${product.stock} left)`;
        stockStatusColor = 'var(--warning)';
    } else {
        stockStatusText = `In Stock (${product.stock} available)`;
    }

    const handleAddToCart = () => {
        if (quantity > product.stock || product.stock === 0 || product.active === false) return;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            const newTotalQty = cart[existingIndex].quantity + quantity;
            if (newTotalQty > product.stock) {
                alert('Cannot add more than available stock limit.');
                return;
            }
            cart[existingIndex].quantity = newTotalQty;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('local-storage-update'));

        // Trigger Toast notification
        setToastMessage('Product successfully added to cart!');
    };

    const relatedProducts = allProducts.filter(
        p => p.category === product.category && p.id !== product.id && p.active !== false
    );

    return (
        <div style={{ padding: '3rem 4rem', maxWidth: '1000px', margin: 'auto' }}>
            <Link to="/products" style={{ color: 'var(--secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                &larr; Back to Products
            </Link>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem', alignItems: 'start', opacity: (product.stock === 0 || product.active === false) ? 0.85 : 1 }}>

                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{product.name} Image</span>
                    )}
                </div>

                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {product.category}
                    </span>
                    <h2 style={{ margin: '0.5rem 0 1rem 0' }}>{product.name}</h2>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 1rem 0' }}>
                        ${product.price}
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        {product.description || 'No description available for this item.'}
                    </p>

                    {/* Stock Status Label */}
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', color: stockStatusColor }}>
                        ● {stockStatusText}
                    </div>

                    {/* Quantity Selector - Hidden if Out of Stock */}
                    {product.stock > 0 && product.active !== false && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    if (val <= product.stock) setQuantity(val);
                                }}
                                style={{ width: '80px', textAlign: 'center' }}
                            />
                        </div>
                    )}

                    {/* Out of Stock / Disabled Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || product.active === false}
                        className={(product.stock === 0 || product.active === false) ? '' : 'btn-secondary'}
                        style={{
                            width: '100%',
                            padding: '12px',
                            opacity: (product.stock === 0 || product.active === false) ? 0.5 : 1,
                            cursor: (product.stock === 0 || product.active === false) ? 'not-allowed' : 'pointer',
                            background: (product.stock === 0 || product.active === false) ? 'var(--border-color)' : undefined,
                            color: (product.stock === 0 || product.active === false) ? 'var(--text-muted)' : undefined,
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            fontWeight: 'bold'
                        }}
                    >
                        {product.active === false ? 'Product Deactivated' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Render Toast notification */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setToastMessage(null)}
                />
            )}

            {relatedProducts.length > 0 && (
                <div style={{ marginTop: '3.5rem' }}>
                    <h3>Related Products in {product.category}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {relatedProducts.map(rel => (
                            <div key={rel.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    {rel.image && <img src={rel.image} alt={rel.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />}
                                    <h4 style={{ margin: '0 0 5px 0' }}>{rel.name}</h4>
                                    <p style={{ margin: 0, color: 'var(--secondary)', fontWeight: 'bold' }}>${rel.price}</p>
                                </div>
                                <Link to={`/products/${rel.id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: '1rem', display: 'block', padding: '8px' }}>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetails;