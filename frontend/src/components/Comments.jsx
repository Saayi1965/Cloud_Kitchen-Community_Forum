import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaComment, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import "../Styles/Comments.css";

function EditDeleteTopic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [relevantTopics, setRelevantTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    // Fetch topic details
    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/topics/${id}`);
                const payload = res?.data?.data ?? res?.data ?? null;
                setTopic(payload);
                setComments(payload?.comments || []);
            } catch (error) {
                console.error("Error fetching topic:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopic();
    }, [id]);

    // Fetch relevant topics
    useEffect(() => {
        if (topic) {
            const fetchRelevantTopics = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/topics');
                    const list = res?.data?.data ?? res?.data ?? [];
                    const filteredTopics = (Array.isArray(list) ? list : []).filter(t => t.category === topic.category && t._id !== id);
                    setRelevantTopics(filteredTopics);
                } catch (error) {
                    console.error("Error fetching topics:", error);
                }
            };

            fetchRelevantTopics();
        }
    }, [topic, id]);

    // Handle topic deletion
    const handleDelete = useCallback(async () => {
        try {
            await axios.delete(`http://localhost:5000/api/topics/${id}`);
            navigate('/');
        } catch (error) {
            console.error("Error deleting topic:", error);
        }
    }, [id, navigate]);

    // Navigate to edit form
    const handleEdit = useCallback(() => {
        navigate(`/edit-form/${id}`);
    }, [id, navigate]);

    // Handle new comment submission
    const handleAddComment = useCallback(async () => {
        if (newComment.trim() !== '') {
            try {
                const userId = localStorage.getItem('userId') || 'user_' + Date.now();
                const res = await axios.post(`http://localhost:5000/api/topics/${id}/comments`, {
                    user: userId,
                    content: newComment
                });

                if (res.data.success) {
                    // Refetch topic to get updated comments with IDs
                    const topicRes = await axios.get(`http://localhost:5000/api/topics/${id}`);
                    const payload = topicRes?.data?.data ?? topicRes?.data ?? null;
                    setComments(payload?.comments || []);
                    setNewComment('');
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                alert('Failed to add comment. Please try again.');
            }
        }
    }, [newComment, id]);

    // Handle edit comment
    const handleEditComment = useCallback((commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditedContent(currentContent);
    }, []);

    // Handle save edited comment
    const handleSaveEdit = useCallback(async (commentId) => {
        if (editedContent.trim() !== '') {
            try {
                const res = await axios.put(`http://localhost:5000/api/topics/${id}/comments/${commentId}`, {
                    content: editedContent
                });

                if (res.data.success) {
                    setComments(prevComments =>
                        prevComments.map(comment =>
                            comment._id === commentId
                                ? { ...comment, content: editedContent }
                                : comment
                        )
                    );
                    setEditingCommentId(null);
                    setEditedContent('');
                }
            } catch (error) {
                console.error("Error updating comment:", error);
                alert('Failed to update comment. Please try again.');
            }
        }
    }, [editedContent, id]);

    // Handle cancel edit
    const handleCancelEdit = useCallback(() => {
        setEditingCommentId(null);
        setEditedContent('');
    }, []);

    // Handle delete comment
    const handleDeleteComment = useCallback(async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/topics/${id}/comments/${commentId}`);

                if (res.data.success) {
                    setComments(prevComments =>
                        prevComments.filter(comment => comment._id !== commentId)
                    );
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert('Failed to delete comment. Please try again.');
            }
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container-main">
            {topic ? (
                <>
                    <div className="topic-header">
                        <button className="back-btn" onClick={() => navigate('/forumPage')}>
                            <FaArrowLeft />
                            <span>Back to Forum</span>
                        </button>
                        <h1 className="header-title">{topic.title}</h1>
                        <div className="topic-meta-row">
                            <span className="badge-category">{topic.category}</span>
                            <span className="comment-count">
                                <FaComment /> {comments.length}
                            </span>
                        </div>
                    </div>

                    <div className="topic-description-card">
                        <p className="description-text">{topic.description}</p>
                    </div>

                    {/* Comments Page Core */}
                    <section className="cards-section">
                        <h2 className="section-title">Comments ({comments.length})</h2>
                        <div className="cards-grid">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <article key={comment._id} className="card box-comment">
                                        {editingCommentId === comment._id ? (
                                            <div className="comment-edit-mode">
                                                <textarea 
                                                    className="input-comment-edit"
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="comment-edit-actions">
                                                    <button 
                                                        className="button-save-comment" 
                                                        onClick={() => handleSaveEdit(comment._id)}
                                                    >
                                                        <FaSave /> Save
                                                    </button>
                                                    <button 
                                                        className="button-cancel-comment" 
                                                        onClick={handleCancelEdit}
                                                    >
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="card-content">{comment.content}</div>
                                                <div className="comment-meta">
                                                    <span className="comment-author">{comment.user}</span>
                                                    <span className="comment-date">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="comment-actions">
                                                    <button 
                                                        className="button-edit-comment"
                                                        onClick={() => handleEditComment(comment._id, comment.content)}
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        className="button-delete-comment"
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <article className="card empty-card">
                                    <div className="card-content">No comments yet.</div>
                                </article>
                            )}
                        </div>
                        <div className="reply-editor-card">
                            <textarea 
                                className="input-comment"
                                value={newComment} 
                                onChange={(e) => setNewComment(e.target.value)} 
                                placeholder="Write your reply..."
                            />
                            <div className="reply-actions">
                                <button className="button-submit" onClick={handleAddComment}>Submit Reply</button>
                            </div>
                        </div>
                    </section>

                    <div className="buttons-actions">
                        <button className="button-edit" onClick={handleEdit}>Edit</button>
                        <button className="button-delete" onClick={handleDelete}>Delete</button>
                    </div>

                    {/* Relevant Topics */}
                    <section className="cards-section">
                        <h2 className="section-title">Relevant Topics</h2>
                        {relevantTopics.length > 0 ? (
                            relevantTopics.map(rt => (
                                <div 
                                    key={rt._id} 
                                    className="card-topic"
                                    onClick={() => navigate(`/EditDelete/${rt._id}`)}
                                >
                                    <h3>{rt.title}</h3>
                                    <p>{rt.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No related topics found.</p>
                        )}
                    </section>
                </>
            ) : (
                <p>Topic not found.</p>
            )}
        </div>
    );
}

export default EditDeleteTopic;
