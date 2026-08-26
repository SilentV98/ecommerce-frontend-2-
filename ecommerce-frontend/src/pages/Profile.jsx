import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toast';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myOrders, setMyOrders] = useState([]);

    // Editable Profile States
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        setName(parsedUser.name || '');
        setEmail(parsedUser.email || '');
        setPhone(parsedUser.phone || '');

        // Fetch all orders and filter specifically for this logged-in user's email
        const allOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        const userFilteredOrders = allOrders.filter(order => order.userEmail === parsedUser.email);
        setMyOrders(userFilteredOrders);
    }, [navigate]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const updatedUser = { ...user, name, email, phone };

        // Update current session user
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Update in global users list
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsersList = allUsers.map(u => u.email === user.email ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsersList));

        window.dispatchEvent(new Event('storage'));
        setIsEditing(false);
        setToastMessage('Profile updated successfully!');
    };

    if (!user) return null;

    return (
        <div style={{ padding: '3rem 4rem', maxWidth: '900px', margin: 'auto' }}>
            <h2>My Account Profile</h2>

            <div className="card" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Personal Information</h3>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {!isEditing ? (
                    <div>
                        <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>Name: <strong>{user.name}</strong></p>
                        <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>Email: <strong>{user.email}</strong></p>
                        <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>Phone: <strong>{user.phone || 'Not Provided'}</strong></p>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="btn-secondary" style={{ padding: '8px 16px' }}>Save Changes</button>
                        </div>
                    </form>
                )}
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>My Order History ({myOrders.length} Orders)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {myOrders.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>You have not placed any orders yet.</p>
                ) : (
                    myOrders.map(order => (
                        <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{order.id}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {order.date}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: 'var(--secondary)' }}>${order.total.toFixed(2)}</p>
                                <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,215,64,0.2)', color: 'var(--warning)' }}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setToastMessage(null)}
                />
            )}
        </div>
    );
}

export default Profile;