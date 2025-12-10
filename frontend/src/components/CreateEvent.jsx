import React, { useState } from "react";
import { createEvent } from "../api/eventApi";

const CreateEvent = ({ username, onEventCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEvent({ title, description, eventDate, location, link, createdBy: username });
            alert('Event created!');
            setTitle("");
            setDescription("");
            setEventDate("");
            setLocation("");
            setLink("");
            onEventCreated(); // refresh event list
        } catch (err) {
            alert('Error creating event');
        }
    };

    return (
        <div className="container">
            <h2>Share a New Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location (optional for online)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Webinar Link (optional)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
