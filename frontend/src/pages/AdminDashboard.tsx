// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { getAllComplaints, getFoundItems } from "../services/api";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cRes, fRes] = await Promise.all([
          getAllComplaints(token),
          getFoundItems(token),
        ]);
        setComplaints(cRes.data);
        setFoundItems(fRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    if (token) loadData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-2xl">
              K
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Control
              </h1>
              <p className="text-purple-300 text-sm">
                K.R. Mangalam University • Lost & Found Portal
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {complaints.length + foundItems.length}
            </p>
            <p className="text-purple-300 text-sm">Total Active Cases</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Lost Items Reports */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                Lost Item Reports
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                  {complaints.length} pending
                </span>
              </h2>
            </div>

            <div className="p-6 space-y-5 max-h-96 overflow-y-auto custom-scrollbar">
              {complaints.length === 0 ? (
                <p className="text-center text-purple-300 py-12">
                  No lost item reports
                </p>
              ) : (
                complaints.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold text-purple-300">
                        {c.productType}
                      </h3>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          c.status === "Resolved"
                            ? "bg-green-500/30 text-green-300"
                            : "bg-orange-500/30 text-orange-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-purple-300">Student</p>
                        <p className="font-semibold text-lg">
                          {c.student.username || c.student.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-300">Date Lost</p>
                        <p className="font-semibold">
                          {new Date(c.dateLost).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-purple-300 text-sm">Last Seen</p>
                      <p className="font-medium bg-white/10 px-3 py-2 rounded-lg inline-block mt-1">
                        {c.lastKnownSpot}
                      </p>
                    </div>

                    {c.description && (
                      <p className="mt-4 text-gray-300 italic">
                        "{c.description}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Found Items */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                Found Items Vault
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                  {foundItems.filter((f) => !f.isReturned).length} in storage
                </span>
              </h2>
            </div>

            <div className="p-6 space-y-5 max-h-96 overflow-y-auto custom-scrollbar">
              {foundItems.length === 0 ? (
                <p className="text-center text-teal-300 py-12">
                  No items in storage
                </p>
              ) : (
                foundItems.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] hover:shadow-xl"
                  >
                    <p className="text-xl font-medium text-teal-300 mb-3">
                      {f.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Found on {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-5 py-2 rounded-full font-bold text-sm ${
                          f.isReturned
                            ? "bg-green-500/30 text-green-300"
                            : "bg-yellow-500/30 text-yellow-300"
                        }`}
                      >
                        {f.isReturned ? "Returned" : "Available"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <p className="text-4xl font-bold text-purple-400">
              {complaints.length}
            </p>
            <p className="text-purple-300">Total Reports</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <p className="text-4xl font-bold text-emerald-400">
              {complaints.filter((c) => c.status === "Resolved").length}
            </p>
            <p className="text-emerald-300">Resolved</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <p className="text-4xl font-bold text-pink-400">
              {foundItems.filter((f) => !f.isReturned).length}
            </p>
            <p className="text-pink-300">Items in Custody</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
