import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

interface SignupForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'staff' | 'admin';
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration request...', {
        username: formData.username,
        password: formData.password,
        role: formData.role
      });

      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: formData.username,
        password: formData.password,
        role: formData.role
      });

      console.log('Registration response:', response);

      if (response.status === 201) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error status
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        
        if (err.response.status === 409) {
          setError('Username already exists');
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(`Registration failed: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        setError('Cannot connect to server. Please make sure the backend is running on port 3000.');
      } else {
        // Other errors
        console.error('Error message:', err.message);
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="university-overlay">
          <div className="university-logo">
            KRMU
          </div>
          <div className="university-content">
            <h1>Kr Mangalam University</h1>
            <p>Gateway to Excellence in Education</p>
            <div className="university-features">
              <div className="feature">
                <span className="feature-icon">🔍</span>
                <span>Report Lost Items</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📝</span>
                <span>File Complaints</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏫</span>
                <span>Campus Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-form-container">
        <div className="signup-form-wrapper">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Join the Kr Mangalam University community</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
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
              <label htmlFor="role">I am a</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="staff">Staff Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account? <Link to="/login" className="login-link">Sign In</Link>
            </p>
          </div>

          <div className="security-notice">
            <p>🔒 Your information is secure and protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;