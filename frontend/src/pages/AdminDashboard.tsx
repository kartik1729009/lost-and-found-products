import { useEffect, useState } from 'react';
import { getAllComplaints, getFoundItems } from '../services/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      const cRes = await getAllComplaints(token);
      setComplaints(cRes.data);

      const fRes = await getFoundItems(token);
      setFoundItems(fRes.data);
    };
    fetchData();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Complaints</h2>
        {complaints.map(c => (
          <div key={c._id} className="border p-4 mb-2 rounded">
            <p><strong>Student:</strong> {c.student.username}</p>
            <p><strong>Product:</strong> {c.productType}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl mb-4">Found Items</h2>
        {foundItems.map(f => (
          <div key={f._id} className="border p-4 mb-2 rounded">
            <p><strong>Description:</strong> {f.description}</p>
            <p><strong>Returned:</strong> {f.isReturned ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;