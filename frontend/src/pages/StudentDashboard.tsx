// src/pages/StudentDashboard.tsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [form, setForm] = useState({
    productType: "",
    dateLost: "",
    lastKnownSpot: "",
    description: "",
  });

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/complaints", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Lost item reported successfully!");
      setForm({
        productType: "",
        dateLost: "",
        lastKnownSpot: "",
        description: "",
      });
    } catch (err) {
      alert("Failed to submit report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl">
              S
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Student Portal
              </h1>
              <p className="text-purple-300 text-sm">
                K.R. Mangalam University • Lost & Found
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content – Perfectly Centered, No Scroll */}
      <div className="flex-1 container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full">
          {/* Report Lost Item Card */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-10">
            <h2 className="text-4xl font-bold text-pink-300 mb-8 text-center">
              Report a Lost Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Item Name (e.g. MacBook, Wallet)"
                value={form.productType}
                onChange={(e) =>
                  setForm({ ...form, productType: e.target.value })
                }
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/30 placeholder-gray-400 text-lg transition-all"
                required
              />
              <input
                type="date"
                value={form.dateLost}
                onChange={(e) => setForm({ ...form, dateLost: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/30 text-lg"
                required
              />
              <input
                type="text"
                placeholder="Last Known Location"
                value={form.lastKnownSpot}
                onChange={(e) =>
                  setForm({ ...form, lastKnownSpot: e.target.value })
                }
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/30 placeholder-gray-400 text-lg"
                required
              />
              <textarea
                rows={4}
                placeholder="Describe your item (color, brand, stickers, etc.)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/30 placeholder-gray-400 text-lg resize-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-bold text-xl py-5 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                SUBMIT REPORT
              </button>
            </form>
          </div>

          {/* View My Reports – Beautiful & Balanced */}
          <div className="flex items-center justify-center">
            <Link
              to="/my-reports"
              className="group relative block w-full max-w-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-70 group-hover:opacity-90 transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-16 text-center shadow-2xl hover:scale-105 transition-all duration-500">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-4">
                  View My Reports
                </h3>
                <p className="text-xl text-purple-200">
                  Check status of all your lost items
                </p>
                <div className="mt-8 inline-block px-10 py-4 bg-white/20 rounded-full text-lg font-semibold hover:bg-white/30 transition-all">
                  Go to Reports →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Optional Footer */}
      <footer className="bg-black/20 backdrop-blur-xl py-4 text-center text-purple-300 text-sm">
        © 2025 K.R. Mangalam University • Lost & Found System
      </footer>
    </div>
  );
};

export default StudentDashboard;
