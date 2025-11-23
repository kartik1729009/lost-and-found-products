import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// Add this new interface near the top with other interfaces
interface FoundItemForm {
  productType: string;
  dateFound: string;
  foundLocation: string;
  description: string;
  photo?: File | null;
  photoPreview?: string | null;
}

interface Complaint {
  _id: string;
  productType: string;
  dateLost: string;
  lastKnownSpot: string;
  description: string;
  photoUrl?: string;
  status: "pending" | "reviewed" | "resolved";
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

// Add Found Item interface
interface FoundItem {
  _id: string;
  description: string;
  category: string;
  locationFound: string;
  dateFound: string;
  imageUrl: string;
  isReturned: boolean;
  admin?: {
    username: string;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: "",
    subject: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState<"complaints" | "register" | "found-items">(
    "complaints"
  );
  const [foundItemForm, setFoundItemForm] = useState<FoundItemForm>({
    productType: "",
    dateFound: new Date().toISOString().split("T")[0],
    foundLocation: "",
    description: "",
    photo: null,
    photoPreview: null,
  });
  const [submittingItem, setSubmittingItem] = useState(false);

  // Add state for found items
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [foundItemsLoading, setFoundItemsLoading] = useState(true);

  // Get admin info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchComplaints();
    if (activeTab === "found-items") {
      fetchFoundItems();
    }
  }, [activeTab]);

