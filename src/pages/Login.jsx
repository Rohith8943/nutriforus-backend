import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User as UserIcon, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Fixed data mapping from Nutriforus Backend response
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Force refresh or just navigate
      navigate('/');
      window.location.reload(); // Ensure all components pick up the new user data
    } catch (err) {
      console.error("Login error details:", err);
      setError(err.response?.data?.message || 'Connection failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-glass-background">
        <div className="glass-blob glass-blob-1"></div>
        <div className="glass-blob glass-blob-2"></div>
        <div className="glass-blob glass-blob-3"></div>
      </div>

      <header className="auth-header">
        <div className="auth-logo-frame">
          <div className="auth-logo">🌿</div>
          <div className="auth-badge"><ShieldCheck size={12} /></div>
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your clinical journey</p>
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="auth-error-chip animate-shake">
            <span>{error}</span>
          </div>
        )}
        
        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Mail size={18} className="input-icon-premium" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Lock size={18} className="input-icon-premium" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              className="eye-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Link to="/forgot-password" title="Coming soon" className="forgot-pass-link">Forgot Password?</Link>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight size={18} className={loading ? 'spinning' : ''} />
        </button>
      </form>

      <div className="auth-divider">
        <span>Secure Sign In</span>
      </div>

      <div className="auth-social-row">
        <button className="social-pill-btn">
          <img src="https://www.google.com/favicon.ico" alt="Google" width="18" />
          <span>Google</span>
        </button>
      </div>

      <footer className="auth-footer-premium">
        <p>Don't have an account? <Link to="/register">Create Profile</Link></p>
      </footer>
    </div>
  );
};

export default Login;
