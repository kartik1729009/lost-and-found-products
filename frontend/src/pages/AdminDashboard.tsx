import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

interface Complaint {
  _id: string;
  productType: string;
  dateLost: string;
  lastKnownSpot: string;
  description: string;
  photoUrl?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  student: {
    username: string;
    role: string;
  };
  createdAt: string;
}

interface EmailForm {
  to: string;
  subject: string;
  message: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: '',
    subject: '',
    message: ''
  });

  // Get admin info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSendingEmail(true);

    try {
      // Create email HTML with the complaint photo
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
                .header { color: #1e3c72; text-align: center; border-bottom: 2px solid #1e3c72; padding-bottom: 10px; }
                .content { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .item-details { margin: 15px 0; }
                .footer { color: #64748b; font-size: 0.9rem; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
                .photo-container { text-align: center; margin: 20px 0; }
                .photo { max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Kr Mangalam University</h1>
                <h2>Lost & Found System</h2>
            </div>
            
            <div class="content">
                <p>${emailForm.message.replace(/\n/g, '<br>')}</p>
                
                <div class="item-details">
                    <h3 style="color: #1e293b; margin-top: 0;">Item Details:</h3>
                    <p><strong>Item Type:</strong> ${selectedComplaint.productType}</p>
                    <p><strong>Description:</strong> ${selectedComplaint.description}</p>
                    <p><strong>Lost Location:</strong> ${selectedComplaint.lastKnownSpot}</p>
                    <p><strong>Date Lost:</strong> ${new Date(selectedComplaint.dateLost).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> ${selectedComplaint.student?.username || 'Student'}</p>
                </div>

                ${selectedComplaint.photoUrl ? `
                <div class="photo-container">
                    <h4 style="color: #1e293b;">Item Photo:</h4>
                    <img src="${selectedComplaint.photoUrl}" alt="Lost Item" class="photo" />
                </div>
                ` : ''}
            </div>

            <div class="footer">
                <p>This email was sent from Kr Mangalam University Lost & Found System.</p>
                <p>Please contact university administration for any queries.</p>
            </div>
        </body>
        </html>
      `;

      const emailData = {
        to: emailForm.to,
        subject: emailForm.subject,
        html: emailHtml
      };

      console.log('Sending email to:', emailForm.to);
      console.log('Email subject:', emailForm.subject);

      const response = await fetch('http://localhost:3000/api/email/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();
      console.log('Email API response:', result);

      if (response.ok && result.success) {
        alert('Email sent successfully!');
        setShowEmailModal(false);
        setEmailForm({ to: '', subject: '', message: '' });
        setSelectedComplaint(null);
      } else {
        alert(`Error: ${result.message || result.error || 'Failed to send email'}`);
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleOpenEmailModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEmailForm({
      to: '', // Admin needs to enter the email manually
      subject: `Update Regarding Your Lost ${complaint.productType} - Kr Mangalam University`,
      message: `Dear Student,\n\nWe have important information regarding your lost ${complaint.productType.toLowerCase()} that was reported in our system.\n\nPlease visit the lost and found office at your earliest convenience.\n\nBest regards,\nKr Mangalam University Administration\nLost & Found Department`
    });
    setShowEmailModal(true);
  };

  const updateComplaintStatus = async (complaintId: string, status: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const response = await fetch(`http://localhost:3000/api/data/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Update local state
        setComplaints(prev => prev.map(comp => 
          comp._id === complaintId ? { ...comp, status } : comp
        ));
        alert('Status updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update status'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="university-logo">
            KRMU
          </div>
          <h3>Admin Dashboard</h3>
          <p>Welcome, {user.username || 'Admin'}</p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            📋 All Complaints
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="content-header">
          <h1>All Lost Item Complaints</h1>
          <div className="user-info">
            <span>Role: {user.role || 'User'}</span>
          </div>
        </header>

        <div className="content-body">
          {loading ? (
            <div className="loading">Loading complaints...</div>
          ) : (
            <div className="complaints-list">
              {complaints.map(complaint => (
                <div key={complaint._id} className="complaint-card">
                  <div className="complaint-header">
                    <div className="complaint-info">
                      <h3>{complaint.productType}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(complaint.status) }}
                      >
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="complaint-meta">
                      <span>Reported by: {complaint.student?.username || 'Unknown'}</span>
                      <span>Date: {formatDate(complaint.createdAt)}</span>
                    </div>
                  </div>

                  <div className="complaint-details">
                    <div className="complaint-text">
                      <p><strong>Description:</strong> {complaint.description}</p>
                      <p><strong>Last Known Location:</strong> {complaint.lastKnownSpot}</p>
                      <p><strong>Date Lost:</strong> {formatDate(complaint.dateLost)}</p>
                    </div>

                    {complaint.photoUrl && (
                      <div className="complaint-photo">
                        <img 
                          src={complaint.photoUrl} 
                          alt={complaint.productType}
                          onClick={() => handleOpenEmailModal(complaint)}
                        />
                        <button 
                          className="email-button"
                          onClick={() => handleOpenEmailModal(complaint)}
                        >
                          📧 Send Email
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="complaint-actions">
                    <select 
                      value={complaint.status}
                      onChange={(e) => updateComplaintStatus(complaint._id, e.target.value as any)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <button 
                      className="email-button"
                      onClick={() => handleOpenEmailModal(complaint)}
                    >
                      📧 Send Email
                    </button>
                  </div>
                </div>
              ))}
              
              {complaints.length === 0 && (
                <div className="no-complaints">
                  <h3>No complaints found</h3>
                  <p>There are currently no lost item complaints.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Send Email to Student</h2>
              <button 
                className="close-button"
                onClick={() => setShowEmailModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="email-form">
              <div className="form-group">
                <label>To Email *</label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="student@example.com"
                  required
                />
                <small>Enter the student's email address</small>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message to the student..."
                  rows={6}
                  required
                />
                <small>The item photo will be automatically included if available</small>
              </div>

              <div className="email-preview">
                <h4>Preview:</h4>
                <p><strong>Item:</strong> {selectedComplaint.productType}</p>
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                <p><strong>Includes Photo:</strong> {selectedComplaint.photoUrl ? 'Yes' : 'No'}</p>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEmailModal(false)}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;