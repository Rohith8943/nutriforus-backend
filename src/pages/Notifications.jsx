import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  TrendingUp,
  Settings,
  ChefHat,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const [aptRes, userRes, blogRes, recipeRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/auth/me'),
          api.get('/blogs'),
          api.get('/recipes')
        ]);

        const realNotifs = [];

        // 1. Appointment Notifications (Confirmed/Pending)
        const sortedApts = aptRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        sortedApts.slice(0, 3).forEach(apt => {
          const isConfirmed = apt.status === 'confirmed' || apt.status === 'link_shared';
          realNotifs.push({
            id: `apt-${apt._id}`,
            type: 'appointment',
            title: isConfirmed ? 'Consultation Confirmed' : 'Appointment Request',
            msg: isConfirmed 
              ? `Great news! Dr. Chinchu has confirmed your session for ${apt.dateLabel}.`
              : `Your request for a session on ${apt.dateLabel} has been received.`,
            time: 'Recently',
            icon: <Calendar size={18} />,
            color: isConfirmed ? 'green' : 'blue',
            unread: isConfirmed
          });
        });

        // 2. New Blog Notification
        if (blogRes.data.length > 0) {
          const latestBlog = blogRes.data[0];
          realNotifs.push({
            id: `blog-${latestBlog._id}`,
            type: 'content',
            title: 'New Clinical Insight',
            msg: `Read our latest article: "${latestBlog.title}"`,
            time: 'New',
            icon: <FileText size={18} />,
            color: 'purple',
            unread: true
          });
        }

        // 3. New Recipe Notification
        if (recipeRes.data.length > 0) {
          const latestRecipe = recipeRes.data[0];
          realNotifs.push({
            id: `recipe-${latestRecipe._id}`,
            type: 'recipe',
            title: 'New Featured Recipe',
            msg: `Try our new protocol-friendly: ${latestRecipe.name}`,
            time: 'Today',
            icon: <ChefHat size={18} />,
            color: 'orange',
            unread: true
          });
        }

        // 4. Welcome Notification (at the end)
        realNotifs.push({
          id: 'welcome',
          type: 'system',
          title: 'Welcome to Nutriforus',
          msg: `Hello ${userRes.data.username}, your clinical journey has officially started.`,
          time: 'System',
          icon: <ShieldCheck size={18} />,
          color: 'blue',
          unread: false
        });

        setNotifications(realNotifs);
        localStorage.setItem('lastSeenNotifs', new Date().toISOString());
      } catch (err) {
        console.error("Failed to fetch real notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  return (
    <div className="notifications-page animate-fade-in">
      <header className="notif-header">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Notifications</h1>
        <button className="notif-settings-btn" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </button>
      </header>



      <div className="notifications-list">
        {loading ? (
          <div className="loading-notifs">Synchronizing clinical updates...</div>
        ) : notifications.length > 0 ? (
          notifications.map((n, i) => (
            <div 
              key={n.id} 
              className={`notif-card glass-panel ${n.unread ? 'unread' : ''} animate-slide-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`notif-icon-bg ${n.color}`}>
                {n.icon}
              </div>
              <div className="notif-body">
                <div className="notif-top">
                  <h4>{n.title}</h4>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p>{n.msg}</p>
              </div>
              {n.unread && <div className="unread-indicator"></div>}
            </div>
          ))
        ) : (
          <div className="empty-notifs">No clinical updates at this time.</div>
        )}
      </div>

      <div className="nav-spacer-xl" />
    </div>
  );
};

export default Notifications;
