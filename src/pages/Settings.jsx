import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Bell, 
  Palette, 
  Moon, 
  Sun, 
  ChevronRight, 
  FileText, 
  Smartphone,
  Eye,
  EyeOff,
  LogOut,
  ChevronLeft,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false';
  });
  const [notifications, setNotifications] = useState(true);
  const [modal, setModal] = useState(null); // 'password', 'privacy', 'terms'
  const [passwordData, setPasswordData] = useState({ old: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [feedback, setFeedback] = useState(null); // { msg, type }

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    // In a real app, we would apply a class to body here
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      showToast("Passwords don't match!", "error");
      return;
    }
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwordData.old,
        newPassword: passwordData.new
      });
      showToast("Password updated successfully!");
      setModal(null);
      setPasswordData({ old: '', new: '', confirm: '' });
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className="settings-page-mobile animate-fade-in">
      <header className="settings-header-mini">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Settings</h1>
      </header>

      <section className="settings-section-mobile">
        <h3 className="section-title-small">Appearance</h3>
        <div className="setting-tile glass-panel">
          <div className="tile-info">
            <div className="tile-icon-bg"><Palette size={18} /></div>
            <div className="tile-text">
              <span>Dark Mode</span>
              <p>OLED Optimized</p>
            </div>
          </div>
          <button 
            className={`toggle-pill ${darkMode ? 'active' : ''}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="pill-knob">
              {darkMode ? <Moon size={10} /> : <Sun size={10} />}
            </div>
          </button>
        </div>
      </section>

      <section className="settings-section-mobile">
        <h3 className="section-title-small">Security & Privacy</h3>
        <div className="setting-tile glass-panel" onClick={() => setModal('password')}>
          <div className="tile-info">
            <div className="tile-icon-bg"><Lock size={18} /></div>
            <div className="tile-text">
              <span>Change Password</span>
              <p>Keep your account secure</p>
            </div>
          </div>
          <ChevronRight size={18} className="chevron-muted" />
        </div>
        <div className="setting-tile glass-panel" onClick={() => navigate('/privacy')}>
          <div className="tile-info">
            <div className="tile-icon-bg"><Shield size={18} /></div>
            <div className="tile-text">
              <span>Privacy Agreement</span>
              <p>Clinical data protection</p>
            </div>
          </div>
          <ChevronRight size={18} className="chevron-muted" />
        </div>
      </section>

      <section className="settings-section-mobile">
        <h3 className="section-title-small">Notifications</h3>
        <div className="setting-tile glass-panel">
          <div className="tile-info">
            <div className="tile-icon-bg"><Bell size={18} /></div>
            <div className="tile-text">
              <span>Push Notifications</span>
              <p>Reminders & updates</p>
            </div>
          </div>
          <button 
            className={`toggle-pill ${notifications ? 'active' : ''}`}
            onClick={() => setNotifications(!notifications)}
          >
            <div className="pill-knob"></div>
          </button>
        </div>
      </section>

      <section className="settings-section-mobile">
        <h3 className="section-title-small">App Info</h3>
        <div className="setting-tile glass-panel">
          <div className="tile-info">
            <div className="tile-icon-bg"><Smartphone size={18} /></div>
            <div className="tile-text">
              <span>App Version</span>
              <p>v1.0.4 - Nutriforus Mobile</p>
            </div>
          </div>
          <span className="version-label">Latest</span>
        </div>
        <div className="setting-tile glass-panel" onClick={() => navigate('/terms')}>
          <div className="tile-info">
            <div className="tile-icon-bg"><FileText size={18} /></div>
            <div className="tile-text">
              <span>Terms of Service</span>
            </div>
          </div>
          <ChevronRight size={18} className="chevron-muted" />
        </div>
      </section>

      <div className="settings-footer">
        <button className="logout-tile glass-panel" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout Account</span>
        </button>
        <p className="legal-text">© 2026 Nutriforus Clinical Platform. All rights reserved.</p>
      </div>

      {/* Modals */}
      {modal === 'password' && (
        <div className="settings-modal-overlay">
          <div className="settings-modal glass-panel animate-slide-up">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="close-btn" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group-modern">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPass.old ? "text" : "password"} 
                    required
                    value={passwordData.old}
                    onChange={e => setPasswordData({...passwordData, old: e.target.value})}
                  />
                  <button 
                    type="button" 
                    className="eye-btn"
                    onClick={() => setShowPass({...showPass, old: !showPass.old})}
                  >
                    {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group-modern">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPass.new ? "text" : "password"} 
                    required
                    value={passwordData.new}
                    onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                  />
                  <button 
                    type="button" 
                    className="eye-btn"
                    onClick={() => setShowPass({...showPass, new: !showPass.new})}
                  >
                    {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group-modern">
                <label>Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPass.confirm ? "text" : "password"} 
                    required
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                  <button 
                    type="button" 
                    className="eye-btn"
                    onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                  >
                    {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="modal-submit-btn">Update Password</button>
            </form>
          </div>
        </div>
      )}


      {/* Feedback Toast */}
      {feedback && (
        <div className={`settings-toast glass-panel animate-slide-up ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
