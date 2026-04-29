import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  X, 
  Video, 
  ExternalLink,
  Lock,
  Plus,
  Info
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userPlan, setUserPlan] = useState('starter');
  const [confirmCancel, setConfirmCancel] = useState(null);

  const canBook = userPlan === "pro" || userPlan === "elite";

  const fetchUserAndAppts = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/auth/me');
      const latestPlan = profileRes.data.plan || 'starter';
      setUserPlan(latestPlan.toLowerCase());

      // Sync localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.plan = latestPlan;
      localStorage.setItem('user', JSON.stringify(user));

      const apptRes = await api.get('/appointments');
      setAppts(apptRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndAppts();
  }, []);

  const handleCancel = async () => {
    if (!confirmCancel) return;
    try {
      await api.put(`/appointments/${confirmCancel._id}/cancel`);
      setConfirmCancel(null);
      fetchUserAndAppts();
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const upcoming = appts.filter(a => a.status !== "cancelled" && a.status !== "completed" && a.date >= todayStr);
  const past = appts.filter(a => a.status === "cancelled" || a.status === "completed" || a.date < todayStr);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'link_shared': return '#22c55e';
      case 'completed': return '#a855f7';
      case 'cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  if (loading && appts.length === 0) {
    return (
      <div className="appt-loading">
        <div className="loading-orb" />
        <p>Syncing Clinical Sessions...</p>
      </div>
    );
  }

  return (
    <div className="appointments-view animate-fade-in">
      <header className="appt-view-header">
        <div className="header-top-row">
          <button className="back-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1>Consultations</h1>
          <button className="add-btn-circle" onClick={() => canBook ? navigate('/book-appointment') : navigate('/plans')}>
            <Plus size={24} />
          </button>
        </div>
        
        <div className="appt-tabs-modern">
          <button 
            className={`appt-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming <span>{upcoming.length}</span>
          </button>
          <button 
            className={`appt-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            History <span>{past.length}</span>
          </button>
        </div>
      </header>

      <div className="appt-scroll-area">
        {!canBook && (
          <div className="plan-gate-card glass-panel">
            <div className="gate-icon"><Lock size={24} /></div>
            <h3>Upgrade Required</h3>
            <p>Booking consultations requires a Pro or Elite plan.</p>
            <Link to="/plans" className="upgrade-link">View Plans <ChevronRight size={16} /></Link>
          </div>
        )}

        <div className="appt-list-container">
          {(activeTab === 'upcoming' ? upcoming : past).length === 0 ? (
            <div className="appt-empty-state">
              <CalendarIcon size={48} className="empty-icon" />
              <p>No {activeTab} appointments found.</p>
              {activeTab === 'upcoming' && canBook && (
                <button className="book-now-btn" onClick={() => navigate('/book-appointment')}>Book your first session</button>
              )}
            </div>
          ) : (
            (activeTab === 'upcoming' ? upcoming : past).map((a, idx) => (
              <div key={a._id} className={`appt-card-premium glass-panel ${a.status === 'link_shared' ? 'ready' : ''}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="appt-card-header">
                  <div className="appt-doc-info">
                    <span className="doc-emoji">{a.doctorEmoji || '👩‍⚕️'}</span>
                    <div className="doc-txt">
                      <h4>{a.doctorName}</h4>
                      <span className="doc-spec">{a.doctorSpec}</span>
                    </div>
                  </div>
                  <div className="appt-status-tag" style={{ backgroundColor: `${getStatusColor(a.status)}20`, color: getStatusColor(a.status) }}>
                    {a.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="appt-card-body">
                  <div className="appt-meta-item">
                    <CalendarIcon size={14} />
                    <span>{a.dateLabel}</span>
                  </div>
                  <div className="appt-meta-item">
                    <Clock size={14} />
                    <span>{a.time}</span>
                  </div>
                  <div className="appt-meta-item">
                    <Info size={14} />
                    <span>{a.reason}</span>
                  </div>
                </div>

                <div className="appt-card-footer">
                  {a.status === 'link_shared' && a.sessionLink && (
                    <a href={a.sessionLink} target="_blank" rel="noopener noreferrer" className="join-session-btn">
                      <Video size={16} /> Join Live Session <ExternalLink size={14} />
                    </a>
                  )}
                  {(a.status === 'pending' || a.status === 'confirmed') && (
                    <button className="cancel-appt-btn" onClick={() => setConfirmCancel(a)}>Cancel Session</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Confirmation Overlay */}
      {confirmCancel && (
        <div className="appt-modal-overlay">
          <div className="cancel-confirm-modal glass-panel">
            <div className="warning-icon-wrap"><X size={32} /></div>
            <h3>Cancel Session?</h3>
            <p>Are you sure you want to cancel your consultation on <strong>{confirmCancel.dateLabel}</strong>?</p>
            <div className="confirm-btn-row">
              <button className="keep-btn" onClick={() => setConfirmCancel(null)}>Keep it</button>
              <button className="cancel-final-btn" onClick={handleCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
