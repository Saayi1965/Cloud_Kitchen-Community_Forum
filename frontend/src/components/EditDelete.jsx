import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "../Styles/EditDelete1.css";

function EditDeleteTopic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [relevantTopics, setRelevantTopics] = useState([]);
    const [loading, setLoading] = useState(true);

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
    const handleAddComment = useCallback(() => {
        if (newComment.trim() !== '') {
            setComments(prevComments => [...prevComments, newComment]);
            setNewComment('');
        }
    }, [newComment]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container-main">
            {topic ? (
                <>
                    <h1 className="header-title">{topic.title}</h1>
                    <p className="description-text">{topic.description}</p>
                    <span className="badge-category">{topic.category}</span>

                    <div className="buttons-actions">
                        <button className="button-edit" onClick={handleEdit}>Edit</button>
                        <button className="button-delete" onClick={handleDelete}>Delete</button>
                    </div>

                    {/* Comments Section */}
                    <div className="section-comments">
                        <h2>Replies</h2>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="box-comment">{comment}</div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                        <textarea 
                            className="input-comment"
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Write your reply..."
                        />
                        <button className="button-submit" onClick={handleAddComment}>Submit Reply</button>
                    </div>

                    {/* Relevant Topics Section */}
                    <div className="section-relevant">
                        <h2>Relevant Topics</h2>
                        {relevantTopics.length > 0 ? (
                            relevantTopics.map(topic => (
                                <div 
                                    key={topic._id} 
                                    className="card-topic"
                                    onClick={() => navigate(`/EditDelete/${topic._id}`)}
                                >
                                    <h3>{topic.title}</h3>
                                    <p>{topic.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No related topics found.</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Topic not found.</p>
            )}
        </div>
    );
}

export default EditDeleteTopic;
