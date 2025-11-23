import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'lost-items' | 'report-complaint' | 'profile' | 'my-reports'>('lost-items');
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [showCookiesPopup, setShowCookiesPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [myReports, setMyReports] = useState<any[]>([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [claimingItem, setClaimingItem] = useState<string | null>(null);

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    productType: '',
    dateLost: '',
    lastKnownSpot: '',
    description: '',
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Dashboard mounted - User:', userData);
    
    if (!userData.username && userData.email) {
      userData.username = userData.email.split('@')[0];
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    setUser(userData);
    fetchFoundItems();
    loadMyReports();

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      const timer = setTimeout(() => {
        setShowCookiesPopup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchFoundItems = async () => {
    try {
      const response = await fetch('https://lost-and-found-products.onrender.com/api/data/found-items');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFoundItems(data);
    } catch (error) {
      console.error('Error fetching found items:', error);
      setFoundItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyReports = () => {
    const savedReports = localStorage.getItem('myComplaints');
    if (savedReports) {
      setMyReports(JSON.parse(savedReports));
    }
  };

  const saveReportToLocalStorage = (newReport: any) => {
    const updatedReports = [...myReports, newReport];
    setMyReports(updatedReports);
    localStorage.setItem('myComplaints', JSON.stringify(updatedReports));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewProfile = () => {
    setActiveTab('profile');
    setShowProfileDropdown(false);
  };

  const handleCookiesAccept = () => {
    const uuid = generateUUID();
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('userUUID', uuid);
    setShowCookiesPopup(false);
  };

  const handleCookiesDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowCookiesPopup(false);
  };

  const handleViewItemDetails = (item: any) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  // Updated claim functionality
  const handleClaimItem = async (item: any) => {
    if (!user.email) {
      alert('Please make sure you are logged in with a valid email address.');
      return;
    }

    setClaimingItem(item._id);

    try {
      const claimData = {
        studentEmail: user.email,
        itemName: item.description,
        imageUrl: item.imageUrl
      };

      const response = await fetch('https://lost-and-found-products.onrender.com/api/found-items/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Claim submitted successfully! The item owner will contact you soon.');
        
        // Update the item status locally
        setFoundItems(prevItems => 
          prevItems.map(foundItem => 
            foundItem._id === item._id 
              ? { ...foundItem, isReturned: true }
              : foundItem
          )
        );
        
        // Close modal if open
        if (showItemModal) {
          setShowItemModal(false);
          setSelectedItem(null);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit claim. Please try again.');
      }
    } catch (error) {
      console.error('Error claiming item:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setClaimingItem(null);
    }
  };

  const handleShowMyReports = () => {
    setShowReportsModal(true);
  };

  const handleCloseReportsModal = () => {
    setShowReportsModal(false);
  };

  // Complaint form handlers
  const handleComplaintInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComplaintForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComplaintForm(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Validate required fields
    if (!complaintForm.productType || !complaintForm.dateLost || !complaintForm.lastKnownSpot || !complaintForm.description) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productType', complaintForm.productType);
      formData.append('dateLost', complaintForm.dateLost);
      formData.append('lastKnownSpot', complaintForm.lastKnownSpot);
      formData.append('description', complaintForm.description);
      formData.append('student', user.id || '668f2c4b6f3438da9e4651ea'); // Using the student ID from your example

      if (complaintForm.photo) {
        formData.append('photo', complaintForm.photo);
      }

      const response = await fetch('https://lost-and-found-products.onrender.com/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Save to localStorage
        const reportWithLocalData = {
          ...result,
          localId: generateUUID(),
          submittedAt: new Date().toISOString(),
          status: 'pending'
        };
        saveReportToLocalStorage(reportWithLocalData);
        
        setSubmitStatus('success');
        setSubmitMessage('Complaint submitted successfully! We will notify you when your item is found.');
        
        // Reset form
        setComplaintForm({
          productType: '',
          dateLost: '',
          lastKnownSpot: '',
          description: '',
          photo: null
        });
        
        // Clear file input
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        setSubmitMessage(error.error || 'Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return (
    <div className="student-dashboard">
      {/* Cookies Popup */}
      {showCookiesPopup && (
        <div className="cookies-popup">
          <div className="cookies-content">
            <div className="cookies-icon">🍪</div>
            <div className="cookies-text">
              <h3>We Value Your Privacy</h3>
              <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
            </div>
            <div className="cookies-buttons">
              <button className="cookies-decline" onClick={handleCookiesDecline}>
                Decline
              </button>
              <button className="cookies-accept" onClick={handleCookiesAccept}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {showItemModal && selectedItem && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img 
                  src={selectedItem.imageUrl || '/api/placeholder/500/300'} 
                  alt={selectedItem.description} 
                />
                <div className={`modal-status ${selectedItem.isReturned ? 'returned' : 'pending'}`}>
                  {selectedItem.isReturned ? '✅ Returned' : '🕒 Pending Claim'}
                </div>
              </div>
              
              <div className="modal-details">
                <h2>{selectedItem.description}</h2>
                
                <div className="detail-section">
                  <h3>Item Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedItem.category || 'Personal Item'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Found Location:</span>
                      <span className="detail-value">{selectedItem.locationFound}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date Found:</span>
                      <span className="detail-value">
                        {new Date(selectedItem.dateFound).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time Found:</span>
                      <span className="detail-value">
                        {new Date(selectedItem.dateFound).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Found By</h3>
                  <div className="reporter-info">
                    <div className="reporter-avatar">
                      {selectedItem.admin?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="reporter-details">
                      <span className="reporter-name">
                        {selectedItem.admin?.username || 'Administrator'}
                      </span>
                      <span className="reporter-role">Campus Staff</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Item Description</h3>
                  <p className="item-description">
                    {selectedItem.detailedDescription || 
                     `This item was found at ${selectedItem.locationFound}. If this belongs to you, please claim it with proper identification.`}
                  </p>
                </div>

                <div className="modal-actions">
                  <button 
                    className="claim-button primary"
                    onClick={() => handleClaimItem(selectedItem)}
                    disabled={selectedItem.isReturned || claimingItem === selectedItem._id}
                  >
                    {claimingItem === selectedItem._id ? (
                      <>
                        <div className="spinner"></div>
                        Claiming...
                      </>
                    ) : (
                      '🎯 Claim This Item'
                    )}
                  </button>
                  <button className="claim-button secondary">
                    📞 Contact Finder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Reports Modal */}
      {showReportsModal && (
        <div className="modal-overlay" onClick={handleCloseReportsModal}>
          <div className="reports-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseReportsModal}>×</button>
            
            <div className="reports-header">
              <h2>My Reported Items</h2>
              <p>Track all your lost item reports</p>
            </div>

            <div className="reports-content">
              {myReports.length > 0 ? (
                <div className="reports-list">
                  {myReports.map((report, index) => (
                    <div key={report.localId || report._id} className="report-card-modal">
                      <div className="report-header-modal">
                        <div className="report-title">
                          <h3>{report.productType}</h3>
                          <span className={`status-badge ${report.status || 'pending'}`}>
                            {report.status === 'resolved' ? '✅ Resolved' : '🕒 Pending'}
                          </span>
                        </div>
                        <div className="report-date">
                          Reported on {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="report-details-modal">
                        <div className="detail-row">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{report.lastKnownSpot}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date Lost:</span>
                          <span className="detail-value">
                            {new Date(report.dateLost).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">{report.description}</span>
                        </div>
                      </div>

                      {report.photoUrl && (
                        <div className="report-photo-modal">
                          <img src={report.photoUrl} alt={report.productType} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reports">
                  <div className="no-reports-icon">📝</div>
                  <h3>No Reports Yet</h3>
                  <p>You haven't reported any lost items yet. Start by submitting a report above!</p>
                </div>
              )}
            </div>

            <div className="reports-footer">
              <button className="close-reports-btn" onClick={handleCloseReportsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🔍</div>
            <div className="logo-text">
              <h2>Lost & Found</h2>
              <p>KRMU Campus</p>
            </div>
          </div>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <h4>{user.username || 'Student'}</h4>
            <p>Student Account</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'lost-items' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost-items')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Lost Items</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'report-complaint' ? 'active' : ''}`}
            onClick={() => setActiveTab('report-complaint')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Report Item</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">My Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="main-header">
          <div className="header-left">
            <h1>
              {activeTab === 'lost-items' && 'Lost & Found Items'}
              {activeTab === 'report-complaint' && 'Report Lost Item'}
              {activeTab === 'profile' && 'My Profile'}
            </h1>
            <p className="page-description">
              {activeTab === 'lost-items' && 'Browse through all found items on campus'}
              {activeTab === 'report-complaint' && 'Report your lost items to the community'}
              {activeTab === 'profile' && 'Manage your account and preferences'}
            </p>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <span className="bell-icon">🔔</span>
              <span className="notification-dot"></span>
            </div>
            <div className="profile-dropdown-container">
              <button className="profile-header-btn" onClick={handleProfileClick}>
                <div className="profile-avatar-small">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user.username || 'User'}</span>
                <span className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}>▼</span>
              </button>
              
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={handleViewProfile}>
                    <span>👤</span> View Profile
                  </button>
                  <button className="dropdown-item">
                    <span>⚙️</span> Settings
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="main-content">
          {activeTab === 'lost-items' && (
            <div className="lost-items-section">
              <div className="section-header">
                <h2>Recently Found Items</h2>
                <div className="items-count">
                  <span className="count-badge">{foundItems.length} items found</span>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading found items...</p>
                </div>
              ) : (
                <div className="items-grid">
                  {foundItems.length > 0 ? (
                    foundItems.map(item => (
                      <div key={item._id} className="item-card">
                        <div className="card-header">
                          <div className="item-category">{item.category || 'Personal Item'}</div>
                          <div className={`status-badge ${item.isReturned ? 'returned' : 'pending'}`}>
                            {item.isReturned ? 'Returned' : 'Pending'}
                          </div>
                        </div>
                        <div className="item-image">
                          <img 
                            src={item.imageUrl || '/api/placeholder/300/200'} 
                            alt={item.description} 
                            onClick={() => handleViewItemDetails(item)}
                          />
                          <div className="image-overlay">
                            <button 
                              className="view-btn"
                              onClick={() => handleViewItemDetails(item)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                        <div className="card-content">
                          <h3 onClick={() => handleViewItemDetails(item)}>{item.description}</h3>
                          <div className="item-meta">
                            <div className="meta-item">
                              <span className="meta-icon">📍</span>
                              <span>{item.locationFound}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">📅</span>
                              <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">👤</span>
                              <span>{item.admin?.username || 'Admin'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button 
                            className="action-btn claim-btn"
                            onClick={() => handleClaimItem(item)}
                            disabled={item.isReturned || claimingItem === item._id}
                          >
                            {claimingItem === item._id ? (
                              <>
                                <div className="spinner-small"></div>
                                Claiming...
                              </>
                            ) : (
                              'Claim Item'
                            )}
                          </button>
                          <button className="action-btn share-btn">
                            Share
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h3>No Items Found</h3>
                      <p>There are currently no lost items reported in the system.</p>
                      <button 
                        className="cta-button"
                        onClick={() => setActiveTab('report-complaint')}
                      >
                        Report First Item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'report-complaint' && (
            <ComplaintForm 
              complaintForm={complaintForm}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              submitMessage={submitMessage}
              onInputChange={handleComplaintInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleComplaintSubmit}
              onShowReports={handleShowMyReports}
              reportsCount={myReports.length}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage />
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Complaint Form Component with See Reports button
const ComplaintForm: React.FC<{
  complaintForm: any;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  submitMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onShowReports: () => void;
  reportsCount: number;
}> = ({ complaintForm, isSubmitting, submitStatus, submitMessage, onInputChange, onFileChange, onSubmit, onShowReports, reportsCount }) => {
  return (
    <div className="complaint-section">
      <div className="complaint-header">
        <div className="header-top">
          <h2>Report Lost Item</h2>
          <button className="see-reports-btn" onClick={onShowReports}>
            <span className="reports-icon">📋</span>
            See My Reports ({reportsCount})
          </button>
        </div>
        <p>Fill out the form below to report your lost item. We'll help you find it!</p>
      </div>

      <div className="complaint-container">
        <div className="complaint-guide">
          <div className="guide-card">
            <h3>📋 How to Report</h3>
            <div className="guide-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span className="step-text">Provide item details</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span className="step-text">Upload a photo (optional)</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span className="step-text">Submit for review</span>
              </div>
            </div>
          </div>

          <div className="tips-card">
            <h3>💡 Tips for Better Results</h3>
            <ul className="tips-list">
              <li>Be specific about the item description</li>
              <li>Include exact location where you lost it</li>
              <li>Upload clear photos if available</li>
              <li>Provide accurate date and time</li>
            </ul>
          </div>
        </div>

        <form className="complaint-form" onSubmit={onSubmit}>
          {submitStatus === 'success' && (
            <div className="alert success">
              <span className="alert-icon">✅</span>
              {submitMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert error">
              <span className="alert-icon">❌</span>
              {submitMessage}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="productType" className="required">
                Item Type
              </label>
              <select
                id="productType"
                name="productType"
                value={complaintForm.productType}
                onChange={onInputChange}
                required
                className="form-input"
              >
                <option value="">Select item type</option>
                <option value="Backpack">Backpack/Bag</option>
                <option value="Books">Books/Notebooks</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Jewelry">Jewelry/Accessories</option>
                <option value="Keys">Keys</option>
                <option value="Wallet">Wallet/Purse</option>
                <option value="ID Card">ID Card</option>
                <option value="Water Bottle">Water Bottle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateLost" className="required">
                Date Lost
              </label>
              <input
                type="date"
                id="dateLost"
                name="dateLost"
                value={complaintForm.dateLost}
                onChange={onInputChange}
                required
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="lastKnownSpot" className="required">
                Last Known Location
              </label>
              <select
                id="lastKnownSpot"
                name="lastKnownSpot"
                value={complaintForm.lastKnownSpot}
                onChange={onInputChange}
                required
                className="form-input"
              >
                <option value="">Select location</option>
                <option value="Library">Library</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Classroom">Classroom</option>
                <option value="Sports Complex">Sports Complex</option>
                <option value="Parking Lot">Parking Lot</option>
                <option value="Admin Building">Admin Building</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Hostel">Hostel</option>
                <option value="Other">Other Area</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="required">
                Item Description
              </label>
              <textarea
                id="description"
                name="description"
                value={complaintForm.description}
                onChange={onInputChange}
                required
                className="form-input"
                placeholder="Describe your lost item in detail. Include color, brand, size, unique features, contents, etc."
                rows={4}
              />
              <div className="char-count">
                {complaintForm.description.length}/500 characters
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="photo-upload">
                Item Photo (Optional)
              </label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="photo-upload"
                  name="photo"
                  onChange={onFileChange}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor="photo-upload" className="file-upload-label">
                  <div className="upload-icon">📸</div>
                  <div className="upload-text">
                    <span className="upload-title">
                      {complaintForm.photo ? 'Photo Selected' : 'Click to upload photo'}
                    </span>
                    <span className="upload-subtitle">
                      {complaintForm.photo 
                        ? complaintForm.photo.name 
                        : 'PNG, JPG, GIF up to 5MB'
                      }
                    </span>
                  </div>
                </label>
              </div>
              {complaintForm.photo && (
                <div className="file-preview">
                  <span className="file-name">{complaintForm.photo.name}</span>
                  <button 
                    type="button" 
                    className="remove-file"
                    onClick={() => {
                      complaintForm((prev: any) => ({ ...prev, photo: null }));
                      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="submit-icon">🚀</span>
                  Submit Report
                </>
              )}
            </button>
            
            <button type="button" className="cancel-btn">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Page Component (unchanged)
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.username && userData.email) {
      userData.username = userData.email.split('@')[0];
    }
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    setUser(userData);
    setEditedName(userData.username || '');
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoDataUrl = e.target?.result as string;
        setProfilePhoto(photoDataUrl);
        localStorage.setItem('profilePhoto', photoDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    const updatedUser = { ...user, username: editedName };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-hero">
          <div className="profile-cover"></div>
          <div className="profile-main">
            <div className="avatar-section">
              <div className="profile-avatar-large">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" />
                ) : (
                  <div className="default-avatar">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <label htmlFor="photo-upload" className="upload-overlay">
                  <span className="upload-icon">📷</span>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="profile-info">
                {isEditing ? (
                  <div className="name-edit">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="name-input"
                      placeholder="Enter your name"
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveName} className="save-btn">Save</button>
                      <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2>{user.username || 'Student'}</h2>
                    <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                      <span>✏️</span> Edit Profile
                    </button>
                  </>
                )}
                <p className="user-email">{user.email || user.username}</p>
                <div className="profile-badges">
                  <span className="badge student-badge">Student</span>
                  <span className="badge verified-badge">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Items Reported</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Items Found</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>New</h3>
              <p>Member Level</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>Today</h3>
              <p>Last Active</p>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-card">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user.username || 'Not set'}</p>
              </div>
              <div className="detail-item">
                <label>Email Address</label>
                <p>{user.email || user.username}</p>
              </div>
              <div className="detail-item">
                <label>Student ID</label>
                <p>{user.id || 'Not available'}</p>
              </div>
              <div className="detail-item">
                <label>Member Since</label>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Department</label>
                <p>Computer Science</p>
              </div>
              <div className="detail-item">
                <label>Campus</label>
                <p>KRMU Main Campus</p>
              </div>
            </div>
          </div>

          <div className="preferences-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="pref-btn">
                <span className="pref-icon">🔒</span>
                Change Password
              </button>
              <button className="pref-btn">
                <span className="pref-icon">📧</span>
                Update Email
              </button>
              <button className="pref-btn">
                <span className="pref-icon">🔔</span>
                Notifications
              </button>
              <button className="pref-btn">
                <span className="pref-icon">🌙</span>
                Dark Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;