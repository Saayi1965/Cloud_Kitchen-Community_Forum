const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// ==============================================
// Create a new event
// ==============================================
router.post('/', async (req, res) => {
    const { title, description, eventDate, location, link, createdBy } = req.body;

    if (!title || !description || !eventDate || !location) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const newEvent = new Event({ title, description, eventDate, location, link, createdBy });
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('❌ Error creating event:', error.message);
        res.status(500).json({ error: 'Internal server error while creating event.' });
    }
});

// ==============================================
// Get all events
// ==============================================
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 }); // Upcoming first
        res.status(200).json(events);
    } catch (error) {
        console.error('❌ Error fetching events:', error.message);
        res.status(500).json({ error: 'Internal server error while fetching events.' });
    }
});

// ==============================================
// Get event by ID
// ==============================================
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        console.error('❌ Error fetching event:', error.message);
        res.status(500).json({ error: 'Internal server error while fetching event.' });
    }
});

// ==============================================
// Update an event by ID
// ==============================================
router.put('/:id', async (req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event updated successfully', event: updated });
    } catch (error) {
        console.error('❌ Error updating event:', error.message);
        res.status(500).json({ error: 'Internal server error while updating event.' });
    }
});

// ==============================================
// Delete an event by ID
// ==============================================
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting event:', error.message);
        res.status(500).json({ error: 'Internal server error while deleting event.' });
    }
});

// ✅ Export router correctly
module.exports = router;
