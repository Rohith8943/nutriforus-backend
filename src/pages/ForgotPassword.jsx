import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft, KeyRound, Lock, EyeOff, Eye } from 'lucide-react';
import api from '../api/axios';
import './Login.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'OTP sent to your email.');
      setTimeout(() => {
        setMessage('');
        setStep(2);
      }, 1500);
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setMessage('OTP Verified.');
      setTimeout(() => {
        setMessage('');
        setStep(3);
      }, 1000);
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await api.post('/auth/reset-password', { email, otp, password });
      setMessage(response.data.message || 'Password successfully reset.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to reset password.');
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
        <h1 className="auth-title">
          {step === 1 && "Reset Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "New Password"}
        </h1>
        <p className="auth-subtitle">
          {step === 1 && "Enter your email to receive a secure code"}
          {step === 2 && `Code sent to ${email}`}
          {step === 3 && "Secure your clinical account"}
        </p>
      </header>

      {/* Step 1: Request OTP */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="auth-form animate-fade-in">
          {error && <div className="auth-error-chip animate-shake"><span>{error}</span></div>}
          {message && <div className="auth-error-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}><span>{message}</span></div>}
          
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

          <button type="submit" className="auth-submit-btn" disabled={loading || message}>
            <span>{loading ? 'Sending...' : 'Send OTP'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="auth-form animate-fade-in">
          {error && <div className="auth-error-chip animate-shake"><span>{error}</span></div>}
          {message && <div className="auth-error-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}><span>{message}</span></div>}
          
          <div className="auth-input-group">
            <div className="input-wrapper-premium">
              <KeyRound size={18} className="input-icon-premium" />
              <input 
                type="text" 
                placeholder="6-Digit OTP Code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ letterSpacing: '4px', fontWeight: '800' }}
                required 
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading || message}>
            <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="auth-form animate-fade-in">
          {error && <div className="auth-error-chip animate-shake"><span>{error}</span></div>}
          {message && <div className="auth-error-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}><span>{message}</span></div>}
          
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

          <button type="submit" className="auth-submit-btn" disabled={loading || message}>
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      <footer className="auth-footer-premium" style={{ marginTop: '20px' }}>
        <p>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
