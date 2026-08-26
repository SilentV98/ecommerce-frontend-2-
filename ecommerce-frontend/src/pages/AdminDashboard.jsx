import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useProducts } from '../hooks/useProducts';
import { initialCategories } from '../data/mockData';
import Toast from '../components/common/Toast';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    // Use centralized products hook
    const { products, addProduct, updateProduct, toggleProductStatus } = useProducts();

    // State declarations
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [usersCount, setUsersCount] = useState(2);
    const [categories, setCategories] = useState(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Toast Notification State
    const [toastMessage, setToastMessage] = useState(null);

    // Modal State for Adding/Editing Product
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [prodName, setProdName] = useState('');
    const [prodPrice, setProdPrice] = useState('');
    const [prodCategory, setProdCategory] = useState(initialCategories[0]);
    const [prodStock, setProdStock] = useState('');
    const [prodDescription, setProdDescription] = useState('');
    const [prodImage, setProdImage] = useState('');

    // Invalid Form Errors State
    const [formErrors, setFormErrors] = useState({});

    // Selected Order State for Detailed View Modal
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userString);
        if (user.role !== 'admin') {
            alert('Access Denied: Admin privileges required.');
            navigate('/');
            return;
        }

        const timer = setTimeout(() => {
            const savedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
            setOrders(savedOrders);

            const allUsers = JSON.parse(localStorage.getItem('users')) || [];
            setUsersList(allUsers);
            setUsersCount(Math.max(2, allUsers.length));
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [navigate]);

    const saveOrdersToStorage = (updated) => {
        setOrders(updated);
        localStorage.setItem('userOrders', JSON.stringify(updated));
    };

    const handleOpenModal = (product = null) => {
        setFormErrors({});
        if (product) {
            setEditingProduct(product);
            setProdName(product.name);
            setProdPrice(product.price);
            setProdCategory(product.category);
            setProdStock(product.stock);
            setProdDescription(product.description || '');
            setProdImage(product.image || '');
        } else {
            setEditingProduct(null);
            setProdName('');
            setProdPrice('');
            setProdCategory(categories[0] || 'Electronics');
            setProdStock('');
            setProdDescription('');
            setProdImage('');
        }
        setIsModalOpen(true);
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProdImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        let errors = {};

        if (!prodName.trim()) {
            errors.name = 'Product name is required.';
        }
        if (!prodPrice || parseFloat(prodPrice) <= 0) {
            errors.price = 'Please enter a valid price greater than 0.';
        }
        if (!prodStock || parseInt(prodStock) < 0) {
            errors.stock = 'Stock quantity cannot be negative.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        if (editingProduct) {
            updateProduct(editingProduct.id, {
                name: prodName,
                price: parseFloat(prodPrice),
                category: prodCategory,
                stock: parseInt(prodStock),
                description: prodDescription,
                image: prodImage
            });
            setToastMessage('Product updated successfully!');
        } else {
            addProduct({
                name: prodName,
                price: parseFloat(prodPrice),
                category: prodCategory,
                stock: parseInt(prodStock),
                description: prodDescription,
                image: prodImage
            });
            setToastMessage('Product added successfully!');
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = (id, currentStatus) => {
        const actionText = currentStatus ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${actionText} this product?`)) {
            toggleProductStatus(id);
            setToastMessage(`Product successfully ${actionText}d!`);
        }
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategoryName && !categories.includes(newCategoryName)) {
            setCategories([...categories, newCategoryName]);
            setNewCategoryName('');
            setToastMessage('Category added successfully!');
        }
    };

    const handleOrderStatusUpdate = (orderId, newStatus) => {
        const targetOrder = orders.find(o => o.id === orderId);

        if (newStatus === 'Delivered' && targetOrder && targetOrder.status !== 'Delivered') {
            const storedProducts = JSON.parse(localStorage.getItem('products')) || products;

            const updatedProducts = storedProducts.map(p => {
                const purchasedItem = targetOrder.items?.find(item => item.id === p.id);
                if (purchasedItem) {
                    return { ...p, stock: Math.max(0, p.stock - purchasedItem.quantity) };
                }
                return p;
            });

            localStorage.setItem('products', JSON.stringify(updatedProducts));
            window.dispatchEvent(new Event('storage'));
        }

        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        saveOrdersToStorage(updatedOrders);
        setToastMessage(`Order status updated to ${newStatus}! Stock adjusted.`);
    };

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>

            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>

                {isLoading ? (
                    <div>
                        <h2>Loading Dashboard...</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="card" style={{ height: '100px', background: 'var(--bg-secondary)', opacity: 0.5, animation: 'pulse 1.5s infinite' }}>
                                    <div style={{ height: '15px', width: '50%', background: 'var(--border-color)', marginBottom: '10px', borderRadius: '4px' }}></div>
                                    <div style={{ height: '30px', width: '80%', background: 'var(--border-color)', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div>
                                <h2>Dashboard Overview & Revenue</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                                    <div className="card">
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Revenue</p>
                                        <h3 style={{ margin: '10px 0 0 0', color: 'var(--secondary)', fontSize: '1.8rem' }}>${totalRevenue.toFixed(2)}</h3>
                                    </div>
                                    <div className="card">
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Products</p>
                                        <h3 style={{ margin: '10px 0 0 0', color: 'var(--primary-hover)', fontSize: '1.8rem' }}>{products.length}</h3>
                                    </div>
                                    <div className="card">
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Orders</p>
                                        <h3 style={{ margin: '10px 0 0 0', color: 'var(--warning)', fontSize: '1.8rem' }}>{orders.length}</h3>
                                    </div>
                                    <div className="card">
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Registered Users</p>
                                        <h3 style={{ margin: '10px 0 0 0', color: '#69F0AE', fontSize: '1.8rem' }}>{usersCount}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Products Management</h2>
                                    <button onClick={() => handleOpenModal()} className="btn-secondary">+ Add New Product</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                    {products.map(p => (
                                        <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {p.image ? (
                                                    <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                ) : (
                                                    <div style={{ width: '50px', height: '50px', background: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>No Img</div>
                                                )}
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>{p.category}</span>
                                                    <h4 style={{ margin: '3px 0' }}>{p.name}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price: ${p.price} | Stock: {p.stock}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleOpenModal(p)} style={{ background: 'var(--primary)', padding: '6px 12px', fontSize: '0.8rem', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}>Edit & Desc</button>
                                                <button onClick={() => handleToggleStatus(p.id, p.active !== false)} style={{ background: p.active !== false ? 'var(--danger)' : 'var(--secondary)', padding: '6px 12px', fontSize: '0.8rem', border: 'none', borderRadius: 'var(--radius)', color: p.active !== false ? '#fff' : '#121019', cursor: 'pointer' }}>{p.active !== false ? 'Deactivate' : 'Activate'}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div style={{ maxWidth: '600px' }}>
                                <h2>Manage Categories</h2>
                                <form onSubmit={handleAddCategory} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'end', marginTop: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>New Category Name</label>
                                        <input type="text" placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn-secondary" style={{ padding: '10px 20px' }}>Add Category</button>
                                </form>
                                <div className="card" style={{ marginTop: '1.5rem' }}>
                                    <h3>Available Categories</h3>
                                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                        {categories.map(cat => <li key={cat} style={{ margin: '8px 0' }}>{cat}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2>Customer Orders Management</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                    {orders.map(order => (
                                        <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{order.id}</h4>
                                                <p style={{ margin: '3px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer: {order.userName || order.shipping?.fullName || 'Guest'} | Date: {order.date}</p>
                                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Total: ${order.total?.toFixed(2)}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <button onClick={() => setSelectedOrderDetails(order)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}>View Details</button>
                                                <select value={order.status} onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)} style={{ padding: '6px', width: '130px' }}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Registered Users Tab for Admin View */}
                        {activeTab === 'users' && (
                            <div>
                                <h2>Registered Users Management</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                    {usersList.map((u, index) => (
                                        <div key={index} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{u.name}</h4>
                                                <p style={{ margin: '3px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email: {u.email} | Role: <strong style={{ color: 'var(--primary-hover)' }}>{u.role || 'customer'}</strong></p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                                                    {u.phone ? `Phone: ${u.phone}` : 'Phone: Not Provided'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </main>

            {/* POPUP MODAL FOR ADDING/EDITING PRODUCT */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>{editingProduct ? 'Edit Product & Description' : 'Add New Product'}</h3>
                        <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Product Name</label>
                                <input
                                    type="text"
                                    value={prodName}
                                    onChange={(e) => setProdName(e.target.value)}
                                    style={{ borderColor: formErrors.name ? 'var(--danger)' : 'var(--border-color)' }}
                                />
                                {formErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={prodPrice}
                                        onChange={(e) => setProdPrice(e.target.value)}
                                        style={{ borderColor: formErrors.price ? 'var(--danger)' : 'var(--border-color)' }}
                                    />
                                    {formErrors.price && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.price}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={prodStock}
                                        onChange={(e) => setProdStock(e.target.value)}
                                        style={{ borderColor: formErrors.stock ? 'var(--danger)' : 'var(--border-color)' }}
                                    />
                                    {formErrors.stock && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.stock}</span>}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Category</label>
                                <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Product Description</label>
                                <textarea rows="3" value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} placeholder="Enter detailed product description..." style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px', borderRadius: 'var(--radius)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Product Image (Upload from Device or URL)</label>
                                <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ marginBottom: '8px' }} />
                                <input type="text" placeholder="Or paste image URL here" value={prodImage.startsWith('data:') ? '' : prodImage} onChange={(e) => setProdImage(e.target.value)} />
                                {prodImage && <img src={prodImage} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px' }} />}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-secondary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* POPUP MODAL FOR DETAILED ORDER BREAKDOWN */}
            {selectedOrderDetails && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h3>Order Details: {selectedOrderDetails.id}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {selectedOrderDetails.date} | Status: <strong>{selectedOrderDetails.status}</strong></p>
                        <hr style={{ borderColor: 'var(--border-color)' }} />

                        <h4 style={{ color: 'var(--secondary)', marginBottom: '5px' }}>Customer Information:</h4>
                        <p style={{ fontSize: '0.9rem', margin: '3px 0' }}><strong>Name:</strong> {selectedOrderDetails.userName || selectedOrderDetails.shipping?.fullName}</p>
                        <p style={{ fontSize: '0.9rem', margin: '3px 0' }}><strong>Email:</strong> {selectedOrderDetails.userEmail || 'N/A'}</p>
                        <p style={{ fontSize: '0.9rem', margin: '3px 0' }}><strong>Phone:</strong> {selectedOrderDetails.shipping?.phone}</p>
                        <p style={{ fontSize: '0.9rem', margin: '3px 0' }}><strong>Address:</strong> {selectedOrderDetails.shipping?.address}, {selectedOrderDetails.shipping?.city}</p>

                        <h4 style={{ marginTop: '1rem', color: 'var(--secondary)' }}>Purchased Items:</h4>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {selectedOrderDetails.items?.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                            <span>Total Amount:</span>
                            <span style={{ color: 'var(--secondary)' }}>${selectedOrderDetails.total?.toFixed(2)}</span>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                            <button onClick={() => setSelectedOrderDetails(null)} className="btn-primary">Close Details</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification Popup */}
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

export default AdminDashboard;