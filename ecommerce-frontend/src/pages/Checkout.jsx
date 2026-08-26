import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form shipping and payment states
    const [fullName, setFullName] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    useEffect(() => {
        // Load cart items on component mount
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);

        // Pre-fill user name and phone if logged in
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setFullName(user.name || '');
            setShippingPhone(user.phone || '');
        }
    }, []);

    // Calculate total price safely from cartItems
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Form validation check to enable/disable button
    const isFormValid = fullName.trim() !== '' && shippingPhone.trim() !== '' && address.trim() !== '' && city.trim() !== '' && cartItems.length > 0;

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        // Simulate network latency or direct order processing
        setTimeout(() => {
            // 1. Define orderId and user info
            const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
            const currentUser = JSON.parse(localStorage.getItem('user')) || { name: fullName || 'Guest User', email: 'guest@test.com' };

            // 2. Build the new order object
            const newOrder = {
                id: orderId,
                userName: currentUser.name,
                userEmail: currentUser.email,
                date: new Date().toISOString().split('T')[0],
                total: totalPrice,
                status: 'Processing',
                items: cartItems,
                shipping: { fullName, phone: shippingPhone, address, city },
                paymentMethod
            };

            // 3. Save order to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
            localStorage.setItem('userOrders', JSON.stringify([newOrder, ...existingOrders]));

            // 4. Clear cart and redirect to profile/home
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));

            alert(`Order placed successfully! Order ID: ${orderId}`);
            navigate('/profile');
        }, 500);
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add some products before proceeding to checkout.</p>
                <button onClick={() => navigate('/products')} className="btn-secondary">Browse Products</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 4rem', maxWidth: '800px', margin: 'auto' }}>
            <h2>Checkout & Shipping</h2>

            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Order Summary</h3>
                <div style={{ margin: '1.0rem 0', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--secondary)' }}>${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleConfirmOrder} className="card" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Shipping Details</h3>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                {/* Updated Phone Number Field */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number (Required for Delivery)</label>
                    <input
                        type="tel"
                        placeholder="Enter your active phone number"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Payment Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                </div>

                {/* Disabled State Implementation for Submit Button */}
                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    style={{
                        marginTop: '1rem',
                        padding: '12px',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        fontWeight: 'bold',
                        background: (!isFormValid || isSubmitting) ? 'var(--border-color)' : 'var(--secondary)',
                        color: (!isFormValid || isSubmitting) ? 'var(--text-muted)' : '#121019',
                        cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer',
                        opacity: (!isFormValid || isSubmitting) ? 0.6 : 1
                    }}
                >
                    {isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}
                </button>
            </form>
        </div>
    );
}

export default Checkout;