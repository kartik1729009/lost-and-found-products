import React from 'react'
import axios from "axios";
import { useState } from "react"
import { Link } from "react-router-dom"
import "./Signup.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const signuphandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/api/auth/createUser", {
                fullName: name,
                email,
                password,
            })
            console.log("signup successful: ", response.data);
            alert("Sign up successful!");
        } catch(err) {
            console.error(err);
            alert("Signup failed. Please try again.");
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-background"></div>
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create Account</h2>
                    <p>Join K.R. Mangalam University Community</p>
                </div>
                
                <form onSubmit={signuphandler} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Enter your full name" 
                            value={name} 
                            onChange={(e)=>setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Enter your email address" 
                            value={email} 
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Create a strong password" 
                            value={password} 
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="signup-btn">Create Account</button>
                    
                    <div className="login-link">
                        <p>Already have an account? <Link to="/Login">Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup