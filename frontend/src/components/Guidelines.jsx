import React from "react";
import './Styles/Guidelines.css'; // Create new CSS file for Guidelines page

const Guidelines = () => {
    return (
        <div className="container guidelines">
            <h1>Community Guidelines & Code of Conduct</h1>
            <p>Welcome to the Cloud Kitchen Community! To maintain a supportive and productive environment, please follow these rules:</p>

            <ul className="guidelines-list">
                <li>✅ Respect everyone's kitchen, ideas, and opinions.</li>
                <li>🚫 No advertising, promotions, or spam without admin permission.</li>
                <li>✅ Keep discussions relevant to food, kitchen management, delivery, and cloud kitchen operations.</li>
                <li>🚫 No offensive, abusive, or inappropriate language will be tolerated.</li>
                <li>✅ Collaborate, help others, and share your best practices freely.</li>
                <li>✅ Report any misconduct or suspicious activity to moderators immediately.</li>
                <li>🚫 No discrimination based on race, gender, age, or profession.</li>
                <li>✅ Protect confidential business information; avoid sharing private data.</li>
            </ul>

            <p className="guidelines-thankyou">
                🙏 Thank you for helping us build a positive and thriving community!
            </p>
        </div>
    );
};

export default Guidelines;
