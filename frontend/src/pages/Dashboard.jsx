import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await api.get('/dashboard/summary', config);
                setSummary(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSummary();
    }, [user]);

    if (!summary) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, {user.name}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your tasks today.</p>
            </div>

            <div className="grid-cards">
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Total Tasks</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{summary.totalTasks}</div>
                </div>

                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Completed</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{summary.statusCounts.Completed || 0}</div>
                </div>

                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>In Progress</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{summary.statusCounts['In Progress'] || 0}</div>
                </div>

                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Overdue</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: summary.overdue > 0 ? 'var(--danger)' : 'inherit' }}>
                        {summary.overdue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
