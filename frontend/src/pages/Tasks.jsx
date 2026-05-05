import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        dueDate: ''
    });

    const fetchTasks = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/tasks', config);
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProjects = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/projects', config);
            setProjects(data);
            if (data.length > 0) {
                setNewTask(prev => ({ ...prev, project: data[0]._id }));
            }
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
        fetchTasks();
        if (user.role === 'Admin') {
            fetchProjects();
            fetchUsers();
        }
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { ...newTask };
            if (!payload.assignedTo) delete payload.assignedTo;
            await api.post('/tasks', payload, config);
            setShowCreate(false);
            setNewTask({ title: '', description: '', project: projects[0]?._id || '', assignedTo: '', dueDate: '' });
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.put(`/tasks/${taskId}`, { status: newStatus }, config);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'Pending': return 'badge pending';
            case 'In Progress': return 'badge progress';
            case 'Completed': return 'badge completed';
            default: return 'badge';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Tasks</h1>
                {user.role === 'Admin' && (
                    <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
                        {showCreate ? 'Cancel' : '+ New Task'}
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New Task</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Task Title"
                                required
                                value={newTask.title}
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            />
                            <select
                                className="input-field"
                                required
                                value={newTask.project}
                                onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                                style={{ appearance: 'none' }}
                            >
                                <option value="" disabled>Select Project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id} style={{ background: 'var(--bg-dark)' }}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                            <select
                                className="input-field"
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                style={{ appearance: 'none' }}
                            >
                                <option value="">Unassigned</option>
                                {users.filter(u => u._id !== user._id).map(u => (
                                    <option key={u._id} value={u._id} style={{ background: 'var(--bg-dark)' }}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                            
                            <div style={{ width: '100%' }}>
                                <DatePicker
                                    selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
                                    onChange={(date) => setNewTask({...newTask, dueDate: date})}
                                    className="input-field"
                                    placeholderText="Select Due Date"
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>

                        <textarea
                            className="input-field"
                            placeholder="Description"
                            rows="2"
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            style={{ marginBottom: '1rem' }}
                        ></textarea>
                        
                        <button type="submit" className="btn-primary">Create Task</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.map(task => (
                    <div key={task._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{task.title}</h3>
                                <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Project: {task.project?.name || 'Unknown'} 
                                {user.role === 'Admin' && task.assignedTo && ` | Assigned to: ${task.assignedTo.name}`}
                                 | Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                            </p>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{task.description}</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {task.status !== 'Pending' && (
                                <button 
                                    onClick={() => handleStatusUpdate(task._id, 'Pending')}
                                    style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', borderRadius: '4px' }}
                                >
                                    To Pending
                                </button>
                            )}
                            {task.status !== 'In Progress' && (
                                <button 
                                    onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                                    style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', borderRadius: '4px' }}
                                >
                                    In Progress
                                </button>
                            )}
                            {task.status !== 'Completed' && (
                                <button 
                                    onClick={() => handleStatusUpdate(task._id, 'Completed')}
                                    style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent)', borderRadius: '4px' }}
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && !showCreate && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No tasks assigned yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
