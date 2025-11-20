import { Link } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful", response.data);
      alert("Login successful");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={submitHandler} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
          
          <div className="login-footer">
            <p>Don't have an account? <Link to="/" className="signup-link">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login