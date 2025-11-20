import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/createUser", {
        fullName: name,
        email,
        password,
      });
      alert("Account created successfully! Please login.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 -z-10 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('/KR.jpg')` }}
      />

      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            Lost & Found Portal
          </h1>
          <p className="text-xl text-gray-700 mt-2">
            K.R. Mangalam University, Sohna Road, Gurugram
          </p>
          <div className="w-32 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="/KR.jpg"
                alt="Campus"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center mt-6 text-gray-700 font-medium text-lg">
              "Empowering the Youth; Empowering the Nation"
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-lg">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-lg">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-lg"
                  placeholder="yourname@krmangalam.edu.in"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-lg">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-lg"
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-red-700 text-white font-bold text-xl py-5 rounded-lg hover:from-blue-800 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                CREATE ACCOUNT
              </button>
            </form>

            <p className="text-center mt-8 text-gray-700 text-lg">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-700 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            © 2025 K.R. Mangalam University • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
