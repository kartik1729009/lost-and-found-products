import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    setLoading(true);
    try {
      console.log('Sending login request...', {
        username: formData.username,
        password: formData.password
      });
      const response = await fetch('https://lost-and-found-products.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      const data: LoginResponse = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
       
        alert(`Welcome back, ${data.user.username}!`);
       
        // Redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || `Login failed: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Network error. Please check if server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = () => {
    navigate('/login-otp');
  };

  return (
    <div className="login-container">
      <div
        className="login-background"
        style={{
          position: 'relative',
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            linear-gradient(
              rgba(30, 60, 114, 0.85),
              rgba(42, 82, 152, 0.85)
            ),
            url('https://krmangalam.edu.in/wp-content/uploads/2023/07/KR-Mangalam-University.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Enhanced Overlay with Glassmorphism Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.4) 0%, rgba(42, 82, 152, 0.3) 100%)',
            backdropFilter: 'blur(5px)'
          }}
        />
       
        <div className="university-overlay">
          {/* Enhanced University Logo with Better Styling */}
          <div
            style={{
              width: '100px',
              height: '100px',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '50%',
              padding: '15px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#1e3c72',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            KRMU
          </div>
         
          <div className="university-content">
            <h1 style={{
              fontSize: '2.8rem',
              marginBottom: '1rem',
              fontWeight: 700,
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Kr Mangalam University
            </h1>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '2rem',
              opacity: 0.95,
              fontWeight: 500
            }}>
              Welcome Back to Lost & Found Portal
            </p>
           
            {/* Enhanced Features Section */}
            <div className="university-features">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '1.1rem',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>🔐</span>
                <span style={{ fontWeight: 600 }}>Secure Access</span>
              </div>
             
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '1.1rem',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>⚡</span>
                <span style={{ fontWeight: 600 }}>Quick Login</span>
              </div>
             
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  fontSize: '1.1rem',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>👥</span>
                <span style={{ fontWeight: 600 }}>Campus Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">University ID/Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your university ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="login-divider">
              <span>OR</span>
            </div>
            <button
              type="button"
              className="otp-login-button"
              onClick={handleOtpLogin}
            >
              📧 Login with OTP
            </button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup" className="signup-link">Create Account</Link>
            </p>
          </div>
          <div className="security-notice">
            <p>🔒 Secure authentication system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;