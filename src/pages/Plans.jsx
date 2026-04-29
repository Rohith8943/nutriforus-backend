import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Leaf,
  ChevronRight,
  CreditCard,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import './Plans.css';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [activePlan, setActivePlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        setActivePlan(res.data.plan);
        setSelectedPlan(res.data.plan || 'pro');
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubscribe = async (planId) => {
    if (planId === activePlan) return;
    
    try {
      setSubscribing(true);
      const res = await api.put('/auth/plan', { plan: planId });
      setActivePlan(res.data.plan);
      
      // Update localStorage so other components (like App/Layout) know
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.plan = res.data.plan;
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to update plan. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      icon: <Leaf size={24} />,
      color: '#22c55e',
      features: [
        { text: '50 curated recipes', ok: true },
        { text: '5 nutrition blogs/month', ok: true },
        { text: 'Basic meal planner', ok: true },
        { text: 'Doctor consultation', ok: false },
        { text: 'Live chat support', ok: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro Wellness',
      price: '₹10',
      period: '/demo',
      icon: <Zap size={24} />,
      color: '#3b82f6',
      highlight: true,
      badge: 'Popular',
      features: [
        { text: '500+ premium recipes', ok: true },
        { text: 'Unlimited blog access', ok: true },
        { text: 'Personalized meal plans', ok: true },
        { text: '4 doctor consults/month', ok: true },
        { text: 'Live chat support', ok: true },
      ]
    },
    {
      id: 'elite',
      name: 'Elite Health',
      price: '₹25',
      period: '/demo',
      icon: <Crown size={24} />,
      color: '#a855f7',
      features: [
        { text: 'Everything in Pro', ok: true },
        { text: 'Unlimited consultations', ok: true },
        { text: '24/7 Dedicated Doctor', ok: true },
        { text: 'Lab report analysis', ok: true },
        { text: 'Home sample collection', ok: true },
      ]
    }
  ];

  if (loading && !activePlan) {
    return (
      <div className="plans-loading">
        <div className="loading-orb" />
        <p>Fetching Your Plans...</p>
      </div>
    );
  }

  return (
    <div className="plans-page-mobile animate-fade-in">
      <header className="plans-header">
        <span className="plans-label">Special Demo Offer</span>
        <h1>Choose Your <span>Journey</span></h1>
        <p>Premium healthcare starting at just ₹10</p>
      </header>

      <div className="plans-list-mobile">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card-mobile glass-panel ${plan.id === selectedPlan ? 'active' : ''} ${plan.highlight ? 'highlight' : ''} ${plan.id === activePlan ? 'is-active' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.id === activePlan && <div className="active-tag">Current Plan</div>}
            {plan.badge && ! (plan.id === activePlan) && <div className="plan-badge-mini">{plan.badge}</div>}
            
            <div className="plan-top">
              <div className="plan-icon-circle" style={{ background: `${plan.color}20`, color: plan.color }}>
                {plan.icon}
              </div>
              <div className="plan-title-info">
                <h3>{plan.name}</h3>
                <div className="plan-price-mini">
                  <span className="amount" style={{ color: plan.id === selectedPlan ? '#fff' : plan.color }}>{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>
              <div className="plan-radio">
                <div className="radio-inner" style={{ background: plan.id === selectedPlan ? plan.color : 'transparent' }}></div>
              </div>
            </div>

            <AnimatePresence>
              {selectedPlan === plan.id && (
                <motion.div 
                  className="plan-details-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="plan-divider" />
                  <ul className="plan-features-mini">
                    {plan.features.map((f, i) => (
                      <li key={i} className={f.ok ? '' : 'disabled'}>
                        {f.ok ? <Check size={14} className="ok" /> : <X size={14} className="not-ok" />}
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`plan-subscribe-btn ${subscribing ? 'loading' : ''}`} 
                    style={{ background: plan.id === activePlan ? 'rgba(255,255,255,0.05)' : plan.color, cursor: plan.id === activePlan ? 'default' : 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan.id);
                    }}
                    disabled={subscribing || plan.id === activePlan}
                  >
                    {subscribing && selectedPlan === plan.id ? (
                      <Loader2 className="spinner" size={18} />
                    ) : plan.id === activePlan ? (
                      "Already Active"
                    ) : (
                      `Activate ${plan.name}`
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            className="subscription-success-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <CheckCircle2 size={20} />
            <span>Plan Activated Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="plans-security">
        <ShieldCheck size={18} />
        <span>Instantly Activate Demo Plans</span>
      </footer>
    </div>
  );
};

export default Plans;
