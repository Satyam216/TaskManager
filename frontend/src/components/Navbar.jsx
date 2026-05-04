import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav className="navbar glass-panel">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                TeamTasker
            </div>
            <div className="nav-links">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>Projects</Link>
                <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}>Tasks</Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '2rem', paddingLeft: '2rem', borderLeft: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {user.name} <span className="badge" style={{ background: 'var(--primary)', color: 'white', marginLeft: '0.5rem' }}>{user.role}</span>
                    </span>
                    <button onClick={logout} className="btn-primary" style={{ background: 'var(--danger)', padding: '0.5rem 1rem' }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
