import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTicket, updateTicket, getTicket } from '../api/ticketApi';
import { FaSave, FaTimes, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';
import '../Styles/ticket.css';

const TicketForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        category: 'General',
        createdBy: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchTicket();
        }
    }, [id]);

    const fetchTicket = async () => {
        try {
            const { data } = await getTicket(id);
            setFormData(data.data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            setError('Failed to load ticket');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.subject.trim() || !formData.description.trim()) {
            setError('Subject and description are required');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await updateTicket(id, formData);
            } else {
                await createTicket(formData);
            }
            navigate('/tickets');
        } catch (error) {
            console.error('Error saving ticket:', error);
            setError('Failed to save ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ticket-form-container">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate('/tickets')}>
                    <FaArrowLeft />
                    <span>Back to Tickets</span>
                </button>
                <div className="header-content">
                
                    <h1>{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="ticket-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief summary of the issue"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the issue"
                        rows="6"
                        required
                    ></textarea>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="General">General Inquiry</option>
                            <option value="Delivery Issue">🚚 Delivery Issue</option>
                            <option value="Meal Quality">🍽️ Meal Quality</option>
                            <option value="Packaging Issue">📦 Packaging Issue</option>
                            <option value="Order Issue">📋 Order Issue</option>
                            <option value="Payment Issue">💳 Payment Issue</option>
                            <option value="Technical">Technical Support</option>
                            <option value="Billing">Billing & Refund</option>
                            <option value="Feature Request">Feature Request</option>
                            <option value="Bug Report">Bug Report</option>
                        </select>
                    </div>
                </div>

                {isEditMode && (
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                )}

                {!isEditMode && (
                    <div className="form-group">
                        <label htmlFor="createdBy">Your Name (Optional)</label>
                        <input
                            type="text"
                            id="createdBy"
                            name="createdBy"
                            value={formData.createdBy}
                            onChange={handleChange}
                            placeholder="Leave blank for Anonymous"
                        />
                    </div>
                )}

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => navigate('/tickets')}
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={loading}
                    >
                        <FaSave /> {loading ? 'Saving...' : isEditMode ? 'Update Ticket' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
