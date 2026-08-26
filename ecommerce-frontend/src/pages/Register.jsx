import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import Toast from '../components/common/Toast';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const navigate = useNavigate();

    // Helper function to evaluate password strength
    const getPasswordStrength = (pass) => {
        if (!pass) return { label: '', color: 'transparent', width: '0%' };
        if (pass.length < 6) return { label: 'Weak (Min 6 characters)', color: 'var(--danger)', width: '33%' };
        if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
            return { label: 'Medium (Add numbers & uppercase)', color: 'var(--warning)', width: '66%' };
        }
        return { label: 'Strong Password', color: 'var(--secondary)', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(password);
    const isFormIncomplete = !name || !email || !phone || !password || !confirmPassword || !agreeTerms;

    const handleRegister = (e) => {
        e.preventDefault();
        setErrors({});

        let validationErrors = {};

        if (!email.includes('@')) {
            validationErrors.email = 'Please enter a valid email address.';
        }
        if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters long.';
        }
        if (password !== confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!agreeTerms) {
            validationErrors.terms = 'You must agree to the terms and conditions.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        setTimeout(() => {
            try {
                registerUser(name, email, password);
                setToastMessage('Account registered successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                setErrors({ general: err.message });
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div style={{ padding: '3rem 2rem', maxWidth: '450px', margin: 'auto' }}>
            <div className="card">
                <h2>Create Account</h2>

                {errors.general && (
                    <div style={{ padding: '10px', background: 'rgba(255,82,82,0.15)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderColor: errors.email ? 'var(--danger)' : 'var(--border-color)' }}
                            required
                        />
                        {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field with Strength Indicator */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ borderColor: errors.password ? 'var(--danger)' : 'var(--border-color)' }}
                            required
                        />

                        {/* Password Strength Bar & Text */}
                        {password && (
                            <div style={{ marginTop: '6px' }}>
                                <div style={{ height: '4px', width: '100%', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: passwordStrength.width, background: passwordStrength.color, transition: 'width 0.3s ease, background 0.3s ease' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: passwordStrength.color, marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                                    Strength: {passwordStrength.label}
                                </span>
                            </div>
                        )}

                        {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ borderColor: errors.confirmPassword ? 'var(--danger)' : 'var(--border-color)' }}
                            required
                        />
                        {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="terms" style={{ cursor: 'pointer' }}>I agree to the Terms and Conditions</label>
                    </div>
                    {errors.terms && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'block' }}>{errors.terms}</span>}

                    <button
                        type="submit"
                        disabled={loading || isFormIncomplete}
                        style={{
                            marginTop: '0.5rem',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            fontWeight: 'bold',
                            background: (loading || isFormIncomplete) ? 'var(--border-color)' : 'var(--secondary)',
                            color: (loading || isFormIncomplete) ? 'var(--text-muted)' : '#121019',
                            opacity: (loading || isFormIncomplete) ? 0.6 : 1,
                            cursor: (loading || isFormIncomplete) ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Login here</Link>
                </p>
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

export default Register;