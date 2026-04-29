import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Calendar, 
  ChefHat, 
  MessageSquare,
  ChevronRight,
  Clock,
  Video,
  Activity,
  ShieldCheck,
  Bell,
  Search,
  ExternalLink,
  Target,
  TrendingUp,
  Dna,
  Sun,
  Moon
} from 'lucide-react';
import api from '../api/axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ 
    todayCalories: 0, 
    goalCalories: 2000,
    macros: { p: 0, c: 0, f: 0 },
    goals: { p: 120, c: 250, f: 70 }
  });
  const [nextApt, setNextApt] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const leadExpert = {
    name: "Dr. Chinchu Vidyadharan",
    role: "Chief Nutritionist & Medical Strategist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    bio: "Visionary behind the Nutriforus metabolic protocols with over 12 years of clinical excellence.",
    specialties: ["Metabolic Health", "Clinical Dietetics"]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        // Fetch Stats from Meal Plan
        const mealRes = await api.get('/meal-plans/my-plan');
        const planData = mealRes.data;
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        let todayCal = 0;
        let todayMacros = { p: 0, c: 0, f: 0 };
        const todayPlan = planData.days?.find(d => d.dayName === todayName);
        
        if (todayPlan && todayPlan.meals) {
          Object.values(todayPlan.meals).forEach(m => {
            if (m && m.food && m.isDone) {
              todayCal += (m.calories || 0);
              todayMacros.p += (m.protein || 0);
              todayMacros.c += (m.carbs || 0);
              todayMacros.f += (m.fats || 0);
            }
          });
        }

        setStats({ 
          todayCalories: todayCal, 
          goalCalories: planData.targetCalories || 2000,
          macros: todayMacros,
          goals: {
            p: planData.targetMacros?.protein || 120,
            c: planData.targetMacros?.carbs || 250,
            f: planData.targetMacros?.fats || 70
          }
        });

        // Fetch Appointments
        const aptRes = await api.get('/appointments');
        const upcoming = aptRes.data.filter(a => a.status !== 'cancelled' && a.status !== 'completed');
        if (upcoming.length > 0) {
          setNextApt(upcoming[0]);
        }
        // Fetch Notifications Count
        const [blogRes, recipeRes] = await Promise.all([
          api.get('/blogs'),
          api.get('/recipes')
        ]);
        
        // Fetch Chat Unread Count
        const chatUnreadRes = await api.get('/chat/unread-total');
        setUnreadChatCount(chatUnreadRes.data.count || 0);
        
        // Simple logic for unread based on last seen timestamp
        const lastSeen = new Date(localStorage.getItem('lastSeenNotifs') || 0);
        
        const unreadApts = upcoming.filter(a => new Date(a.createdAt) > lastSeen).length;
        const unreadBlogs = blogRes.data.filter(b => new Date(b.createdAt) > lastSeen).length;
        const unreadRecipes = recipeRes.data.filter(r => new Date(r.createdAt) > lastSeen).length;

        const totalUnread = unreadApts + unreadBlogs + unreadRecipes;
        setUnreadCount(totalUnread);
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPercent = (val, goal) => Math.min((val / (goal || 1)) * 100, 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return <Sun size={14} className="greet-icon sun" />;
    return <Moon size={14} className="greet-icon moon" />;
  };

  return (
    <div className="home-page-modern animate-fade-in">
      <div className="home-bg-glow"></div>

      <header className="home-header-v2">
        <div className="header-top-row">
          <div className="user-greeting">
            <span className="greet-sub">{getGreetingIcon()} {getGreeting()},</span>
            <h1 className="user-name">{user?.username || 'Guest'}</h1>
          </div>
          <div className="header-actions">
            <button className="notif-btn-glass" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-dot"></span>}
            </button>
            <button className="profile-btn-glass" onClick={() => navigate('/profile')}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="home-scroll-content">
        {nextApt && (
          <section className="live-activity-widget glass-panel" onClick={() => nextApt?.status === 'link_shared' ? window.open(nextApt.sessionLink, '_blank') : navigate('/appointments')}>
            <div className="widget-icon">
              {nextApt?.status === 'link_shared' ? <Video size={20} className="pulse-icon" /> : <Calendar size={20} />}
            </div>
            <div className="widget-info">
              <span className="widget-label">{nextApt?.status === 'link_shared' ? 'Active Session' : 'Upcoming Consult'}</span>
              <h4 className="widget-title">{nextApt?.doctorName || 'Dr. Chinchu Vidyadharan'}</h4>
              <span className="widget-time">{nextApt.time} • {nextApt.dateLabel}</span>
            </div>
            <div className="widget-action">
               {nextApt?.status === 'link_shared' ? (
                 <button className="join-btn-pulsing">Join</button>
               ) : (
                 <ChevronRight size={20} className="muted-icon" />
               )}
            </div>
          </section>
        )}

        <section className="quick-actions-row">
          <div className="action-item" onClick={() => navigate('/appointments')}>
            <div className="action-circle green-glow"><Calendar size={22} /></div>
            <span>Book</span>
          </div>
          <div className="action-item" onClick={() => navigate('/meal-planner')}>
            <div className="action-circle blue-glow"><ChefHat size={22} /></div>
            <span>Meals</span>
          </div>
          <div className="action-item" onClick={() => navigate('/chat')}>
            <div className="action-circle purple-glow">
              <MessageSquare size={22} />
              {unreadChatCount > 0 && <span className="action-badge">{unreadChatCount}</span>}
            </div>
            <span>Consult</span>
          </div>
          <div className="action-item" onClick={() => navigate('/progress')}>
            <div className="action-circle orange-glow"><Activity size={22} /></div>
            <span>Progress</span>
          </div>
        </section>

        <section className="health-dashboard-card glass-panel">
          <div className="dash-header">
            <h3>Today's Goal</h3>
            <button className="dash-link" onClick={() => navigate('/progress')}><TrendingUp size={16} /></button>
          </div>
          
          <div className="dash-body">
            <div className="cal-ring-container">
               <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill" strokeDasharray={`${getPercent(stats.todayCalories, stats.goalCalories)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="cal-info">
                <Flame size={16} className="fire-icon" />
                <span className="cal-val">{stats.todayCalories}</span>
                <span className="cal-lbl">/{stats.goalCalories}</span>
              </div>
            </div>

            <div className="macro-bars-container">
               <div className="macro-bar-row">
                 <div className="macro-lbl-row">
                   <span className="m-name p-color">Protein</span>
                   <span className="m-val">{Math.round(stats.macros.p)}g</span>
                 </div>
                 <div className="m-track"><div className="m-fill p-bg" style={{ width: `${getPercent(stats.macros.p, stats.goals.p)}%` }}></div></div>
               </div>
               <div className="macro-bar-row">
                 <div className="macro-lbl-row">
                   <span className="m-name c-color">Carbs</span>
                   <span className="m-val">{Math.round(stats.macros.c)}g</span>
                 </div>
                 <div className="m-track"><div className="m-fill c-bg" style={{ width: `${getPercent(stats.macros.c, stats.goals.c)}%` }}></div></div>
               </div>
               <div className="macro-bar-row">
                 <div className="macro-lbl-row">
                   <span className="m-name f-color">Fats</span>
                   <span className="m-val">{Math.round(stats.macros.f)}g</span>
                 </div>
                 <div className="m-track"><div className="m-fill f-bg" style={{ width: `${getPercent(stats.macros.f, stats.goals.f)}%` }}></div></div>
               </div>
            </div>
          </div>
        </section>

        <div className="dual-card-row">
          <div className="mini-feature-card-noimg glass-panel meal-gradient" onClick={() => navigate('/meal-planner')}>
            <div className="bg-shape shape-1"></div>
            <div className="card-icon-top">
              <ChefHat size={28} />
            </div>
            <div className="card-content-noimg">
              <span className="mini-tag">Next Meal</span>
              <h4>Daily Protocol</h4>
              <p>View your personalized nutrition.</p>
            </div>
          </div>

          <div className="mini-feature-card-noimg glass-panel expert-gradient" onClick={() => navigate('/chat')}>
            <div className="bg-shape shape-2"></div>
            <div className="card-icon-top">
              <ShieldCheck size={28} />
            </div>
            <div className="card-content-noimg">
              <span className="mini-tag primary-tag">Lead Expert</span>
              <h4>{leadExpert.name.split(' ')[0]} {leadExpert.name.split(' ')[1]}</h4>
              <p>Consult with our specialist.</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="about-nutriforus-card glass-panel">
          <div className="about-header">
            <div className="about-icon"><Dna size={24} /></div>
            <h3>About Nutriforus</h3>
          </div>
          <p className="about-desc">
            We are revolutionizing clinical nutrition through metabolic precision and expert-led protocols. 
            Our mission is to bridge the gap between medical science and daily lifestyle.
          </p>
          <div className="about-stats-row">
            <div className="stat-pill"><span>12+</span> Years Exp</div>
            <div className="stat-pill"><span>10k+</span> Patients</div>
          </div>
        </section>

        <div className="nav-spacer-xl"></div>
      </div>
    </div>
  );
};

export default Home;
