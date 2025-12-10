import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets, deleteTicket, getTicketStats } from '../api/ticketApi';
import { FaPlus, FaEdit, FaTrash, FaTicketAlt, FaFilter, FaChartLine } from 'react-icons/fa';
import '../Styles/ticket.css';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', priority: '', category: '' });
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [filter]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const { data } = await getTickets(filter);
            setTickets(data.data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await getTicketStats();
            setStats(data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;
        
        try {
            await deleteTicket(id);
            fetchTickets();
            fetchStats();
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return '#dc3545';
            case 'High': return '#fd7e14';
            case 'Medium': return '#ffc107';
            case 'Low': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return '#17a2b8';
            case 'In Progress': return '#ffc107';
            case 'Resolved': return '#28a745';
            case 'Closed': return '#6c757d';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="ticket-container">
            <div className="ticket-header">
                <div className="header-content">
                    <div className="header-left">
                        <FaTicketAlt className="header-icon" />
                        <div>
                            <h1>Support Tickets</h1>
                            <p>Manage and track customer support requests</p>
                        </div>
                    </div>
                    <button className="btn-create" onClick={() => navigate('/tickets/new')}>
                        <FaPlus /> Create Ticket
                    </button>
                </div>
            </div>

            {stats && (
                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <FaTicketAlt />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Tickets</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon open">
                            <FaChartLine />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.byStatus.open}</h3>
                            <p>Open Tickets</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon progress">
                            <FaChartLine />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.byStatus.inProgress}</h3>
                            <p>In Progress</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon resolved">
                            <FaChartLine />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.byStatus.resolved}</h3>
                            <p>Resolved</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="filter-section">
                <div className="filter-group">
                    <FaFilter className="filter-icon" />
                    <select 
                        value={filter.status} 
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select 
                        value={filter.priority} 
                        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>

                    <select 
                        value={filter.category} 
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Delivery Issue">🚚 Delivery Issue</option>
                        <option value="Meal Quality">🍽️ Meal Quality</option>
                        <option value="Packaging Issue">📦 Packaging Issue</option>
                        <option value="Order Issue">📋 Order Issue</option>
                        <option value="Payment Issue">💳 Payment Issue</option>
                        <option value="General">General Inquiry</option>
                        <option value="Technical">Technical Support</option>
                        <option value="Billing">Billing & Refund</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Bug Report">Bug Report</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">
                    <FaTicketAlt className="empty-icon" />
                    <h3>No tickets found</h3>
                    <p>Create your first support ticket or adjust filters</p>
                    <button className="btn-create" onClick={() => navigate('/tickets/new')}>
                        <FaPlus /> Create First Ticket
                    </button>
                </div>
            ) : (
                <div className="tickets-grid">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} className="ticket-card">
                            <div className="ticket-card-header">
                                <div className="ticket-badges">
                                    <span 
                                        className="badge priority"
                                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                                    >
                                        {ticket.priority}
                                    </span>
                                    <span 
                                        className="badge status"
                                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>
                                <span className="badge category">{ticket.category}</span>
                            </div>

                            <div className="ticket-card-body">
                                <h3 className="ticket-subject">{ticket.subject}</h3>
                                <p className="ticket-description">{ticket.description}</p>
                            </div>

                            <div className="ticket-card-footer">
                                <div className="ticket-meta">
                                    <span className="created-by">By: {ticket.createdBy}</span>
                                    <span className="created-date">{formatDate(ticket.createdAt)}</span>
                                </div>
                                <div className="ticket-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => navigate(`/tickets/edit/${ticket._id}`)}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(ticket._id)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketList;
