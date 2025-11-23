import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginOtp.css';

interface OtpForm {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

const LoginOtp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OtpForm>({
    email: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSendingOtp(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setSuccess('OTP sent to your email!');
        setCountdown(60); // 60 seconds countdown
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp) {
      setError('OTP is required');
      return;
    }

    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      });

      const data: VerifyOtpResponse = await response.json();
      
      if (response.ok) {
        setSuccess('OTP verified successfully!');
        
        // Store token and user data if returned by backend
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // If backend doesn't return user data, create it from email
          const username = formData.email.split('@')[0]; // Extract name from email
          const userData = {
            id: Date.now().toString(),
            username: username,
            email: formData.email,
            role: 'student'
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      handleSendOtp();
    }
  };

  return (
    <div className="login-otp-container">
      <div className="login-otp-background">
        <div className="university-overlay">
          <div className="university-logo">
            KRMU
          </div>
          <div className="university-content">
            <h1>Kr Mangalam University</h1>
            <p>Secure OTP Login</p>
            <div className="university-features">
              <div className="feature">
                <span className="feature-icon">📧</span>
                <span>Email Verification</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔢</span>
                <span>6-Digit OTP</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-otp-form-container">
        <div className="login-otp-form-wrapper">
          <div className="login-otp-header">
            <h2>Login with OTP</h2>
            <p>Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleVerifyOtp} className="login-otp-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your university email"
                required
                disabled={otpSent}
              />
            </div>

            {!otpSent ? (
              <button 
                type="button"
                className="send-otp-button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                  <div className="otp-hint">
                    Check your email for the 6-digit verification code
                  </div>
                </div>

                <div className="otp-actions">
                  <button 
                    type="submit" 
                    className="verify-otp-button"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  
                  <button 
                    type="button"
                    className="resend-otp-button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="login-otp-footer">
            <p>
              Prefer password login? <Link to="/login" className="back-to-login">Back to Login</Link>
            </p>
            <p>
              Don't have an account? <Link to="/signup" className="signup-link">Create Account</Link>
            </p>
          </div>

          <div className="security-notice">
            <p>🔒 OTP valid for 10 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOtp;