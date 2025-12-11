import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/Guidelines.css";

const Guidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="guidelines-page">
      {/* Background hero layer */}
      <div className="hero-bg" aria-hidden="true" />

      <div className="guidelines-content container">
        <header className="guidelines-header">
          <div className="header-top">
            <button
              className="back-btn"
              onClick={() => navigate("/forumPage")}
              aria-label="Back to forum"
            >
              <FaArrowLeft />
              <span className="back-text">Back to Forum</span>
            </button>
          </div>

          <div className="header-main">
            <div className="logo-badge" aria-hidden="true">
              <div className="logo-icon">🍽️</div>
              <h2 className="logo-title">Cloud Kitchen Community</h2>
            </div>

            <h1 className="main-title">
              Community Guidelines &amp; <span className="highlight">Code of Conduct</span>
            </h1>

            <p className="header-subtitle">
              A welcoming space for home cooks, delivery partners, and cloud kitchen operators.
              Please read and follow the guidelines to keep the community respectful, safe, and helpful.
            </p>
          </div>
        </header>

        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon" aria-hidden="true">👋</div>
            <div className="welcome-text">
              <h3>Welcome to our community!</h3>
              <p>
                This space is for sharing recipes, delivery tips, kitchen best practices, and
                collaborative problem solving. Respect others and keep posts focused on food and
                operations.
              </p>
            </div>
          </div>
        </section>

        <section className="guidelines-list-section">
          <ul className="guidelines-list" role="list">
            <li><span className="li-emoji">✅</span> Respect everyone's kitchen, ideas, and opinions.</li>
            <li><span className="li-emoji">🚫</span> No advertising, promotions, or spam without admin permission.</li>
            <li><span className="li-emoji">✅</span> Keep discussions relevant to food, kitchen management, delivery, and cloud kitchen operations.</li>
            <li><span className="li-emoji">🚫</span> No offensive, abusive, or inappropriate language will be tolerated.</li>
            <li><span className="li-emoji">✅</span> Collaborate, help others, and share your best practices freely.</li>
            <li><span className="li-emoji">⚠️</span> Report any misconduct or suspicious activity to moderators immediately.</li>
            <li><span className="li-emoji">🚫</span> No discrimination based on race, gender, age, or profession.</li>
            <li><span className="li-emoji">🔒</span> Protect confidential business information; avoid sharing private data.</li>
          </ul>
        </section>

        <section className="commitment-section">
          <div className="commitment-card">
            <div className="commitment-content">
              <h2>Our Commitment</h2>
              <p className="commitment-text">
                We are committed to fostering a helpful, constructive, and safe environment. Moderators
                may edit or remove posts that violate the guidelines. Repeated violations may result in
                account actions.
              </p>

              <div className="commitment-stats" aria-hidden="true">
                <div className="stat">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Moderation</div>
                </div>
                <div className="stat">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Core Topics</div>
                </div>
              </div>

              <div className="signature">
                <div className="signature-line" />
                <p>Community Team — Cloud Kitchen</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="guidelines-footer">
          <div className="footer-content">
            <h3>Thanks for contributing</h3>
            <p>
              Together we make this community valuable. If you have suggestions for the rules or moderation,
              please contact a moderator.
            </p>

            <div className="footer-actions">
              <button className="btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Back to top
              </button>
              <button className="btn-outline" onClick={() => navigate("/contact")}>
                Contact moderators
              </button>
            </div>

            <p className="footer-note">
              Need more details? See the full <a href="/policies">community policies</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Guidelines;
