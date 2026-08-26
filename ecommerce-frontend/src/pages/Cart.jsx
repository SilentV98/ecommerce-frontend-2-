import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function Cart() {
    const { cart: cartItems, updateCartQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    // Update quantity securely while respecting stock limits
    const handleUpdateQuantity = (id, newQty, stockLimit, name) => {
        if (newQty < 1) return;
        if (newQty > stockLimit) {
            alert(`Cannot exceed available stock limit of ${stockLimit} for "${name}".`);
            return;
        }
        updateCartQuantity(id, newQty);
    };

    // Remove item with a confirmation prompt
    const handleRemoveItem = (id, name) => {
        const confirmed = window.confirm(`Are you sure you want to remove "${name}" from your cart?`);
        if (confirmed) {
            removeFromCart(id);
        }
    };

    // Calculate individual item subtotal and total cart sum dynamically
    const calculateSubtotal = (price, quantity) => price * quantity;
    const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div style={{ padding: '3rem 4rem', maxWidth: '950px', margin: 'auto' }}>
            <h2>Shopping Cart</h2>

            {cartItems.length === 0 ? (
                /* Empty State Display */
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't added any products to your shopping cart yet.</p>
                    <Link to="/products" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Separated Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map(item => {
                            const itemSubtotal = calculateSubtotal(item.price, item.quantity);
                            const maxStock = item.stock || 10;

                            return (
                                <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>{item.category}</span>
                                        <h4 style={{ margin: '0.3rem 0' }}>{item.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unit Price: ${item.price}</p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        {/* Quantity Control */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={maxStock}
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1, maxStock, item.name)}
                                                style={{ width: '65px', textAlign: 'center' }}
                                            />
                                        </div>

                                        {/* Individual Item Subtotal */}
                                        <div style={{ minWidth: '90px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Subtotal</span>
                                            <strong style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>${itemSubtotal.toFixed(2)}</strong>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id, item.name)}
                                            style={{ background: 'var(--danger)', padding: '6px 12px', fontSize: '0.8rem', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', color: '#fff' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grand Total Calculation & Checkout */}
                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Amount to Pay</p>
                            <h3 style={{ margin: '5px 0 0 0', fontSize: '1.8rem', color: 'var(--secondary)' }}>${grandTotal.toFixed(2)}</h3>
                        </div>
                        <button onClick={() => navigate('/checkout')} className="btn-secondary" style={{ padding: '12px 25px' }}>
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Cart;