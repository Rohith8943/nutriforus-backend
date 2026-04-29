import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  User, 
  Activity, 
  Dna,
  Leaf,
  CheckCircle2,
  Save,
  Info,
  Scale,
  Ruler,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './HealthProfile.css';

const STEPS = [
  { id: "personal", label: "Basic", icon: <User size={18} /> },
  { id: "body", label: "Metrics", icon: <Scale size={18} /> },
  { id: "medical", label: "Clinical", icon: <Dna size={18} /> },
  { id: "diet", label: "Lifestyle", icon: <Leaf size={18} /> },
];

const GOALS_LIST = [
  "Weight Loss", "Weight Gain", "Maintain Weight",
  "Muscle Building", "Manage Diabetes", "Manage PCOS",
  "Improve Gut Health", "Heart Health", "Improve Energy",
];

const CONDITIONS = [
  "Diabetes (Type 2)", "Pre-Diabetes", "Hypertension", "PCOS/PCOD",
  "Hypothyroidism", "High Cholesterol", "IBS / Gut Issues",
  "Celiac Disease", "Anemia", "None",
];

const ALLERGIES = [
  "Gluten", "Dairy", "Eggs", "Nuts", "Soy",
  "Shellfish", "Fish", "Peanuts", "None",
];

const DIET_PREFS = [
  "Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian",
  "Keto", "Paleo", "Mediterranean", "Jain", "No Preference",
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "No exercise" },
  { id: "light", label: "Light", desc: "1–3 days/week" },
  { id: "moderate", label: "Moderate", desc: "3–5 days/week" },
  { id: "active", label: "Active", desc: "Daily exercise" },
];

const EMPTY_PROFILE = {
  firstName: "", lastName: "", dob: "", gender: "", phone: "",
  height: "", weight: "", bloodGroup: "", targetWeight: "",
  conditions: [], medications: "", allergies: [], lastCheckup: "",
  dietPreference: [], goals: [], activityLevel: "",
  smokingStatus: "No", alcoholStatus: "No",
};

