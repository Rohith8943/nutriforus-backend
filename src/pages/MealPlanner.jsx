import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Flame, 
  CheckCircle2,
  Calendar,
  Info,
  Apple,
  Coffee,
  Utensils,
  Moon,
  TrendingUp,
  Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MealPlanner.css';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/meal-plans/my-plan');
      setPlan(res.data);
    } catch (err) {
      console.error("Meal plan sync error:", err);
      setError(err.response?.data?.message || "Could not load meal plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleToggleMeal = async (mealType) => {
    if (!plan) return;
    try {
      // Optimistic Update
      const updatedPlan = JSON.parse(JSON.stringify(plan));
      const dayPlan = updatedPlan.days.find(d => d.dayName === activeDay);
      if (dayPlan && dayPlan.meals[mealType]) {
        dayPlan.meals[mealType].isDone = !dayPlan.meals[mealType].isDone;
        setPlan(updatedPlan);

        await api.patch('/meal-plans/toggle-done', {
          dayName: activeDay,
          mealType: mealType
        });
      }
    } catch (err) {
      console.error("Failed to toggle meal:", err);
      fetchPlan(); // Revert on error
    }
  };

  const currentDayData = plan?.days?.find(d => d.dayName === activeDay);
  const meals = currentDayData ? Object.entries(currentDayData.meals)
    .filter(([_, data]) => data && (data.food || data.title))
    .map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      id: type,
      ...data
    })) : [];

  const getMealIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'breakfast': return <Coffee size={20} />;
      case 'lunch': return <Utensils size={20} />;
      case 'dinner': return <Moon size={20} />;
      case 'snack': return <Apple size={20} />;
      default: return <Utensils size={20} />;
    }
  };

  if (loading && !plan) {
    return (
      <div className="planner-loading">
        <div className="loading-orb" />
        <p>Syncing Clinical Plan...</p>
      </div>
    );
  }

  return (
    <div className="meal-planner-view animate-fade-in">
      <header className="planner-header-fixed">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1>Meal Planner</h1>
          <div className="plan-badge">
            <TrendingUp size={14} />
            <span>Elite Plan</span>
          </div>
        </div>

        <div className="horizontal-calendar">
          {days.map((day) => (
            <button 
              key={day} 
              className={`day-card ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="day-abbr">{day.slice(0, 3)}</span>
              <span className="day-dot" />
            </button>
          ))}
        </div>
      </header>

      <div className="planner-scroll-content">
        {error ? (
          <div className="planner-empty-state glass-card">
            <div className="empty-icon-wrap"><Stethoscope size={32} /></div>
            <h3>No Active Plan</h3>
            <p>{error}</p>
            <button className="contact-btn" onClick={() => navigate('/chat')}>Contact Dr. Chinchu</button>
          </div>
        ) : (
          <>
            <div className="daily-totals-card glass-card">
              <div className="totals-row">
                <div className="total-stat">
                  <span className="stat-val">{meals.filter(m => m.isDone).length}/{meals.length}</span>
                  <span className="stat-lbl">Meals Done</span>
                </div>
                <div className="divider-v" />
                <div className="total-stat">
                  <span className="stat-val">{meals.reduce((sum, m) => sum + (m.isDone ? (m.calories || 0) : 0), 0)}</span>
                  <span className="stat-lbl">Kcal Eaten</span>
                </div>
                <div className="divider-v" />
                <div className="total-stat">
                  <span className="stat-val">{plan?.targetCalories || 1850}</span>
                  <span className="stat-lbl">Target</span>
                </div>
              </div>
              <div className="total-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(meals.filter(m => m.isDone).length / (meals.length || 1)) * 100}%` }}
                />
              </div>
              <div className="doctor-tag-mini">
                <Stethoscope size={12} />
                <span>Dr. {plan?.doctor?.username || 'Chinchu'} recommends {plan?.targetCalories || 1850} kcal</span>
              </div>
            </div>

            <div className="meals-list">
              <h3 className="section-label">{activeDay}'s Schedule</h3>
              {meals.length > 0 ? meals.map((meal, index) => (
                <div 
                  key={meal.id} 
                  className={`meal-card-premium glass-card ${meal.isDone ? 'completed' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`meal-icon-box ${meal.id}`}>
                    {getMealIcon(meal.id)}
                  </div>
                  
                  <div className="meal-info">
                    <div className="meal-top-meta">
                      <span className="meal-type-tag">{meal.type}</span>
                    </div>
                    <h4>{meal.food || meal.title}</h4>
                    <div className="meal-stats-row">
                      <span className="stat"><Flame size={14} /> {meal.calories || 0} kcal</span>
                    </div>
                  </div>

                  <button 
                    className={`meal-status-btn ${meal.isDone ? 'done' : ''}`}
                    onClick={() => handleToggleMeal(meal.id)}
                    aria-label={meal.isDone ? "Mark as undone" : "Mark as done"}
                  >
                    {meal.isDone ? <CheckCircle2 size={26} /> : <div className="circle-outline" />}
                  </button>
                </div>
              )) : (
                <div className="empty-day-box glass-card">
                  <p>Rest Day: No specific clinical meals assigned for today.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default MealPlanner;
