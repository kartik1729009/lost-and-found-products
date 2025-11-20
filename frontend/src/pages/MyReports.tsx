// src/pages/MyReports.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyReports = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/data/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      setComplaints(res.data.filter((c: any) => c.student._id === userId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-2xl">
              M
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                My Reports
              </h1>
              <p className="text-purple-300 text-sm">
                K.R. Mangalam University • Lost & Found
              </p>
            </div>
          </div>
          <Link
            to="/student"
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-pink-300">Your Lost Items</h2>
          <p className="text-xl text-purple-200 mt-4">
            Total Reports:{" "}
            <span className="font-bold text-3xl">{complaints.length}</span>
          </p>
        </div>

        <div className="grid gap-8 max-w-5xl mx-auto">
          {complaints.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-6">No reports yet</p>
              <p className="text-2xl text-purple-300">
                Start by reporting a lost item!
              </p>
              <Link
                to="/student"
                className="mt-8 inline-block px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-xl font-bold hover:scale-110 transition-all shadow-2xl"
              >
                Report Lost Item
              </Link>
            </div>
          ) : (
            complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:scale-[1.02] transition-all shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-bold text-pink-300">
                    {c.productType}
                  </h3>
                  <span
                    className={`px-6 py-3 rounded-full text-lg font-bold ${
                      c.status === "Resolved"
                        ? "bg-green-500/30 text-green-300"
                        : c.status === "Pending"
                        ? "bg-yellow-500/30 text-yellow-300"
                        : "bg-orange-500/30 text-orange-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-lg">
                  <div>
                    <p className="text-purple-300">Date Lost</p>
                    <p className="font-bold text-xl">
                      {new Date(c.dateLost).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-300">Last Seen</p>
                    <p className="font-bold text-xl">{c.lastKnownSpot}</p>
                  </div>
                  <div>
                    <p className="text-purple-300">Reported On</p>
                    <p className="font-bold text-xl">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {c.description && (
                  <div className="mt-8 bg-white/5 rounded-2xl p-6 border-l-8 border-pink-500">
                    <p className="text-purple-200 text-lg italic">
                      "{c.description}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;
