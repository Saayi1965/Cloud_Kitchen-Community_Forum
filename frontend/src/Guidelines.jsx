import React from "react";
import { FaHeart, FaHandshake, FaComments, FaShieldAlt, FaUsers, FaLightbulb, FaRegSmile, FaSeedling } from "react-icons/fa";
import './Styles/Guidelines.css';

const Guidelines = () => {
    const guidelines = [
        {
            icon: <FaHandshake />,
            title: "Respect & Inclusion",
            description: "Respect everyone's kitchen, ideas, opinions, and cultural differences.",
            color: "#ED9121",
            emoji: "🤝"
        },
        {
            icon: <FaComments />,
            title: "Stay On Topic",
            description: "Keep discussions focused on food, kitchen management, cloud kitchens, and related topics.",
            color: "#43AA8B",
            emoji: "🍳"
        },
        {
            icon: <FaShieldAlt />,
            title: "No Harassment",
            description: "Avoid using offensive, abusive, or discriminatory language in any form.",
            color: "#FF6B35",
            emoji: "🛡️"
        },
        {
            icon: <FaLightbulb />,
            title: "Share Knowledge",
            description: "Help others, share knowledge freely, and support the growth of the community.",
            color: "#F9C74F",
            emoji: "💡"
        },
        {
            icon: <FaUsers />,
            title: "Professional Environment",
            description: "Maintain a welcoming, collaborative, and professional environment at all times.",
            color: "#277DA1",
            emoji: "👨‍🍳"
        },
        {
            icon: <FaRegSmile />,
            title: "Positive Contributions",
            description: "Focus on constructive feedback and positive contributions to discussions.",
            color: "#90BE6D",
            emoji: "😊"
        },
        {
            icon: <FaHeart />,
            title: "Support Each Other",
            description: "Encourage and uplift fellow community members in their culinary journey.",
            color: "#FF6B6B",
            emoji: "❤️"
        },
        {
            icon: <FaSeedling />,
            title: "Grow Together",
            description: "We grow stronger together. Share your successes and learn from challenges.",
            color: "#774936",
            emoji: "🌱"
        }
    ];

    const policies = [
        "No advertising, promotions, or self-marketing without admin approval",
        "No posting of confidential or proprietary information without consent",
        "Report any inappropriate behavior to moderators immediately",
        "Keep discussions professional and relevant to cloud kitchens",
        "Respect intellectual property and give credit where due"
    ];

    return (
        <div className="guidelines-container">
            {/* Background Layers */}
            <div className="background-layer hero-bg"></div>
            <div className="background-layer pattern-overlay"></div>
            
            <div className="guidelines-content">
                {/* Header Section */}
                <header className="guidelines-header">
                    <div className="header-background">
                        <div className="header-overlay"></div>
                    </div>
                    <div className="header-content">
                        <div className="logo-badge">
                            <span className="logo-icon">🍳</span>
                            <h2>KitchenLinks</h2>
                        </div>
                        <h1 className="main-title">
                            Community Guidelines & 
                            <span className="highlight"> Code of Conduct</span>
                        </h1>
                        <p className="header-subtitle">
                            Building a thriving community of culinary professionals
                        </p>
                    </div>
                </header>

                {/* Welcome Section */}
                <section className="welcome-section">
                    <div className="welcome-card">
                        <div className="welcome-icon">👋</div>
                        <div className="welcome-text">
                            <h2>Welcome to Our Culinary Community!</h2>
                            <p>
                                We're excited to have you join our network of food enthusiasts, 
                                professional chefs, and cloud kitchen innovators. These guidelines 
                                help us maintain a positive, productive, and inspiring environment 
                                for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Guidelines Grid */}
                <section className="guidelines-grid-section">
                    <div className="section-header">
                        <h2>Our Community Principles</h2>
                        <p>Core values that guide our interactions</p>
                    </div>
                    
                    <div className="guidelines-grid">
                        {guidelines.map((guideline, index) => (
                            <div 
                                key={index}
                                className="guideline-card"
                                style={{ '--card-color': guideline.color }}
                            >
                                <div className="card-header">
                                    <div className="icon-wrapper" style={{ backgroundColor: `${guideline.color}20` }}>
                                        {guideline.icon}
                                    </div>
                                    <span className="emoji">{guideline.emoji}</span>
                                </div>
                                <h3>{guideline.title}</h3>
                                <p>{guideline.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Policies Section */}
                <section className="policies-section">
                    <div className="policies-card">
                        <div className="policies-header">
                            <div className="shield-icon">🛡️</div>
                            <h2>Community Policies</h2>
                        </div>
                        
                        <div className="policies-list">
                            {policies.map((policy, index) => (
                                <div key={index} className="policy-item">
                                    <div className="policy-check">✓</div>
                                    <span>{policy}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="policies-note">
                            <div className="note-icon">💬</div>
                            <p>
                                These policies ensure our community remains a safe, professional, 
                                and valuable space for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Final Commitment */}
                <section className="commitment-section">
                    <div className="commitment-card">
                        <div className="commitment-content">
                            <h2>Our Commitment to You</h2>
                            <p className="commitment-text">
                                By participating in this community, you agree to abide by these guidelines.  
                                Together, let's create a safe, supportive, and innovative space for all 
                                Cloud Kitchen enthusiasts! 🍽️
                            </p>
                            
                            <div className="commitment-stats">
                                <div className="stat">
                                    <div className="stat-number">100%</div>
                                    <div className="stat-label">Respectful Environment</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">Moderation Support</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">Together</div>
                                    <div className="stat-label">We Grow Stronger</div>
                                </div>
                            </div>
                            
                            <div className="signature">
                                <div className="signature-line"></div>
                                <p>The KitchenLinks Community Team</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <footer className="guidelines-footer">
                    <div className="footer-content">
                        <h3>Ready to Contribute?</h3>
                        <p>Join the conversation and share your culinary expertise with our community.</p>
                        <div className="footer-actions">
                            <button className="btn-primary">Browse Discussions</button>
                            <button className="btn-outline">Start New Topic</button>
                        </div>
                        <p className="footer-note">
                            Need help? Contact our moderation team anytime at 
                            <a href="mailto:community@kitchenlinks.com"> community@kitchenlinks.com</a>
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Guidelines;