import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import Toast from '../components/common/Toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    // Check if fields are empty to enable/disable button states proactively
    const isFormEmpty = !email.trim() || !password;

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        // Invalid Form State Validation Checks
        let validationErrors = {};
        if (!email.trim()) {
            validationErrors.email = 'Email address is required.';
        } else if (!email.includes('@')) {
            validationErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            validationErrors.password = 'Password is required.';
        } else if (password.length < 3) {
            validationErrors.password = 'Password must be at least 3 characters long.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setLoading(true);

        // Simulate loading state delay
        setTimeout(() => {
            try {
                const user = loginUser(email, password);
                setToastMessage('Login successful! Redirecting...');

                setTimeout(() => {
                    if (user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/profile');
                    }
                    window.location.reload();
                }, 1000);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div style={{ padding: '3rem 2rem', maxWidth: '400px', margin: 'auto' }}>
            <div className="card">
                <h2>Login</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Demo Accounts:<br />
                    - Customer: <code>customer@test.com</code> / <code>123</code><br />
                    - Admin: <code>admin@test.com</code> / <code>123</code>
                </p>

                {/* API / Authentication Error Message */}
                {error && (
                    <div style={{ padding: '10px', background: 'rgba(255,82,82,0.15)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderColor: fieldErrors.email ? 'var(--danger)' : 'var(--border-color)' }}
                        />
                        {/* Invalid Form Field Error */}
                        {fieldErrors.email && (
                            <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                                {fieldErrors.email}
                            </span>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderColor: fieldErrors.password ? 'var(--danger)' : 'var(--border-color)', width: '100%' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: 'var(--secondary)', padding: '0', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {/* Invalid Form Field Error */}
                        {fieldErrors.password && (
                            <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                                {fieldErrors.password}
                            </span>
                        )}
                    </div>

                    {/* Disabled State Integration */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || isFormEmpty}
                        style={{
                            marginTop: '1rem',
                            background: (loading || isFormEmpty) ? 'var(--border-color)' : 'var(--primary)',
                            color: (loading || isFormEmpty) ? 'var(--text-muted)' : '#fff',
                            opacity: (loading || isFormEmpty) ? 0.6 : 1,
                            cursor: (loading || isFormEmpty) ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Register here</Link>
                </p>
            </div>

            {/* Toast Notification Trigger */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setToastMessage('')}
                />
            )}
        </div>
    );
}

export default Login;