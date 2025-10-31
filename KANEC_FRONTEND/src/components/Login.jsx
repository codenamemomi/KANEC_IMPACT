import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <a href="#" className="back-link">← Back to Home</a>
      <div className="login-card">
        <div className="logo">
          <span role="img" aria-label="leaf">🌱</span>
        </div>
        <h2 className="welcome-text">Welcome to Kanec</h2>
        <p className="description-text">Join us in making a difference through transparent, blockchain-powered donations.</p>
        <form>
          <input type="email" placeholder="Email" defaultValue="you@example.com" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>
        <button className="sign-up-btn">Sign Up</button>
        <p className="terms-text">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        <p className="powered-by-text">Powered by blockchain technology for maximum transparency</p>
      </div>
    </div>
  );
}

export default Login;