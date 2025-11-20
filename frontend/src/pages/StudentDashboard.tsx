import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Complaint {
  _id: string;
  productType: string;
  dateLost: string;
  lastKnownSpot: string;
  description: string;
  status: string;
  student: {
    _id: string;
  };
}

const StudentDashboard = () => {
  const [productType, setProductType] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [lastKnownSpot, setLastKnownSpot] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const token = localStorage.getItem('token') || '';

  const fetchComplaints = async () => {
    const res = await axios.get('http://localhost:5000/api/data/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComplaints(res.data.filter((c: Complaint) => c.student._id === JSON.parse(atob(token.split('.')[1])).id));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('productType', productType);
      formData.append('dateLost', dateLost);
      formData.append('lastKnownSpot', lastKnownSpot);
      formData.append('description', description);

      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Complaint filed!');
      fetchComplaints();
    } catch (err) {
      alert('Error filing complaint');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input placeholder="Product Type" value={productType} onChange={e => setProductType(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="date" value={dateLost} onChange={e => setDateLost(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input placeholder="Last Known Spot" value={lastKnownSpot} onChange={e => setLastKnownSpot(e.target.value)} className="border p-2 mb-2 w-full"/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 mb-2 w-full"/>
        <button className="bg-blue-500 text-white p-2 rounded">File Complaint</button>
      </form>

      <h2 className="text-2xl mb-4">My Complaints</h2>
      {complaints.map(c => (
        <div key={c._id} className="border p-4 mb-2 rounded">
          <p><strong>Product:</strong> {c.productType}</p>
          <p><strong>Status:</strong> {c.status}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;