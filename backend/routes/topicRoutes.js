const express = require('express');
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const router = express.Router();

// ============================================
// CREATE a New Topic
// ============================================
router.post('/', async (req, res) => {
    const { 
        title, 
        description, 
        category, 
        type, 
        tags, 
        author = 'Anonymous',
        attachment 
    } = req.body;

    if (!title || !description || !category || !type) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields (title, description, category, type) are required.' 
        });
    }

    try {
        const newTopic = new Topic({ 
            title, 
            description, 
            category, 
            type, 
            tags: tags || [],
            author,
            attachment: attachment || { type: 'none' }
        });
        
        await newTopic.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Topic created successfully', 
            data: newTopic 
        });
    } catch (error) {
        console.error('❌ Error creating topic:', error.message);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while creating topic.' 
        });
    }
});

// ============================================
// GET All Topics with Filtering and Pagination
// ============================================
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            type, 
            sortBy = 'createdAt', 
            order = 'desc',
            page = 1, 
            limit = 20,
            search,
            tags 
        } = req.query;

        let query = {};

        // Category filter
        if (category && category !== 'All Topics') {
            query.category = category;
        }

        // Type filter
        if (type) {
            query.type = type;
        }

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Tags filter
        if (tags) {
            const tagArray = tags.split(',');
            query.tags = { $in: tagArray.map(tag => new RegExp(tag.trim(), 'i')) };
        }

        // Sort options
        const sortOptions = {};
        const validSortFields = ['createdAt', 'updatedAt', 'likes', 'views', 'comments.length'];
        const validOrder = ['asc', 'desc'];
        
        if (validSortFields.includes(sortBy) && validOrder.includes(order)) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Topic.countDocuments(query);

        const topics = await Topic.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Increment views for popular sorting
        if (sortBy === 'views') {
            await Promise.all(
                topics.map(topic => 
                    Topic.findByIdAndUpdate(topic._id, { $inc: { views: 1 } })
                )
            );
        }

        res.status(200).json({
            success: true,
            data: topics,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching topics:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while fetching topics.' 
        });
    }
});

// ============================================
// GET Featured Topics
// ============================================
router.get('/featured', async (req, res) => {
    try {
        const featuredTopics = await Topic.find({ isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            success: true,
            data: featuredTopics
        });
    } catch (error) {
        console.error('❌ Error fetching featured topics:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while fetching featured topics.' 
        });
    }
});

// ============================================
// GET Trending Topics (Most liked in last 7 days)
// ============================================
router.get('/trending', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendingTopics = await Topic.find({
            createdAt: { $gte: sevenDaysAgo }
        })
        .sort({ likes: -1 })
        .limit(5);

        res.status(200).json({
            success: true,
            data: trendingTopics
        });
    } catch (error) {
        console.error('❌ Error fetching trending topics:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while fetching trending topics.' 
        });
    }
});

// ============================================
// GET a Single Topic by ID
// ============================================
router.get('/:id', async (req, res) => {
    try {
        // Increment view count
        await Topic.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        
        const topic = await Topic.findById(req.params.id);
        
        if (!topic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }
        
        res.status(200).json({
            success: true,
            data: topic
        });
    } catch (error) {
        console.error('❌ Error fetching topic:', error.message);
        
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid topic ID format.' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while fetching topic.' 
        });
    }
});

// ============================================
// UPDATE a Topic
// ============================================
router.put('/:id', async (req, res) => {
    const { 
        title, 
        description, 
        category, 
        type, 
        tags,
        status,
        attachment 
    } = req.body;

    if (!title || !description || !category || !type) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields (title, description, category, type) are required.' 
        });
    }

    try {
        const updateData = { 
            title, 
            description, 
            category, 
            type, 
            updatedAt: Date.now() 
        };

        if (tags) updateData.tags = tags;
        if (status) updateData.status = status;
        if (attachment) updateData.attachment = attachment;

        const updatedTopic = await Topic.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTopic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Topic updated successfully', 
            data: updatedTopic 
        });
    } catch (error) {
        console.error('❌ Error updating topic:', error.message);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while updating topic.' 
        });
    }
});

// ============================================
// DELETE a Topic
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
        
        if (!deletedTopic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Topic deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Error deleting topic:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while deleting topic.' 
        });
    }
});

// ============================================
// LIKE/UNLIKE a Topic
// ============================================
router.post('/:id/like', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ 
            success: false,
            message: 'User ID is required.' 
        });
    }

    try {
        const topic = await Topic.findById(req.params.id);
        
        if (!topic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }

        const hasLiked = topic.likedBy.includes(userId);
        
        if (hasLiked) {
            // Unlike
            topic.likes = Math.max(0, topic.likes - 1);
            topic.likedBy = topic.likedBy.filter(id => id !== userId);
        } else {
            // Like
            topic.likes += 1;
            topic.likedBy.push(userId);
        }

        await topic.save();

        res.status(200).json({
            success: true,
            message: hasLiked ? 'Topic unliked successfully' : 'Topic liked successfully',
            data: {
                likes: topic.likes,
                hasLiked: !hasLiked
            }
        });
    } catch (error) {
        console.error('❌ Error liking topic:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while liking topic.' 
        });
    }
});

// ============================================
// ADD COMMENT to a Topic
// ============================================
router.post('/:id/comments', async (req, res) => {
    const { user, content } = req.body;

    if (!user || !content) {
        return res.status(400).json({ 
            success: false,
            message: 'User and content are required for comments.' 
        });
    }

    try {
        const topic = await Topic.findById(req.params.id);
        
        if (!topic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }

        const newComment = {
            user,
            content,
            createdAt: new Date()
        };

        topic.comments.push(newComment);
        topic.updatedAt = new Date();
        
        await topic.save();

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: newComment
        });
    } catch (error) {
        console.error('❌ Error adding comment:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while adding comment.' 
        });
    }
});

// ============================================
// LIKE a Comment
// ============================================
router.post('/:topicId/comments/:commentId/like', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ 
            success: false,
            message: 'User ID is required.' 
        });
    }

    try {
        const topic = await Topic.findById(req.params.topicId);
        
        if (!topic) {
            return res.status(404).json({ 
                success: false,
                message: 'Topic not found.' 
            });
        }

        const comment = topic.comments.id(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: 'Comment not found.' 
            });
        }

        comment.likes += 1;
        await topic.save();

        res.status(200).json({
            success: true,
            message: 'Comment liked successfully',
            data: comment
        });
    } catch (error) {
        console.error('❌ Error liking comment:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while liking comment.' 
        });
    }
});

// ============================================
// GET Statistics
// ============================================
router.get('/stats/summary', async (req, res) => {
    try {
        const totalTopics = await Topic.countDocuments();
        const totalComments = await Topic.aggregate([
            { $unwind: "$comments" },
            { $count: "totalComments" }
        ]);
        const popularCategory = await Topic.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalTopics,
                totalComments: totalComments[0]?.totalComments || 0,
                popularCategory: popularCategory[0]?._id || 'N/A'
            }
        });
    } catch (error) {
        console.error('❌ Error fetching statistics:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while fetching statistics.' 
        });
    }
});

// ============================================
// SEARCH Topics
// ============================================
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        
        const topics = await Topic.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: topics
        });
    } catch (error) {
        console.error('❌ Error searching topics:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error while searching topics.' 
        });
    }
});

module.exports = router;