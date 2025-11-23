import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import Signup from './pages/Signup.tsx'
import Login from './pages/Login.tsx'
import LoginOtp from './pages/LoginOtp.tsx'
import StudentDashboard from './pages/StudentDashboard.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'

import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root path to landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-otp" element={<LoginOtp />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App