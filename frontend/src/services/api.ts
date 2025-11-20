import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Auth APIs
export const registerUser = async (data: { username: string; password: string; role: string }) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

export const loginUser = async (data: { username: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

// Complaint APIs
export const createComplaint = async (formData: FormData, token: string) => {
  return axios.post(`${API_URL}/complaints`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAllComplaints = async (token: string) => {
  return axios.get(`${API_URL}/data/complaints`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getComplaintById = async (id: string, token: string) => {
  return axios.get(`${API_URL}/data/complaints/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateComplaintStatus = async (id: string, status: string, token: string) => {
  return axios.patch(`${API_URL}/data/complaints/${id}/status`, 
    { status },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Found Items APIs
export const uploadFoundItem = async (formData: FormData, token: string) => {
  return axios.post(`${API_URL}/found-items`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFoundItems = async (token: string) => {
  return axios.get(`${API_URL}/data/found-items`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markFoundItemReturned = async (id: string, token: string) => {
  return axios.patch(`${API_URL}/data/found-items/${id}/return`, 
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Health check
export const healthCheck = async () => {
  return axios.get(`${API_URL}/`);
};