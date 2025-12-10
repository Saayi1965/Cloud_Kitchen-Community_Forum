const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// ============================================
// CREATE a New Ticket
// ============================================
router.post('/', async (req, res) => {
    try {
        const { subject, description, priority, category, createdBy } = req.body;

        if (!subject || !description) {
            return res.status(400).json({
                success: false,
                message: 'Subject and description are required'
            });
        }

        const newTicket = new Ticket({
            subject,
            description,
            priority: priority || 'Medium',
            category: category || 'General',
            createdBy: createdBy || 'Anonymous'
        });

        await newTicket.save();

        res.status(201).json({
            success: true,
            message: 'Ticket created successfully',
            data: newTicket
        });
    } catch (error) {
        console.error('❌ Error creating ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating ticket'
        });
    }
});

// ============================================
// GET All Tickets with Filtering
// ============================================
router.get('/', async (req, res) => {
    try {
        const { status, priority, category, sortBy = 'createdAt', order = 'desc' } = req.query;

        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const tickets = await Ticket.find(query).sort(sortOptions);

        res.status(200).json({
            success: true,
            data: tickets,
            count: tickets.length
        });
    } catch (error) {
        console.error('❌ Error fetching tickets:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching tickets'
        });
    }
});

// ============================================
// GET Single Ticket by ID
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.error('❌ Error fetching ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching ticket'
        });
    }
});

// ============================================
// UPDATE a Ticket
// ============================================
router.put('/:id', async (req, res) => {
    try {
        const { subject, description, priority, status, category, assignedTo } = req.body;

        const updateData = {
            updatedAt: Date.now()
        };

        if (subject) updateData.subject = subject;
        if (description) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (category) updateData.category = category;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        if (status) {
            updateData.status = status;
            if (status === 'Resolved' || status === 'Closed') {
                updateData.resolvedAt = Date.now();
            }
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: updatedTicket
        });
    } catch (error) {
        console.error('❌ Error updating ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating ticket'
        });
    }
});

// ============================================
// DELETE a Ticket
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

        if (!deletedTicket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting ticket'
        });
    }
});

// ============================================
// GET Ticket Statistics
// ============================================
router.get('/stats/summary', async (req, res) => {
    try {
        const total = await Ticket.countDocuments();
        const open = await Ticket.countDocuments({ status: 'Open' });
        const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
        const resolved = await Ticket.countDocuments({ status: 'Resolved' });
        const closed = await Ticket.countDocuments({ status: 'Closed' });
        
        const highPriority = await Ticket.countDocuments({ priority: 'High' });
        const criticalPriority = await Ticket.countDocuments({ priority: 'Critical' });

        res.status(200).json({
            success: true,
            data: {
                total,
                byStatus: { open, inProgress, resolved, closed },
                highPriority,
                criticalPriority
            }
        });
    } catch (error) {
        console.error('❌ Error fetching ticket stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching ticket statistics'
        });
    }
});

module.exports = router;
