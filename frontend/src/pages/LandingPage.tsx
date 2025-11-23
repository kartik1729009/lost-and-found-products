import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Page load animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Show modal after 15 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
      {/* Background with animated elements */}
      <div className="background-animation">
        <div className="floating-items">
          <div className="floating-item item-1">🔑</div>
          <div className="floating-item item-2">📱</div>
          <div className="floating-item item-3">💼</div>
          <div className="floating-item item-4">🎒</div>
          <div className="floating-item item-5">📚</div>
          <div className="floating-item item-6">👓</div>
        </div>
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle" style={{ animationDelay: `${i * 0.5}s` }}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="landing-content">
        <header className="landing-header">
          <div className="logo">
            <div className="logo-icon">🔍</div>
            <h1>Lost & Found</h1>
          </div>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => setShowModal(true)}>Get Started</button>
          </nav>
        </header>

        <main className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>KRMU Campus</span>
            </div>
            <h1 className="hero-title">
              Lost Something?
              <span className="gradient-text"> We'll Help You Find It</span>
            </h1>
            <p className="hero-description">
              Join thousands of KRMU students and staff in our secure campus lost & found network. 
              Report lost items, help others, and build a stronger community together.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Items Recovered</div>
              </div>
              <div className="stat">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Active Support</div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="cta-button primary" onClick={() => setShowModal(true)}>
                <span>Start Your Journey</span>
                <div className="button-glow"></div>
              </button>
              <button className="cta-button secondary" onClick={() => setShowModal(true)}>
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-container">
              <div className="main-visual">
                <div className="search-animation">
                  <div className="search-icon">🔍</div>
                  <div className="search-beam"></div>
                </div>
              </div>
              <div className="floating-cards">
                <div className="card card-1">
                  <div className="card-icon">📱</div>
                  <div className="card-text">Phone Found</div>
                </div>
                <div className="card card-2">
                  <div className="card-icon">🎒</div>
                  <div className="card-text">Bag Returned</div>
                </div>
                <div className="card card-3">
                  <div className="card-icon">🔑</div>
                  <div className="card-text">Keys Found</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2 className="features-title">Why Choose Our Platform?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Instant Reporting</h3>
                <p>Report lost items in seconds with our streamlined process</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>Your data is protected with enterprise-grade security</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Campus Network</h3>
                <p>Connect with the entire KRMU community</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Mobile Friendly</h3>
                <p>Access from any device, anywhere on campus</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-logo">
                  <div className="modal-logo-icon">🔍</div>
                  <h2>Lost & Found</h2>
                </div>
                <p className="modal-subtitle">Join the KRMU Community</p>
              </div>

              <div className="modal-body">
                <div className="auth-options">
                  <div className="auth-card" onClick={handleSignup}>
                    <div className="auth-icon">🚀</div>
                    <h3>Create Account</h3>
                    <p>Join our community and start reporting lost items</p>
                    <div className="auth-features">
                      <span>✓ Report lost items</span>
                      <span>✓ Help others find</span>
                      <span>✓ Campus network</span>
                    </div>
                    <button className="auth-button signup-btn">Sign Up Free</button>
                  </div>

                  <div className="auth-card" onClick={handleLogin}>
                    <div className="auth-icon">🔐</div>
                    <h3>Welcome Back</h3>
                    <p>Access your account and continue your journey</p>
                    <div className="auth-features">
                      <span>✓ Check reports</span>
                      <span>✓ Manage items</span>
                      <span>✓ Community access</span>
                    </div>
                    <button className="auth-button login-btn">Sign In</button>
                  </div>
                </div>

                <div className="modal-footer">
                  <p>Trusted by thousands of KRMU students and staff</p>
                  <div className="trust-badges">
                    <span>🔒 Secure</span>
                    <span>⚡ Fast</span>
                    <span>❤️ Reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;