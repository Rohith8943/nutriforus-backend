import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User as UserIcon, ShieldCheck, Heart, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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
          <div className="auth-badge"><Heart size={12} fill="currentColor" /></div>
        </div>
        <h1 className="auth-title">Join Nutriforus</h1>
        <p className="auth-subtitle">Start your clinical transformation today</p>
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="auth-error-chip animate-shake">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <UserIcon size={18} className="input-icon-premium" />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>
        </div>
        
        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Mail size={18} className="input-icon-premium" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Lock size={18} className="input-icon-premium" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password (10+ characters)" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <footer className="auth-footer-premium">
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </footer>
    </div>
  );
};

export default Register;
