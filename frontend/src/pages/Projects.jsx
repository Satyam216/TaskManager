import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });

    const fetchProjects = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/projects', config);
            setProjects(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/auth/users', config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjects();
        if (user.role === 'Admin') {
            fetchUsers();
        }
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.post('/projects', newProject, config);
            setShowCreate(false);
            setNewProject({ name: '', description: '', members: [] });
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMemberToggle = (userId) => {
        setNewProject(prev => {
            const members = prev.members.includes(userId)
                ? prev.members.filter(id => id !== userId)
                : [...prev.members, userId];
            return { ...prev, members };
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Projects</h1>
                {user.role === 'Admin' && (
                    <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
                        {showCreate ? 'Cancel' : '+ New Project'}
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New Project</h3>
                    <form onSubmit={handleCreate}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Project Name"
                            required
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        />
                        <textarea
                            className="input-field"
                            placeholder="Description"
                            rows="3"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        ></textarea>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Assign Members:</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {users.filter(u => u._id !== user._id).map(u => (
                                    <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={newProject.members.includes(u._id)}
                                            onChange={() => handleMemberToggle(u._id)}
                                        />
                                        {u.name} ({u.role})
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Create Project</button>
                    </form>
                </div>
            )}

            <div className="grid-cards">
                {projects.map(project => (
                    <div key={project._id} className="card glass-panel">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.name}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '3rem' }}>
                            {project.description || 'No description provided.'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {user.role === 'Admin' ? `${project.members?.length || 0} Members` : `Owner: ${project.owner?.name}`}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !showCreate && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No projects found. {user.role === 'Admin' ? 'Create one to get started!' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
