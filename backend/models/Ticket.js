const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    category: {
        type: String,
        enum: ['Technical', 'Billing', 'General', 'Feature Request', 'Bug Report', 'Delivery Issue', 'Meal Quality', 'Packaging Issue', 'Order Issue', 'Payment Issue'],
        default: 'General'
    },
    assignedTo: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        default: 'Anonymous'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    }
});

// Update the updatedAt field before saving
ticketSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