  // Add fetchFoundItems function
  const fetchFoundItems = async () => {
    try {
      setFoundItemsLoading(true);
      const response = await fetch('http://localhost:3000/api/data/found-items');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFoundItems(data);
    } catch (error) {
      console.error('Error fetching found items:', error);
      setFoundItems([]);
    } finally {
      setFoundItemsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoundItemForm((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFoundItemForm((prev) => ({
          ...prev,
          photoPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitFoundItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !foundItemForm.productType ||
      !foundItemForm.foundLocation ||
      !foundItemForm.description ||
      !foundItemForm.photo
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmittingItem(true);

    const formData = new FormData();
    formData.append("itemType", foundItemForm.productType);
    formData.append("dateFound", foundItemForm.dateFound);
    formData.append("locationFound", foundItemForm.foundLocation);
    formData.append("description", foundItemForm.description);

    // HARDCODED ADMIN ID — AS REQUESTED
    formData.append("admin", "6922b2bf7c5dc2194d2f5f0e");
    formData.append("image", foundItemForm.photo);

    try {
      const response = await fetch("http://localhost:3000/api/found-items", {
        method: "POST",
        body: formData,
        // credentials: "include", // Important if you're using sessions/cookies
      });

      const data = await response.json();

      if (response.ok) {
        alert("Found item registered successfully!");

        // Reset form
        setFoundItemForm({
          productType: "",
          dateFound: new Date().toISOString().split("T")[0],
          foundLocation: "",
          description: "",
          photo: null,
          photoPreview: null,
        });

        // Clear file input
        const fileInput = document.getElementById(
          "photo-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        alert(`Error: ${data.error || "Failed to register item"}`);
      }
    } catch (error: any) {
      console.error("Error submitting found item:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmittingItem(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data/complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Updated delete handler for found items with API functionality
  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/delete/found-item/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Item deleted successfully!');
        // Remove the item from local state
        setFoundItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to delete item'}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Add delete handler for complaints
  const handleDeleteComplaint = async (complaintId: string) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/delete/complaint/${complaintId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Complaint deleted successfully!');
        // Remove the complaint from local state
        setComplaints(prevComplaints => prevComplaints.filter(complaint => complaint._id !== complaintId));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to delete complaint'}`);
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Network error. Please check your connection and try again.');
    }
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
                <p>${emailForm.message.replace(/\n/g, "<br>")}</p>
                
                <div class="item-details">
                    <h3 style="color: #1e293b; margin-top: 0;">Item Details:</h3>
                    <p><strong>Item Type:</strong> ${
                      selectedComplaint.productType
                    }</p>
                    <p><strong>Description:</strong> ${
                      selectedComplaint.description
                    }</p>
                    <p><strong>Lost Location:</strong> ${
                      selectedComplaint.lastKnownSpot
                    }</p>
                    <p><strong>Date Lost:</strong> ${new Date(
                      selectedComplaint.dateLost
                    ).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> ${
                      selectedComplaint.student?.username || "Student"
                    }</p>
                </div>

                ${
                  selectedComplaint.photoUrl
                    ? `
                <div class="photo-container">
                    <h4 style="color: #1e293b;">Item Photo:</h4>
                    <img src="${selectedComplaint.photoUrl}" alt="Lost Item" class="photo" />
                </div>
                `
                    : ""
                }
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
        html: emailHtml,
      };

      console.log("Sending email to:", emailForm.to);
      console.log("Email subject:", emailForm.subject);

      const response = await fetch(
        "http://localhost:3000/api/email/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }
      );

      const result = await response.json();
      console.log("Email API response:", result);

      if (response.ok && result.success) {
        alert("Email sent successfully!");
        setShowEmailModal(false);
        setEmailForm({ to: "", subject: "", message: "" });
        setSelectedComplaint(null);
      } else {
        alert(
          `Error: ${result.message || result.error || "Failed to send email"}`
        );
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleOpenEmailModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEmailForm({
      to: complaint.student?.username || "", // Auto-fill email
      subject: `Update: Your Lost ${complaint.productType} Has Been Found - KRMU Lost & Found`,
      message: `Dear Student,

We have an update regarding your lost ${complaint.productType.toLowerCase()} reported on ${formatDate(
        complaint.dateLost
      )}.

Item Details:
• Description: ${complaint.description}
• Last Seen: ${complaint.lastKnownSpot}

To claim your item, please visit the Lost & Found Office at your earliest convenience with the following:

Required Documents:
1. Your valid K.R. Mangalam University Student ID Card
2. Original bill / purchase receipt OR any proof of ownership (photo, serial number, etc.)

Note: The item will only be released after verification of ownership.

Thank you,
K.R. Mangalam University
Lost & Found Department`,
    });
    setShowEmailModal(true);
  };

  const updateComplaintStatus = async (
    complaintId: string,
    status: "pending" | "reviewed" | "resolved"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/data/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // Update local state
        setComplaints((prev) =>
          prev.map((comp) =>
            comp._id === complaintId ? { ...comp, status } : comp
          )
        );
        alert("Status updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "reviewed":
        return "#3b82f6";
      case "resolved":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="university-logo">KRMU</div>
          <h3>Admin Dashboard</h3>
          <p>Welcome, {user.username || "Admin"}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "complaints" ? "active" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            All Complaints
          </button>
          <button
            className={`nav-item ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register Found Item
          </button>
          <button
            className={`nav-item ${activeTab === "found-items" ? "active" : ""}`}
            onClick={() => setActiveTab("found-items")}
          >
            Found Items Posted
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="content-header">
          <h1>
            {activeTab === "complaints" && "All Lost Item Complaints"}
            {activeTab === "register" && "Register Found Item"}
            {activeTab === "found-items" && "Found Items Posted"}
          </h1>
          <div className="user-info">
            <span>Role: {"Admin"}</span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === "complaints" ? (
            <>
              {loading ? (
                <div className="loading">Loading complaints...</div>
              ) : (
                <div className="complaints-list">
                  {complaints.map((complaint) => (
                    <div key={complaint._id} className="complaint-card">
                      <div className="complaint-header">
                        <div className="complaint-info">
                          <h3>{complaint.productType}</h3>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(complaint.status),
                            }}
                          >
                            {complaint.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="complaint-meta">
                          <span>
                            Reported by:{" "}
                            {complaint.student?.username || "Unknown"}
                          </span>
                          <span>Date: {formatDate(complaint.createdAt)}</span>
                        </div>
                      </div>

                      <div className="complaint-details">
                        <div className="complaint-text">
                          <p>
                            <strong>Description:</strong>{" "}
                            {complaint.description}
                          </p>
                          <p>
                            <strong>Last Known Location:</strong>{" "}
                            {complaint.lastKnownSpot}
                          </p>
                          <p>
                            <strong>Date Lost:</strong>{" "}
                            {formatDate(complaint.dateLost)}
                          </p>
                        </div>
                        {complaint.photoUrl && (
                          <div className="complaint-photo">
                            <img
                              src={complaint.photoUrl}
                              alt={complaint.productType}
                              onClick={() => handleOpenEmailModal(complaint)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="complaint-actions">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateComplaintStatus(
                              complaint._id,
                              e.target.value as any
                            )
                          }
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
                        
                        <button
                          className="delete-complaint-button"
                          onClick={() => handleDeleteComplaint(complaint._id)}
                        >
                          🗑️ Delete
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
            </>
          ) : activeTab === "register" ? (
            // === REGISTER FOUND ITEM TAB ===
            <div className="register-found-item">
              <div className="form-container">
                <h2>Register Found Item</h2>
                <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                  Fill in the details of the item you found. Students will be
                  able to see it on their dashboard.
                </p>

                <form
                  onSubmit={handleSubmitFoundItem}
                  className="found-item-form"
                >
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Item Type *</label>
                      <input
                        type="text"
                        value={foundItemForm.productType}
                        onChange={(e) =>
                          setFoundItemForm((prev) => ({
                            ...prev,
                            productType: e.target.value,
                          }))
                        }
                        placeholder="e.g., Wallet, Phone, Keys, ID Card"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date Found *</label>
                      <input
                        type="date"
                        value={foundItemForm.dateFound}
                        onChange={(e) =>
                          setFoundItemForm((prev) => ({
                            ...prev,
                            dateFound: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location Found *</label>
                    <input
                      type="text"
                      value={foundItemForm.foundLocation}
                      onChange={(e) =>
                        setFoundItemForm((prev) => ({
                          ...prev,
                          foundLocation: e.target.value,
                        }))
                      }
                      placeholder="e.g., Library 3rd Floor, Canteen, Block A"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={foundItemForm.description}
                      onChange={(e) =>
                        setFoundItemForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe the item in detail (color, brand, unique features...)"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Photo *</label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                    {foundItemForm.photoPreview && (
                      <div className="photo-preview">
                        <img
                          src={foundItemForm.photoPreview}
                          alt="Item preview"
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="send-button"
                      disabled={submittingItem}
                      style={{ width: "auto", padding: "0.75rem 2rem" }}
                    >
                      {submittingItem
                        ? "Uploading & Saving..."
                        : "Register Item"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            // === FOUND ITEMS POSTED TAB ===
            <div className="found-items-section">
              <div className="section-header">
                <h2>Found Items Posted</h2>
                <div className="items-count">
                  <span className="count-badge">{foundItems.length} items posted</span>
                </div>
              </div>
              
              {foundItemsLoading ? (
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
                          />
                        </div>
                        <div className="card-content">
                          <h3>{item.description}</h3>
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
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            Delete Item
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h3>No Items Found</h3>
                      <p>There are currently no found items posted in the system.</p>
                      <button 
                        className="cta-button"
                        onClick={() => setActiveTab('register')}
                      >
                        Register First Item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FINAL PROFESSIONAL & SCROLLABLE EMAIL MODAL */}
      {showEmailModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="email-modal-pro" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="email-modal-header">
              <div className="header-title">
                <h2>Send Update to Student</h2>
                <p>Notify student about their lost item</p>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowEmailModal(false)}
              >
                ×
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="email-modal-body">
              <form onSubmit={handleSendEmail}>
                {/* Student Info Card */}
                <div className="student-card">
                  <div className="avatar-circle">
                    {selectedComplaint.student?.username?.[0]?.toUpperCase() ||
                      "S"}
                  </div>
                  <div>
                    <div className="student-email">
                      {selectedComplaint.student?.username ||
                        "student@example.com"}
                    </div>
                    <div className="student-hint">Reported this lost item</div>
                  </div>
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={8}
                    placeholder="Write your message to the student..."
                    required
                  />
                </div>

                {/* Item Summary */}
                <div className="summary-box">
                  <div className="summary-title">
                    Item Summary (automatically included)
                  </div>
                  <div className="summary-table">
                    <div className="row">
                      <span>Item</span>
                      <strong>{selectedComplaint.productType}</strong>
                    </div>
                    <div className="row">
                      <span>Description</span>
                      <strong>{selectedComplaint.description}</strong>
                    </div>
                    <div className="row">
                      <span>Last Seen</span>
                      <strong>{selectedComplaint.lastKnownSpot}</strong>
                    </div>
                    <div className="row">
                      <span>Date Lost</span>
                      <strong>{formatDate(selectedComplaint.dateLost)}</strong>
                    </div>
                    <div className="row">
                      <span>Photo Attached</span>
                      <strong
                        style={{
                          color: selectedComplaint.photoUrl
                            ? "#10b981"
                            : "#ef4444",
                        }}
                      >
                        {selectedComplaint.photoUrl ? "Yes" : "No"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="email-hint">
                  The item photo will be automatically attached if uploaded.
                </div>

                {/* Action Buttons - Fixed at Bottom */}
                <div className="email-modal-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowEmailModal(false)}
                    disabled={sendingEmail}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-send"
                    disabled={sendingEmail}
                  >
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;