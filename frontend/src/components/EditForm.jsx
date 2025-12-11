import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../Styles/EditForm1.css'

function EditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState({ title: '', description: '', category: '' });
    const [errors, setErrors] = useState({ title: '', description: '', category: '' });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/topics/${id}`)
            .then(res => {
                const payload = res?.data?.data ?? res?.data ?? {};
                setTopic(payload);
            })
            .catch(err => console.error("Error fetching topic:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTopic({ ...topic, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = '';
        if (value.trim() === '') {
            errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };

    const isFormValid = () => {
        return !Object.values(errors).some(error => error !== '') &&
               topic.title.trim() !== '' &&
               topic.description.trim() !== '' &&
               topic.category.trim() !== '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }
        axios.put(`http://localhost:5000/api/topics/${id}`, topic)
            .then(() => {
                navigate('/forumPage');
            })
            .catch(err => console.error("Error updating topic:", err));
    };

    return (
        <div className="edit-form">
            <div className="edit-form-header">
                <button className="back-btn" onClick={() => navigate('/forumPage')}>
                    <FaArrowLeft />
                    <span>Back to Forum</span>
                </button>
                <h1 className="edit-form__title">Edit Topic</h1>
            </div>
            <form onSubmit={handleSubmit} className="edit-form__form">
                <label className="edit-form__label">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    className="edit-form__input" 
                    value={topic.title} 
                    onChange={handleChange} 
                    required 
                />
                {errors.title && <span className="edit-form__error">{errors.title}</span>}

                <label className="edit-form__label">Description</label>
                <textarea 
                    name="description" 
                    className="edit-form__textarea" 
                    value={topic.description} 
                    onChange={handleChange} 
                    required 
                />
                {errors.description && <span className="edit-form__error">{errors.description}</span>}

                <label className="edit-form__label">Category</label>
                <input 
                    type="text" 
                    name="category" 
                    className="edit-form__input" 
                    value={topic.category} 
                    onChange={handleChange} 
                    required 
                />
                {errors.category && <span className="edit-form__error">{errors.category}</span>}

                <div className="edit-form__button-group">
                    <button 
                        type="button" 
                        className="edit-form__button edit-form__button--cancel" 
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="edit-form__button edit-form__button--save" 
                        disabled={!isFormValid()}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditForm;
