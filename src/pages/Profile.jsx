import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Settings, 
  HeartPulse, 
  CalendarCheck, 
  Bookmark, 
  BarChart3, 
  ChevronRight, 
  ShieldCheck, 
  LogOut, 
  Camera,
  Flame,
  User as UserIcon,
  Bell,
  Activity,
  Crown
} from 'lucide-react';
import api from '../api/axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ streak: 0, recipes: 0, appointments: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        const meRes = await api.get('/auth/me');
        setStats(s => ({ ...s, streak: meRes.data.streak || 0 }));
        setUser(prev => ({ ...prev, ...meRes.data }));

        const aptRes = await api.get('/appointments');
        setStats(s => ({ ...s, appointments: aptRes.data.length }));

        // Assuming recipes are stored in user meta or fetched
        const savedRes = await api.get('/recipes/saved');
        setStats(s => ({ ...s, recipes: savedRes.data.length }));
      } catch (err) {
        console.error("Profile sync error:", err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file);
      const res = await api.put('/auth/profile', { avatar: compressedBase64 });
      setUser(prev => ({ ...prev, ...res.data }));
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to update profile photo.");
    }
  };

  const menuItems = [
    { label: "Health Profile", icon: <HeartPulse />, path: "/health-profile", color: "#f43f5e" },
    { label: "My Appointments", icon: <CalendarCheck />, path: "/appointments", color: "#3b82f6" },
    { label: "Saved Recipes", icon: <Bookmark />, path: "/saved-recipes", color: "#22c55e" },
    { label: "My Progress", icon: <BarChart3 />, path: "/progress", color: "#f59e0b" },
    { label: "My Clinical Plan", icon: <Crown />, path: "/plans", color: "#a855f7" },
    { label: "Account Settings", icon: <Settings />, path: "/settings", color: "#64748b" },
  ];

  return (
    <div className="app-profile-view animate-fade-in fit-screen">
      <header className="app-profile-header">
        <div className="profile-top-actions">
          <h3>Profile</h3>
          <div className="action-btns">
            <button className="icon-btn-minimal"><Bell size={20} /></button>
            <button className="icon-btn-minimal" onClick={() => navigate("/settings")}><Settings size={20} /></button>
          </div>
        </div>
        
        <div className="profile-hero-section">
          <div className="avatar-wrapper">
            <div className="avatar-main">
              {user?.avatar ? (
                <img src={user.avatar} alt="User" />
              ) : (
                <div className="avatar-letter">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <button className="avatar-edit-fab" onClick={() => fileInputRef.current.click()}>
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <h2 className="display-name">{user?.username || 'User'} 🌿</h2>
          <p className="display-email">{user?.email || 'user@nutriforus.com'}</p>
          <div className="badge-pill-clinical" onClick={() => navigate('/plans')} style={{ cursor: 'pointer' }}>
            <Crown size={14} style={{ color: user?.plan === 'elite' ? '#f59e0b' : user?.plan === 'pro' ? '#3b82f6' : '#22c55e' }} />
            <span style={{ textTransform: 'capitalize' }}>{user?.plan || 'Starter'} Plan</span>
          </div>
        </div>
      </header>

      <section className="clinical-stats-grid">
        <div className="stat-card-pill">
          <div className="stat-icon-wrap" style={{ color: "#f43f5e" }}><Flame size={20} /></div>
          <div className="stat-content">
            <span className="val">{stats.streak}</span>
            <span className="lbl">Day Streak</span>
          </div>
        </div>
        <div className="stat-card-pill" onClick={() => navigate('/saved-recipes')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrap" style={{ color: "#22c55e" }}><Bookmark size={20} /></div>
          <div className="stat-content">
            <span className="val">{stats.recipes}</span>
            <span className="lbl">Saved</span>
          </div>
        </div>
        <div className="stat-card-pill" onClick={() => navigate('/appointments')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrap" style={{ color: "#3b82f6" }}><CalendarCheck size={20} /></div>
          <div className="stat-content">
            <span className="val">{stats.appointments}</span>
            <span className="lbl">Booked</span>
          </div>
        </div>
      </section>

      <section className="profile-navigation-list">
        {menuItems.map((item, i) => (
          <Link to={item.path} key={i} className="nav-item-tile glass-panel">
            <div className="nav-item-left">
              <div className="nav-icon-box" style={{ background: `${item.color}18`, color: item.color }}>
                {item.icon}
              </div>
              <span className="nav-label">{item.label}</span>
            </div>
            <ChevronRight size={18} className="nav-arrow" />
          </Link>
        ))}
      </section>

      <section className="profile-auth-actions">
        <button className="btn-logout-clinical" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </section>

      <footer className="profile-app-footer">
        <p>Nutriforus v1.0.4 • Clinical Edition</p>
      </footer>
    </div>
  );
};

export default Profile;
