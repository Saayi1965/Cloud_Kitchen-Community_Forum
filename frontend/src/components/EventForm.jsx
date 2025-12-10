import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEvent, updateEvent } from '../api/eventApi';
import '../Styles/event.css';

const EventForm = ({ usernameProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const username = usernameProp || localStorage.getItem('username') || 'testuser';

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const { data } = await getEvent(id);
        const ev = data ?? {};
        if (!mounted) return;
        setTitle(ev.title || '');
        setDescription(ev.description || '');
        setEventDate(ev.eventDate ? new Date(ev.eventDate).toISOString().slice(0, 10) : '');
        setLocation(ev.location || '');
        setLink(ev.link || '');
      } catch (err) {
        console.error('Error loading event:', err);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, eventDate, location, link, createdBy: username };
    try {
      if (id) {
        await updateEvent(id, payload);
        alert('Event updated');
      } else {
        await createEvent(payload);
        alert('Event created');
      }
      navigate('/events');
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Could not save event');
    }
  };

  return (
    <div className="container">
      <h2>{id ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="text" placeholder="Link" value={link} onChange={e => setLink(e.target.value)} />
        <div style={{ marginTop: 12 }}>
          <button type="submit">{id ? 'Update Event' : 'Create Event'}</button>
          <button type="button" style={{ marginLeft: 8 }} onClick={() => navigate('/events')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