const HealthProfile = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/health-profile');
        if (res.data) {
          setData({ ...EMPTY_PROFILE, ...res.data });
        }
      } catch (err) {
        console.error("Health profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (key, val) => setData(p => ({ ...p, [key]: val }));

  const toggleMulti = (key, val) => {
    const current = data[key] || [];
    const updated = current.includes(val) 
      ? current.filter(v => v !== val) 
      : [...current, val];
    setData(p => ({ ...p, [key]: updated }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/health-profile', data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save profile. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const bmi = data.height && data.weight
    ? (data.weight / ((data.height / 100) ** 2)).toFixed(1)
    : null;

  const getBMILabel = (val) => {
    if (val < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (val < 25) return { label: "Healthy", color: "#22c55e" };
    if (val < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obese", color: "#ef4444" };
  };

  if (loading && !data.firstName) {
    return (
      <div className="hp-loading-view">
        <div className="hp-orb" />
        <p>Syncing Health Profile...</p>
      </div>
    );
  }

  return (
    <div className="hp-view-mobile animate-fade-in">
      <header className="hp-header-fixed">
        <div className="hp-header-top">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1>Health Profile</h1>
          <button className="save-icon-btn" onClick={handleSave} disabled={saving}>
            {saving ? <div className="hp-spinner-mini" /> : <Save size={20} />}
          </button>
        </div>
        
        <div className="hp-stepper-modern">
          {STEPS.map((s, i) => (
            <button 
              key={s.id} 
              className={`hp-step-btn ${activeStep === i ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
              onClick={() => setActiveStep(i)}
            >
              <div className="step-icon-wrap">{i < activeStep ? <CheckCircle2 size={16} /> : s.icon}</div>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="hp-content-scrollable">
        {/* Step 0: Personal */}
        {activeStep === 0 && (
          <div className="hp-form-section animate-slide-up">
            <div className="hp-group glass-panel">
              <label>Full Name</label>
              <div className="hp-input-row">
                <input 
                  placeholder="First Name" 
                  value={data.firstName} 
                  onChange={e => handleChange('firstName', e.target.value)} 
                />
                <input 
                  placeholder="Last Name" 
                  value={data.lastName} 
                  onChange={e => handleChange('lastName', e.target.value)} 
                />
              </div>
            </div>

            <div 
              className="dob-card glass-panel clickable" 
              onClick={() => setShowDatePicker(true)}
            >
              <div className="dob-label-row">
                <span className="dob-section-label">Date of Birth</span>
                {data.dob ? (
                  <span className="dob-preview">
                    {new Date(data.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                ) : (
                  <span className="dob-placeholder">Set Date</span>
                )}
              </div>
            </div>

            {showDatePicker && (
              <div className="hp-modal-overlay animate-fade-in" onClick={() => setShowDatePicker(false)}>
                <div className="hp-calendar-modal animate-slide-up" onClick={e => e.stopPropagation()}>
                  <div className="calendar-header">
                    <button 
                      className="cal-nav" 
                      onClick={() => {
                        if (viewMode === 'month') {
                          setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)));
                        } else {
                          setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() - 12)));
                        }
                      }}
                    >❮</button>
                    <div className="cal-title clickable" onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}>
                      {viewMode === 'month' 
                        ? viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                        : `Select Year`}
                    </div>
                    <button 
                      className="cal-nav" 
                      onClick={() => {
                        if (viewMode === 'month') {
                          setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)));
                        } else {
                          setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() + 12)));
                        }
                      }}
                    >❯</button>
                  </div>
                  
                  {viewMode === 'month' ? (
                    <div className="calendar-grid">
                      {['S','M','T','W','T','F','S'].map(d => <div key={d} className="cal-day-label">{d}</div>)}
                      {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="cal-day empty" />
                      ))}
                      {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = data.dob === dateStr;
                        return (
                          <div 
                            key={day} 
                            className={`cal-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              handleChange('dob', dateStr);
                              setShowDatePicker(false);
                            }}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="year-grid">
                      {Array.from({ length: 12 }, (_, i) => viewDate.getFullYear() - 5 + i).map(y => (
                        <div 
                          key={y} 
                          className={`year-chip ${viewDate.getFullYear() === y ? 'selected' : ''}`}
                          onClick={() => {
                            setViewDate(new Date(viewDate.setFullYear(y)));
                            setViewMode('month');
                          }}
                        >
                          {y}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="calendar-footer-minimal">
                    <button className="cal-today-btn" onClick={() => {
                      setViewDate(new Date());
                      setViewMode('month');
                    }}>Go to Today</button>
                    <button className="cal-close-btn" onClick={() => setShowDatePicker(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="hp-group glass-panel">
              <label>Gender</label>
              <div className="hp-gender-row">
                {["Male", "Female", "Other"].map(g => (
                  <button 
                    key={g} 
                    className={`hp-gender-btn ${data.gender === g ? 'active' : ''}`}
                    onClick={() => handleChange('gender', g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-group glass-panel">
              <label>Blood Group</label>
              <div className="blood-group-grid">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <button
                    key={bg}
                    className={`blood-group-chip ${data.bloodGroup === bg ? 'active' : ''}`}
                    onClick={() => handleChange('bloodGroup', bg)}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Body */}
        {activeStep === 1 && (
          <div className="hp-form-section animate-slide-up">
            <div className="hp-metrics-grid">
              <div className="metric-card glass-panel">
                <Ruler size={20} className="m-icon" />
                <input 
                  type="number" 
                  placeholder="0"
                  value={data.height} 
                  onChange={e => handleChange('height', e.target.value)} 
                />
                <span className="m-unit">cm (Height)</span>
              </div>
              <div className="metric-card glass-panel">
                <Scale size={20} className="m-icon" />
                <input 
                  type="number" 
                  placeholder="0"
                  value={data.weight} 
                  onChange={e => handleChange('weight', e.target.value)} 
                />
                <span className="m-unit">kg (Weight)</span>
              </div>
            </div>

            {bmi && (
              <div className="bmi-display-card glass-panel">
                <div className="bmi-val-wrap">
                  <span className="bmi-val">{bmi}</span>
                  <span className="bmi-label" style={{ color: getBMILabel(bmi).color }}>{getBMILabel(bmi).label}</span>
                </div>
                <div className="bmi-bar">
                  <div className="bmi-fill" style={{ width: `${Math.min(bmi * 2.5, 100)}%`, background: getBMILabel(bmi).color }} />
                </div>
              </div>
            )}

            <div className="hp-group glass-panel">
              <label>Target Weight (kg)</label>
              <input 
                type="number" 
                value={data.targetWeight} 
                onChange={e => handleChange('targetWeight', e.target.value)} 
              />
            </div>
          </div>
        )}

        {/* Step 2: Clinical */}
        {activeStep === 2 && (
          <div className="hp-form-section animate-slide-up">
            <div className="hp-group-modern">
              <label>Existing Conditions</label>
              <div className="hp-chip-grid">
                {CONDITIONS.map(c => (
                  <button 
                    key={c} 
                    className={`hp-chip-btn ${data.conditions?.includes(c) ? 'active' : ''}`}
                    onClick={() => toggleMulti('conditions', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-group-modern">
              <label>Food Allergies</label>
              <div className="hp-chip-grid">
                {ALLERGIES.map(a => (
                  <button 
                    key={a} 
                    className={`hp-chip-btn ${data.allergies?.includes(a) ? 'active' : ''}`}
                    onClick={() => toggleMulti('allergies', a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-group glass-panel">
              <label>Medications</label>
              <textarea 
                placeholder="List any regular medications..."
                value={data.medications}
                onChange={e => handleChange('medications', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {activeStep === 3 && (
          <div className="hp-form-section animate-slide-up">
            <div className="hp-group-modern">
              <label>Dietary Preference</label>
              <div className="hp-chip-grid">
                {DIET_PREFS.map(dp => (
                  <button 
                    key={dp} 
                    className={`hp-chip-btn ${data.dietPreference?.includes(dp) ? 'active' : ''}`}
                    onClick={() => toggleMulti('dietPreference', dp)}
                  >
                    {dp}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-group-modern">
              <label>Primary Health Goals</label>
              <div className="hp-chip-grid">
                {GOALS_LIST.map(g => (
                  <button 
                    key={g} 
                    className={`hp-chip-btn ${data.goals?.includes(g) ? 'active' : ''}`}
                    onClick={() => toggleMulti('goals', g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-group-modern">
              <label>Activity Level</label>
              <div className="activity-stack">
                {ACTIVITY_LEVELS.map(al => (
                  <button 
                    key={al.id} 
                    className={`activity-card ${data.activityLevel === al.id ? 'active' : ''}`}
                    onClick={() => handleChange('activityLevel', al.id)}
                  >
                    <div className="al-info">
                      <strong>{al.label}</strong>
                      <span>{al.desc}</span>
                    </div>
                    <div className="al-radio" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="hp-info-card">
          <AlertCircle size={16} />
          <p>Your clinical data is end-to-end encrypted and visible only to your doctor.</p>
        </div>
        
        <div className="nav-spacer-xl" />
      </div>

      <footer className="hp-footer-nav">
        {activeStep > 0 && (
          <button className="hp-prev-btn" onClick={() => setActiveStep(s => s - 1)}>Back</button>
        )}
        <div style={{ flex: 1 }} />
        {activeStep < STEPS.length - 1 ? (
          <button className="hp-next-btn" onClick={() => setActiveStep(s => s + 1)}>
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button className="hp-final-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Finish & Save"}
          </button>
        )}
      </footer>

      {success && (
        <div className="hp-success-toast animate-slide-up">
          <CheckCircle2 size={20} />
          <span>Clinical profile updated!</span>
        </div>
      )}
    </div>
  );
};

export default HealthProfile;
