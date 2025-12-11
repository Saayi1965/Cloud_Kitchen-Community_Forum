const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
});

const TopicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 200
    },
    description: { 
        type: String, 
        required: true,
        trim: true
    },
    category: { 
        type: String, 
        required: true,
        enum: [
            'Announcements', 
            'Recipe Requests', 
            'Food Delivery', 
            'Reviews', 
            'Cooking Tips', 
            'Kitchen Equipment', 
            'Meal Planning', 
            'Special Diets'
        ]
    },
    tags: { 
        type: [String], 
        default: [],
        validate: {
            validator: function(tags) {
                return tags.length <= 10;
            },
            message: 'Cannot have more than 10 tags'
        }
    },
    type: { 
        type: String, 
        enum: ['Question', 'Conversation', 'Tip', 'Recipe', 'Review', 'Discussion'], 
        required: true,
        default: 'Conversation'
    },
    author: {
        type: String,
        required: true,
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
    likes: { 
        type: Number, 
        default: 0 
    },
    views: {
        type: Number,
        default: 0
    },
    comments: {
        type: [CommentSchema],
        default: []
    },
    likedBy: { 
        type: [String], 
        default: [] 
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'archived'],
        default: 'active'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    attachment: {
        type: {
            type: String,
            enum: ['none', 'image', 'video', 'link'],
            default: 'none'
        },
        url: String,
        thumbnail: String
    }
});

// Update the updatedAt field before saving
TopicSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for better query performance
TopicSchema.index({ category: 1, createdAt: -1 });
TopicSchema.index({ tags: 1 });
TopicSchema.index({ isFeatured: 1 });
TopicSchema.index({ likes: -1 });

module.exports = mongoose.model('Topic', TopicSchema);