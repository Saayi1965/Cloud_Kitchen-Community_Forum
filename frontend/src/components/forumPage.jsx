import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaBell, 
  FaSearch, 
  FaFire, 
  FaClock, 
  FaThumbsUp, 
  FaComment, 
  FaEdit, 
  FaTrash,
  FaShare,
  FaFilter,
  FaChevronRight,
  FaUsers,
  FaComments,
  FaBook,
  FaUtensils,
  FaChartLine,
  FaLightbulb,
  FaTrophy,
  FaEye,
  FaUserCircle,
  FaPlus,
  FaCalendarAlt,
  FaPoll,
  FaChartBar,
  FaCog,
  FaStar,
  FaTicketAlt,
  FaAcquisitionsIncorporated,
  FaAngry
} from 'react-icons/fa';
import '../Styles/forumPage.css';

function ForumPage() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Topics');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(3);
    const [userStats, setUserStats] = useState({
        posts: 12,
        comments: 45,
        likes: 128,
        level: 'Master Chef'
    });
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchTopics();
        fetchStats();
    }, []);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/topics?limit=100');
            const payload = res?.data?.data ?? res?.data ?? [];
            setTopics(Array.isArray(payload) ? payload : []);
        } catch (err) {
            console.error("Error fetching topics:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/topics/stats/summary');
            if (res.data.success) {
                // Update stats from API response
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const filteredTopics = useMemo(() => {
        let results = topics.filter(topic => {
            const matchesSearch = searchQuery === '' || 
                topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'All Topics' || 
                topic.category === selectedCategory;
            
            // Filter by status
            if (activeFilter === 'featured') {
                return matchesSearch && matchesCategory && topic.isFeatured;
            } else if (activeFilter === 'trending') {
                const trendingThreshold = Math.max(...topics.map(t => t.likes || 0)) * 0.7;
                return matchesSearch && matchesCategory && (topic.likes || 0) >= trendingThreshold;
            } else if (activeFilter === 'unanswered') {
                return matchesSearch && matchesCategory && (!topic.comments || topic.comments.length === 0);
            }
            
            return matchesSearch && matchesCategory;
        });

        switch(sortBy) {
            case 'popular':
                return results.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            case 'most-commented':
                return results.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
            case 'trending':
                return results.sort((a, b) => {
                    const scoreA = (a.likes || 0) + (a.comments?.length || 0) * 2;
                    const scoreB = (b.likes || 0) + (b.comments?.length || 0) * 2;
                    return scoreB - scoreA;
                });
            case 'newest':
                return results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            default:
                return results;
        }
    }, [topics, searchQuery, selectedCategory, sortBy, activeFilter]);

    const handleLike = async (topicId, e) => {
        e.stopPropagation();
        try {
            const userId = localStorage.getItem('userId') || 'user_' + Date.now();
            await axios.post(`http://localhost:5000/api/topics/${topicId}/like`, { userId });
            
            setTopics(prevTopics => 
                prevTopics.map(topic => {
                    if (topic._id === topicId) {
                        const hasLiked = topic.likedBy?.includes(userId);
                        return { 
                            ...topic, 
                            likes: hasLiked ? Math.max(0, (topic.likes || 0) - 1) : (topic.likes || 0) + 1,
                            likedBy: hasLiked 
                                ? (topic.likedBy || []).filter(id => id !== userId)
                                : [...(topic.likedBy || []), userId]
                        };
                    }
                    return topic;
                })
            );
            
            setUserStats(prev => ({
                ...prev,
                likes: prev.likes + 1
            }));
        } catch (err) {
            console.error("Error liking topic:", err);
        }
    };

    const handleDelete = async (topicId, e) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this topic?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/topics/${topicId}`);
            setTopics(prevTopics => prevTopics.filter(topic => topic._id !== topicId));
        } catch (err) {
            console.error("Error deleting topic:", err);
        }
    };

    const handleTopicClick = (topicId) => {
        navigate(`/topic/${topicId}`);
    };

    const handleShare = async (topic, e) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: topic.title,
                    text: topic.description,
                    url: `${window.location.origin}/topic/${topic._id}`
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/topic/${topic._id}`);
            // Show toast notification
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const showToast = (message, type) => {
        // Implement toast notification
        console.log(`${type}: ${message}`);
    };

    const categories = [
        { name: 'All Topics', icon: <FaBook />, count: topics.length, color: '#ED9121', gradient: 'linear-gradient(135deg, #ED9121, #FFB347)' },
        { name: 'Recipe Requests', icon: <FaUtensils />, count: topics.filter(t => t.category === 'Recipe Requests').length, color: '#FF6B35', gradient: 'linear-gradient(135deg, #FF6B35, #FF9E1F)' },
        { name: 'Cooking Tips', icon: <FaLightbulb />, count: topics.filter(t => t.category === 'Cooking Tips').length, color: '#00A8B5', gradient: 'linear-gradient(135deg, #00A8B5, #43AA8B)' },
        { name: 'Food Delivery', icon: '🚚', count: topics.filter(t => t.category === 'Food Delivery').length, color: '#774936', gradient: 'linear-gradient(135deg, #774936, #A86437)' },
        { name: 'Reviews', icon: <FaStar />, count: topics.filter(t => t.category === 'Reviews').length, color: '#F9C74F', gradient: 'linear-gradient(135deg, #F9C74F, #FFD166)' },
        { name: 'Kitchen Equipment', icon: '🔪', count: topics.filter(t => t.category === 'Kitchen Equipment').length, color: '#43AA8B', gradient: 'linear-gradient(135deg, #43AA8B, #90BE6D)' },
        { name: 'Meal Planning', icon: <FaCalendarAlt />, count: topics.filter(t => t.category === 'Meal Planning').length, color: '#277DA1', gradient: 'linear-gradient(135deg, #277DA1, #00A8B5)' },
        { name: 'Special Diets', icon: '🥗', count: topics.filter(t => t.category === 'Special Diets').length, color: '#90BE6D', gradient: 'linear-gradient(135deg, #90BE6D, #43AA8B)' },
    ];

    const popularTopics = topics
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5);

    const trendingTopics = topics
        .sort((a, b) => {
            const scoreA = (a.likes || 0) + (a.comments?.length || 0) * 2;
            const scoreB = (b.likes || 0) + (b.comments?.length || 0) * 2;
            return scoreB - scoreA;
        })
        .slice(0, 3);

    const totalComments = topics.reduce((sum, topic) => sum + (topic.comments?.length || 0), 0);
    const totalLikes = topics.reduce((sum, topic) => sum + (topic.likes || 0), 0);
    const totalViews = topics.reduce((sum, topic) => sum + (topic.views || 0), 0);

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const formatNumber = (num) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toString();
    };

    return (
        <div className="forum-container">
            {/* Animated Background Elements */}
            <div className="animated-bg-elements">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
                <div className="bg-particle particle-1"></div>
                <div className="bg-particle particle-2"></div>
                <div className="bg-particle particle-3"></div>
            </div>

            {/* Header */}
            <header className="forum-header">
                <div className="header-left">
                    <div className="logo-container" onClick={() => navigate('/')}>
                        <div className="logo-icon">
                            <span className="logo-gradient">🍳</span>
                        </div>
                        <div className="logo-text">
                            <h1 className="forum-logo">KitchenLinks</h1>
                            <p className="forum-subtitle">Professional Culinary Network</p>
                        </div>
                    </div>
                </div>
                
                
                <div className="header-right">
                    <div className="header-actions">
                        <button className="btn btn-ghost" onClick={() => navigate('/tickets')}>
                                <FaTicketAlt />
                                <span>Tickets</span>
                            </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/guidelines')}>
                                <FaBook />
                                <span>Guidelines</span>
                            </button>
                        <button 
                            className="btn btn-ghost"
                            onClick={() => navigate('/events')}
                        >
                            <FaCalendarAlt />
                            <span>Events</span>
                        </button>
                                                                 
                        <button 
                            className="btn btn-primary create-post-btn"
                            onClick={() => navigate('/create-topic')}
                        >
                            <FaPlus />
                            <span>New Post</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <FaTrophy />
                            <span>Top Culinary Community 2024</span>
                        </div>
                        <h2>Where Culinary Experts Connect & Collaborate</h2>
                        <p>Join 10,000+ professional chefs, food bloggers, and culinary innovators sharing knowledge, recipes, and industry insights.</p>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaComments />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{formatNumber(topics.length)}</span>
                                <span className="stat-label">Active Discussions</span>
                            </div>
                        
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaThumbsUp />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{formatNumber(totalLikes)}</span>
                                <span className="stat-label">Community Likes</span>
                            </div>
                            
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaUsers />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Active Members</span>
                            </div>
                            
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaEye />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{formatNumber(totalViews)}</span>
                                <span className="stat-label">Monthly Views</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-section quick-actions">
                        <div className="section-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="action-buttons">
                            <button className="action-btn" onClick={() => navigate('/create-topic')}>
                                <FaPlus />
                                <span>Create Post</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/tickets')}>
                                <FaTicketAlt />
                                <span>Tickets</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/guidelines')}>
                                <FaBook />
                                <span>Guidelines</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/events')}>
                                <FaCalendarAlt />
                                <span>Events</span>
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-section categories-section">
                        <div className="section-header">
                            <h3>Categories</h3>
                            <p>Browse by topic</p>
                        </div>
                        
                        <div className="category-list">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    style={{ background: selectedCategory === cat.name ? cat.gradient : 'transparent' }}
                                >
                                    <div className="category-icon-wrapper">
                                        {cat.icon}
                                    </div>
                                    <span className="category-name">{cat.name}</span>
                                    <span className="category-count">{cat.count}</span>
                                    {selectedCategory === cat.name && (
                                        <div className="active-indicator">
                                            <FaChevronRight />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section trending-section">
                        <div className="section-header">
                            <FaFire className="fire-icon" />
                            <h3>Trending Now</h3>
                        </div>
                        <div className="trending-list">
                            {trendingTopics.map((topic, index) => (
                                <div 
                                    key={topic._id}
                                    className="trending-item"
                                    onClick={() => handleTopicClick(topic._id)}
                                >
                                    <div className="trending-rank">
                                        <div className="rank-badge">{index + 1}</div>
                                    </div>
                                    <div className="trending-content">
                                        <h5>{topic.title}</h5>
                                        <div className="trending-stats">
                                            <span className="trending-stat">
                                                <FaThumbsUp /> {formatNumber(topic.likes || 0)}
                                            </span>
                                            <span className="trending-stat">
                                                <FaComment /> {formatNumber(topic.comments?.length || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="trending-arrow">
                                        <FaChevronRight />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section community-stats">
                        <div className="section-header">
                            <h3>Community Stats</h3>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-value">{formatNumber(totalComments)}</div>
                                <div className="stat-label">Comments</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{formatNumber(totalLikes)}</div>
                                <div className="stat-label">Likes</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{formatNumber(topics.length)}</div>
                                <div className="stat-label">Topics</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">98%</div>
                                <div className="stat-label">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="forum-content">
                    {/* Content Header */}
                    <div className="content-header">
                        <div className="header-left">
                            <div className="breadcrumb">
                                <span>Forum</span>
                                <FaChevronRight />
                                <span className="current-page">{selectedCategory}</span>
                            </div>
                            <h2>{selectedCategory}</h2>
                            <p className="results-count">
                                Showing {filteredTopics.length} of {topics.length} discussions
                            </p>
                        </div>
                        
                        <div className="header-controls">
                            <div className="filter-tabs">
                                <button 
                                    className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    All Posts
                                </button>
                                <button 
                                    className={`filter-tab ${activeFilter === 'featured' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('featured')}
                                >
                                    <FaStar /> Featured
                                </button>
                                <button 
                                    className={`filter-tab ${activeFilter === 'trending' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('trending')}
                                >
                                    <FaFire /> Trending
                                </button>
                                <button 
                                    className={`filter-tab ${activeFilter === 'unanswered' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('unanswered')}
                                >
                                    Unanswered
                                </button>
                            </div>
                            
                            <div className="sort-controls">
                                <div className="sort-dropdown">
                                    <FaFilter className="filter-icon" />
                                    <select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="popular">Most Popular</option>
                                        <option value="most-commented">Most Discussed</option>
                                        <option value="trending">Trending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search discussions, recipes, or techniques..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button 
                                    className="clear-search"
                                    onClick={() => setSearchQuery('')}
                                >
                                    ✕
                                </button>
                            )}
                            <button className="search-btn">Search</button>
                        </div>
                        <div className="search-tags">
                            <span className="tag-suggestion">Popular: </span>
                            {['vegetarian', 'beginner', 'italian', 'sous vide', 'meal prep'].map(tag => (
                                <button 
                                    key={tag}
                                    className="tag-btn"
                                    onClick={() => setSearchQuery(tag)}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-container">
                                <div className="spinner"></div>
                                <div className="spinner-text">Loading culinary discussions...</div>
                            </div>
                        </div>
                    ) : filteredTopics.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-illustration">
                                <div className="empty-icon">🍳</div>
                                <div className="empty-particles">
                                    <div className="particle"></div>
                                    <div className="particle"></div>
                                    <div className="particle"></div>
                                </div>
                            </div>
                            <h3>No discussions found</h3>
                            <p>Try adjusting your search or start a new discussion in this category</p>
                            <div className="empty-actions">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All Topics');
                                    }}
                                >
                                    Clear Filters
                                </button>
                                <button 
                                    className="btn btn-outline"
                                    onClick={() => navigate('/create-topic')}
                                >
                                    Start New Discussion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="discussions-grid">
                            {filteredTopics.map((topic) => (
                                <div 
                                    className="discussion-card"
                                    key={topic._id}
                                    onClick={() => handleTopicClick(topic._id)}
                                    data-featured={topic.isFeatured}
                                >
                                    {topic.isFeatured && (
                                        <div className="featured-badge">
                                            <FaStar /> Featured
                                        </div>
                                    )}
                                    
                                    <div className="card-header">
                                        <div className="author-info">
                                            <div className="author-avatar">
                                                <FaUserCircle />
                                            </div>
                                            <div className="author-details">
                                                <span className="author-name">{topic.author || 'Anonymous Chef'}</span>
                                                <span className="post-time">
                                                    <FaClock /> {getTimeAgo(topic.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="topic-meta">
                                            <span 
                                                className="topic-category"
                                                style={{ 
                                                    background: categories.find(c => c.name === topic.category)?.gradient || '#ED9121',
                                                    color: 'white'
                                                }}
                                            >
                                                {topic.category}
                                            </span>
                                            <span className="topic-type">{topic.type}</span>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <h3 className="topic-title">{topic.title}</h3>
                                        <p className="topic-preview">{topic.description}</p>
                                        
                                        {topic.tags && topic.tags.length > 0 && (
                                            <div className="topic-tags">
                                                {topic.tags.slice(0, 4).map(tag => (
                                                    <span key={tag} className="tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {topic.tags.length > 4 && (
                                                    <span className="tag-more">+{topic.tags.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <div className="topic-stats">
                                            <button 
                                                className={`stat-btn like-btn ${topic.likedBy?.includes(localStorage.getItem('userId')) ? 'liked' : ''}`}
                                                onClick={(e) => handleLike(topic._id, e)}
                                            >
                                                <FaThumbsUp />
                                                <span>{formatNumber(topic.likes || 0)}</span>
                                            </button>
                                            <button 
                                                className="stat-btn comment-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTopicClick(topic._id);
                                                }}
                                            >
                                                <FaComment />
                                                <span>{formatNumber(topic.comments?.length || 0)}</span>
                                            </button>
                                            <div className="stat-btn view-btn">
                                                <FaEye />
                                                <span>{formatNumber(topic.views || 0)}</span>
                                            </div>
                                            <button 
                                                className="stat-btn share-btn"
                                                onClick={(e) => handleShare(topic, e)}
                                            >
                                                <FaShare />
                                            </button>
                                        </div>

                                        <div className="topic-actions">
                                            <button 
                                                className="action-btnED"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/EditDelete/${topic._id}`);
                                                }}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="action-btnED"
                                                onClick={(e) => handleDelete(topic._id, e)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    {topic.attachment?.type !== 'none' && (
                                        <div className="attachment-preview">
                                            <div className="attachment-icon">
                                                {topic.attachment.type === 'image' && '🖼️'}
                                                {topic.attachment.type === 'video' && '🎬'}
                                                {topic.attachment.type === 'link' && '🔗'}
                                            </div>
                                            <span className="attachment-label">Contains {topic.attachment.type}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredTopics.length > 0 && (
                        <div className="pagination">
                            <button className="pagination-btn prev-btn" disabled>
                                Previous
                            </button>
                            <div className="pagination-pages">
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <span className="page-dots">...</span>
                                <button className="page-btn">10</button>
                            </div>
                            <button className="pagination-btn next-btn">
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Floating Action Button */}
            <button 
                className="fab"
                onClick={() => navigate('/create-topic')}
                title="Create New Discussion"
            >
                <span className="fab-icon">
                    <FaPlus />
                </span>
                <div className="fab-tooltip">Create New Post</div>
            </button>

            {/* Footer */}
            <footer className="forum-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>KitchenLinks</h4>
                        <p>Professional culinary community for chefs, food enthusiasts, and industry experts.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <a href="/guidelines">Community Guidelines</a>
                            <a href="/about">About Us</a>
                            <a href="/contact">Contact</a>
                            <a href="/privacy">Privacy Policy</a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Statistics</h4>
                        <div className="footer-stats">
                            <div className="footer-stat">
                                <span className="stat-value">{formatNumber(topics.length)}</span>
                                <span className="stat-label">Topics</span>
                            </div>
                            <div className="footer-stat">
                                <span className="stat-value">{formatNumber(totalComments)}</span>
                                <span className="stat-label">Comments</span>
                            </div>
                            <div className="footer-stat">
                                <span className="stat-value">10K+</span>
                                <span className="stat-label">Members</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 KitchenLinks. All rights reserved. Made with ❤️ for food lovers.</p>
                </div>
            </footer>
        </div>
    );
}

export default ForumPage;