import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUtensils, 
  FaComments, 
  FaLightbulb, 
  FaShare, 
  FaTag, 
  FaChevronRight,
  FaImage,
  FaVideo,
  FaLink
} from 'react-icons/fa';
import axios from 'axios';
import '../Styles/createTopic.css';

const CreateTopic = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('Question');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [attachmentType, setAttachmentType] = useState('none');

    const navigate = useNavigate();

    const handleAddTag = () => {
        if (currentTag.trim() && tags.length < 5) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !category || !type) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post('http://localhost:5000/api/topics', {
                title,
                description,
                category,
                type,
                tags,
                attachmentType
            });

            setMessage({ 
                type: 'success', 
                text: '🎉 Topic created successfully! Redirecting...' 
            });
            
            setTimeout(() => {
                navigate('/forumPage');
            }, 2000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to create topic. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = [
        { value: 'Announcements', icon: '📢', color: '#ED9121' },
        { value: 'Recipe Requests', icon: '🍽️', color: '#FF6B35' },
        { value: 'Food Delivery', icon: '🚚', color: '#43AA8B' },
        { value: 'Reviews', icon: '⭐', color: '#F9C74F' },
        { value: 'Cooking Tips', icon: '👨‍🍳', color: '#00A8B5' },
        { value: 'Kitchen Equipments', icon: '🔪', color: '#774936' },
        { value: 'Meal Planning', icon: '📅', color: '#277DA1' },
        { value: 'Special Diets', icon: '🥗', color: '#90BE6D' }
    ];

    const topicTypes = [
        { value: 'Question', icon: <FaComments />, label: 'Question', description: 'Ask for help or advice' },
        { value: 'Conversation', icon: <FaUtensils />, label: 'Discussion', description: 'Start a food conversation' },
        { value: 'Tip', icon: <FaLightbulb />, label: 'Tip Share', description: 'Share cooking tips' },
        { value: 'Recipe', icon: <FaShare />, label: 'Recipe Share', description: 'Share your recipe' }
    ];

    return (
        <div className="create-topic-wrapper">
            {/* Background Layers */}
            <div className="background-layer main-bg"></div>
            <div className="background-layer overlay"></div>
            <div className="background-layer pattern"></div>
            
            <div className="create-topic-container">
                {/* Header */}
                <header className="create-header">
                    <button className="back-btn" onClick={() => navigate('/forumPage')}>
                        <FaArrowLeft />
                        <span>Back to Forum</span>
                    </button>
                    
                    <div className="header-content">
                        <div className="header-icon">🍳</div>
                        <div>
                            <h1>Start a New Discussion</h1>
                            <p>Share your culinary thoughts with the community</p>
                        </div>
                    </div>
                </header>

                {/* Message Alert */}
                {message.text && (
                    <div className={`message-alert ${message.type}`}>
                        <div className="alert-content">
                            <span className="alert-icon">
                                {message.type === 'success' ? '✅' : '⚠️'}
                            </span>
                            {message.text}
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="create-topic-form">
                    {/* Topic Type Selection */}
                    <section className="form-section type-selection">
                        <div className="section-header">
                            <h2><FaComments /> What would you like to share?</h2>
                            <p>Choose the purpose of your topic</p>
                        </div>
                        
                        <div className="type-grid">
                            {topicTypes.map((topicType) => (
                                <button
                                    key={topicType.value}
                                    type="button"
                                    className={`type-card ${type === topicType.value ? 'selected' : ''}`}
                                    onClick={() => setType(topicType.value)}
                                >
                                    <div className="type-icon">{topicType.icon}</div>
                                    <div className="type-content">
                                        <h3>{topicType.label}</h3>
                                        <p>{topicType.description}</p>
                                    </div>
                                    {type === topicType.value && (
                                        <div className="selected-indicator">
                                            <FaChevronRight />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Title Input */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>📝 Topic Title</h2>
                            <p>Write a clear and engaging title</p>
                        </div>
                        
                        <div className="input-group">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., 'Best way to cook sous vide steak?'"
                                className="title-input"
                                maxLength="100"
                            />
                            <div className="char-counter">{title.length}/100</div>
                        </div>
                    </section>

                    {/* Description Input */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>📋 Description</h2>
                            <p>Provide details about your topic</p>
                        </div>
                        
                        <div className="input-group">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Share your thoughts, questions, or recipes in detail..."
                                className="description-input"
                                rows="6"
                            />
                            <div className="editor-tools">
                                <button type="button" className="tool-btn"><strong>B</strong></button>
                                <button type="button" className="tool-btn"><em>I</em></button>
                                <button type="button" className="tool-btn">🔗</button>
                                <button type="button" className="tool-btn">📋</button>
                            </div>
                        </div>
                    </section>

                    {/* Category Selection */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>🏷️ Category</h2>
                            <p>Where should your topic appear?</p>
                        </div>
                        
                        <div className="category-grid">
                            {categoryOptions.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-btn ${category === cat.value ? 'selected' : ''}`}
                                    onClick={() => setCategory(cat.value)}
                                    style={{ '--category-color': cat.color }}
                                >
                                    <span className="category-icon">{cat.icon}</span>
                                    <span className="category-name">{cat.value}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Tags Input */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2><FaTag /> Tags</h2>
                            <p>Add tags to help others find your topic</p>
                        </div>
                        
                        <div className="tags-input-group">
                            <div className="tags-display">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag-item">
                                        #{tag}
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="remove-tag"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="tags-input-wrapper">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    placeholder="Add a tag (e.g., vegetarian, beginner, italian)"
                                    className="tag-input"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddTag}
                                    className="add-tag-btn"
                                    disabled={tags.length >= 5}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="tags-help">
                                <span>{5 - tags.length} tags remaining</span>
                                <span>Press Enter or click Add to insert</span>
                            </div>
                        </div>
                    </section>
                    
                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => navigate('/forumPage')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading || !title || !description || !category}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaShare />
                                    Publish Topic
                                </>
                            )}
                        </button>
                    </div>

                    {/* Form Help */}
                    <div className="form-help">
                        <div className="help-item">
                            <span className="help-icon">💡</span>
                            <span>Be specific and clear in your description</span>
                        </div>
                        <div className="help-item">
                            <span className="help-icon">🤝</span>
                            <span>Our community values respectful discussions</span>
                        </div>
                        <div className="help-item">
                            <span className="help-icon">📖</span>
                            <span>Check community guidelines before posting</span>
                        </div>
                    </div>
                </form>

                {/* Preview Sidebar */}
                <aside className="preview-sidebar">
                    <div className="preview-card">
                        <h3>Topic Preview</h3>
                        <div className="preview-content">
                            <div className="preview-header">
                                <div className="preview-category">
                                    {categoryOptions.find(c => c.value === category)?.icon || '📄'} 
                                    {category || 'No category selected'}
                                </div>
                                <div className="preview-type">{type}</div>
                            </div>
                            
                            <h4 className="preview-title">{title || 'Your title will appear here'}</h4>
                            
                            <p className="preview-description">
                                {description.substring(0, 150) || 'Topic description preview...'}
                                {description.length > 150 && '...'}
                            </p>
                            
                            <div className="preview-tags">
                                {tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="preview-tag">#{tag}</span>
                                ))}
                                {tags.length > 3 && (
                                    <span className="preview-tag">+{tags.length - 3}</span>
                                )}
                            </div>
                            
                            <div className="preview-stats">
                                <span className="stat">👍 0</span>
                                <span className="stat">💬 0</span>
                                <span className="stat">👁️ 0</span>
                            </div>
                        </div>
                    </div>

                    <div className="community-tips">
                        <h4>💡 Community Tips</h4>
                        <ul>
                            <li>Use descriptive titles</li>
                            <li>Add relevant tags</li>
                            <li>Include images when possible</li>
                            <li>Engage with responses</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CreateTopic;