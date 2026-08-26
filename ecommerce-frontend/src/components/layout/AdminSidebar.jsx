function AdminSidebar({ activeTab, setActiveTab }) {
    return (
        <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', paddingLeft: '10px' }}>Admin Dashboard</h3>
            <button
                onClick={() => setActiveTab('overview')}
                style={{ background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', textAlign: 'left', padding: '10px 15px', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}
            >
                📊 Overview & Revenue
            </button>
            <button
                onClick={() => setActiveTab('products')}
                style={{ background: activeTab === 'products' ? 'var(--primary)' : 'transparent', textAlign: 'left', padding: '10px 15px', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}
            >
                📦 Products & Inventory
            </button>
            <button
                onClick={() => setActiveTab('categories')}
                style={{ background: activeTab === 'categories' ? 'var(--primary)' : 'transparent', textAlign: 'left', padding: '10px 15px', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}
            >
                🗂️ Categories Management
            </button>
            <button
                onClick={() => setActiveTab('orders')}
                style={{ background: activeTab === 'orders' ? 'var(--primary)' : 'transparent', textAlign: 'left', padding: '10px 15px', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}
            >
                🛍️ Customer Orders
            </button>
            {/* Added Registered Users Tab Button */}
            <button
                onClick={() => setActiveTab('users')}
                style={{ background: activeTab === 'users' ? 'var(--primary)' : 'transparent', textAlign: 'left', padding: '10px 15px', border: 'none', borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer' }}
            >
                👥 Registered Users
            </button>
        </aside>
    );
}

export default AdminSidebar;