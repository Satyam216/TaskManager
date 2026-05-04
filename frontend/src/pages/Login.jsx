import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Member'
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password, formData.role);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="form-container glass-panel">
            <h2 className="form-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            
            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                )}
                
                <input
                    type="email"
                    className="input-field"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                
                <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                {!isLogin && (
                    <select 
                        className="input-field"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        style={{ appearance: 'none' }}
                    >
                        <option value="Member" style={{ background: 'var(--bg-dark)' }}>Member</option>
                        <option value="Admin" style={{ background: 'var(--bg-dark)' }}>Admin</option>
                    </select>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    style={{ background: 'none', color: 'var(--primary)', padding: 0 }}
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </div>
        </div>
    );
};

export default Login;
