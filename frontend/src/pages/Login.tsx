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

      const response = await fetch('http://localhost:3000/api/auth/login', {
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
      <div className="login-background">
        <div className="university-overlay">
          <div className="university-logo">
            KRMU
          </div>
          <div className="university-content">
            <h1>Kr Mangalam University</h1>
            <p>Welcome Back to Lost & Found Portal</p>
            <div className="university-features">
              <div className="feature">
                <span className="feature-icon">🔐</span>
                <span>Secure Access</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Login</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <span>Campus Network</span>
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