import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  Target, 
  Trophy, 
  Calendar,
  ChevronLeft,
  ArrowUpRight,
  Droplets,
  Activity,
  Zap,
  TrendingUp,
  Apple,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Progress.css';

const Progress = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayCalories: 0,
    goalCalories: 2000,
    avgCalories: 0,
    streak: 0,
    goalsMet: 0,
    totalDays: 7
  });
  const [weekly, setWeekly] = useState([]);
  const [macros, setMacros] = useState([
    { label: "Protein", val: 0, goal: 120, unit: "g", color: "#22c55e" },
    { label: "Carbs", val: 0, goal: 250, unit: "g", color: "#3b82f6" },
    { label: "Fats", val: 0, goal: 70, unit: "g", color: "#f59e0b" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch User (Streak)
        const userRes = await api.get('/auth/me');
        const userData = userRes.data;
        
        // 2. Fetch Meal Plan (Calories & Goals)
        const mealRes = await api.get('/meal-plans/my-plan');
        const planData = mealRes.data;
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const targetCal = planData.targetCalories || 2000;
        
        let totalCalSum = 0;
        let daysMetCount = 0;
        let todayCal = 0;
        let todayMacros = { p: 0, c: 0, f: 0 };

        const newWeekly = planData.days.map(d => {
          let dayCal = 0;
          let dayDone = 0;
          let dayTotal = 0;
          
          Object.values(d.meals).forEach(m => {
            if (m && m.food) {
              dayTotal++;
              if (m.isDone) {
                dayCal += (m.calories || 0);
                dayDone++;
                if (d.dayName === today) {
                  todayMacros.p += (m.protein || 0);
                  todayMacros.c += (m.carbs || 0);
                  todayMacros.f += (m.fats || 0);
                }
              }
            }
          });

          // A day is "Met" if all assigned meals are marked as done
          if (dayTotal > 0 && dayDone === dayTotal) daysMetCount++;
          if (d.dayName === today) todayCal = dayCal;
          totalCalSum += dayCal;

          return { 
            day: d.dayName.slice(0,3), 
            val: dayCal, 
            goal: targetCal 
          };
        });

        setWeekly(newWeekly);
        setStats({ 
          todayCalories: todayCal, 
          goalCalories: targetCal,
          avgCalories: Math.round(totalCalSum / (newWeekly.length || 7)),
          streak: userData.streak || 0,
          goalsMet: daysMetCount,
          totalDays: planData.days.length || 7
        });
        
        setMacros([
          { label: "Protein", val: todayMacros.p, goal: planData.targetMacros?.protein || 120, unit: "g", color: "#22c55e" },
          { label: "Carbs", val: todayMacros.c, goal: planData.targetMacros?.carbs || 250, unit: "g", color: "#3b82f6" },
          { label: "Fats", val: todayMacros.f, goal: planData.targetMacros?.fats || 70, unit: "g", color: "#f59e0b" },
        ]);
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    { label: "Today's Cal", val: stats.todayCalories.toLocaleString(), goal: stats.goalCalories, color: "#f97316", icon: <Flame size={20} /> },
    { label: "Avg Calories", val: stats.avgCalories.toLocaleString(), sub: "This week", color: "#ef4444", icon: <Activity size={20} /> },
    { label: "Active Streak", val: `${stats.streak} Days`, sub: "Keep it up!", color: "#f59e0b", icon: <Trophy size={20} /> },
    { label: "Perfect Days", val: `${stats.goalsMet}/${stats.totalDays}`, sub: "This week", color: "#22c55e", icon: <Target size={20} /> },
  ];

  if (loading) {
    return (
      <div className="progress-page-mobile loading">
        <div className="loading-spinner-orb" />
        <p>Analyzing Metabolic Data...</p>
      </div>
    );
  }

  return (
    <div className="progress-page-mobile animate-fade-in">
      <header className="progress-header-premium">
        <div className="header-actions">
          <button className="back-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1>Health Insights</h1>
          <button className="report-btn-mini"><Info size={20} /></button>
        </div>
        <div className="premium-label">
          <Zap size={14} />
          <span>Real-time Clinical Sync</span>
        </div>
      </header>

      <div className="progress-scroll-area">
        <div className="progress-summary-grid">
          {summaryCards.map((s, i) => (
            <div key={i} className="stat-summary-card glass-panel" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon-mini" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div className="stat-vals">
                <span className="main-val">{s.val}</span>
                <span className="sub-val">{s.goal ? `/ ${s.goal}` : s.sub}</span>
              </div>
              <span className="stat-label-mini">{s.label}</span>
            </div>
          ))}
        </div>

        <section className="weekly-activity-section glass-panel animate-slide-up">
          <div className="section-header-compact">
            <div className="head-txt">
              <h3>Weekly Calories</h3>
              <p>Your metabolic activity over 7 days</p>
            </div>
            <div className="avg-pill">Avg: {stats.avgCalories}</div>
          </div>
          
          <div className="bar-chart-modern">
            {weekly.map((d, i) => (
              <div key={i} className="chart-col">
                <div className="bar-wrapper">
                  <div 
                    className={`bar-fill-modern ${d.val > d.goal ? 'over' : d.val > 0 ? 'met' : 'empty'}`} 
                    style={{ height: `${Math.min((d.val / (stats.goalCalories * 1.5)) * 100, 100)}%` }}
                  >
                    {d.val > 0 && <div className="bar-val-hint">{Math.round(d.val)}</div>}
                  </div>
                </div>
                <span className="day-lbl-modern">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend-modern">
            <div className="legend-item"><div className="dot met"></div> <span>On Track</span></div>
            <div className="legend-item"><div className="dot over"></div> <span>Surplus</span></div>
          </div>
        </section>

        <section className="macros-breakdown glass-panel animate-slide-up">
          <div className="section-header-compact">
            <div className="head-txt">
              <h3>Macronutrients</h3>
              <p>Today's structural intake</p>
            </div>
            <TrendingUp size={20} className="header-icon" />
          </div>
          <div className="macros-list-modern">
            {macros.map((m, i) => (
              <div key={i} className="macro-progress-item-modern">
                <div className="macro-info-row">
                  <div className="macro-name-wrap">
                    <div className="macro-dot" style={{ backgroundColor: m.color }} />
                    <span className="macro-name">{m.label}</span>
                  </div>
                  <span className="macro-vals"><b>{m.val}{m.unit}</b> / {m.goal}{m.unit}</span>
                </div>
                <div className="progress-track-modern">
                  <div 
                    className="progress-fill-modern" 
                    style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="clinical-insight-card glass-panel">
          <Activity size={24} className="insight-icon" />
          <div className="insight-content">
            <h4>Clinical Insight</h4>
            <p>Your calorie intake is <b>{stats.todayCalories < stats.goalCalories ? 'below' : 'above'}</b> your metabolic target for today. Consuming protein within 30 mins of activity boosts recovery.</p>
          </div>
        </div>

        <button className="health-report-btn-premium">
          <ArrowUpRight size={20} />
          <span>Download Weekly Health Report</span>
        </button>
        
        <div className="nav-spacer-xl" />
      </div>
    </div>
  );
};

export default Progress;
