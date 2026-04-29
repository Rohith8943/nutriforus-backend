import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './Login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query params (e.g. ?token=abc)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword: password });
      setMessage(response.data.message || 'Password successfully reset.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
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
        <h1 className="auth-title">New Password</h1>
        <p className="auth-subtitle">Secure your clinical account</p>
      </header>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="auth-error-chip animate-shake">
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div className="auth-error-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            <span>{message}</span>
          </div>
        )}
        
        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Lock size={18} className="input-icon-premium" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password (10+ chars)" 
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
        </div>

        <div className="auth-input-group">
          <div className="input-wrapper-premium">
            <Lock size={18} className="input-icon-premium" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading || message || !token}>
          <span>{loading ? 'Updating...' : 'Update Password'}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <footer className="auth-footer-premium">
        <p>Remembered? <Link to="/login">Sign In</Link></p>
      </footer>
    </div>
  );
};

export default ResetPassword;
