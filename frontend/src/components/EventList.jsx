import React, { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/eventApi";
import { FaArrowLeft } from 'react-icons/fa';
import '../Styles/event.css';
import { useNavigate } from 'react-router-dom';

const EventList = ({ username }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await getEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading events', err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id);
            await fetchEvents();
        } catch (err) {
            console.error('Error deleting event', err);
            alert('Could not delete event');
        }
    };

    const getStatus = (eventDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const event = new Date(eventDate);
        event.setHours(0, 0, 0, 0);
        
        const todayTime = today.getTime();
        const eventTime = event.getTime();
        
        if (eventTime < todayTime) return 'completed';
        if (eventTime === todayTime) return 'ongoing';
        return 'upcoming';
    };

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        return getStatus(event.eventDate) === filter;
    });

    const formatDate = (dateString) => {
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="container">
            <div className="header">
                <button className="back-btn" onClick={() => navigate('/forumPage')}>
                    <FaArrowLeft />
                    <span>Back to Forum</span>
                </button>
                <h2>Event Management</h2>
                <p className="header-subtitle">Discover and manage upcoming events</p>
            </div>
            
            <div className="top-bar">
                <div className="filter-group" style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Events
                    </button>
                    <button 
                        className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button 
                        className={`btn ${filter === 'ongoing' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('ongoing')}
                    >
                        Today's Events
                    </button>
                </div>
                <button className="create-btn" onClick={() => navigate('/events/new')}>
                    Create New Event
                </button>
            </div>
            
            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading events...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h3>No events found</h3>
                    <p>
                        {filter !== 'all' 
                            ? `No ${filter} events at the moment. Try changing the filter.`
                            : "There are no events scheduled yet. Be the first to create one!"
                        }
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/events/new')}>
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                        Showing {filteredEvents.length} of {events.length} events
                    </div>
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <div key={event._id} className="event-card">
                                <div className="event-header">
                                    <div className="event-date">
                                        {formatDate(event.eventDate)}
                                    </div>
                                    <span className={`status-badge status-${getStatus(event.eventDate)}`}>
                                        {getStatus(event.eventDate)}
                                    </span>
                                </div>
                                
                                <h3 className="event-title">{event.title}</h3>
                                <p className="event-description">{event.description}</p>
                                
                                <div className="event-details">
                                    {event.location && (
                                        <div className="event-detail location">
                                            {event.location}
                                        </div>
                                    )}
                                    {event.link && (
                                        <div className="event-detail link">
                                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
                                                Join Event
                                            </a>
                                        </div>
                                    )}
                                    {event.createdBy && (
                                        <div className="event-detail creator">
                                            Organized by: {event.createdBy}
                                        </div>
                                    )}
                                </div>
                                
                                {(!username || event.createdBy === username) && (
                                    <div className="event-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => navigate(`/events/edit/${event._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventList;