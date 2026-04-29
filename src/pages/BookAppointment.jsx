import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  X,
  Stethoscope,
  Info,
  Calendar,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './BookAppointment.css';

const DOCTOR = {
  id: 1,
  name: "Dr. Chinchu Vidyadharan",
  emoji: "👩‍⚕️",
  spec: "Chief Clinical Nutritionist"
};

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM",
  "05:00 PM","05:30 PM","06:00 PM","06:30 PM",
];

const REASONS = [
  "Weight Management", "Diabetes Nutrition", "PCOS Diet Plan",
  "Gut Health", "Sports Nutrition", "Meal Planning",
  "Post-Surgery Diet", "General Wellness", "Other",
];

const getDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const fmtDate = d => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const fmtDateISO = d => d.toISOString().split("T")[0];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBook = async () => {
    if (!selDate || !selTime || !reason) return;
    setLoading(true);
    try {
      const payload = {
        doctorId: DOCTOR.id,
        doctorName: DOCTOR.name,
        doctorEmoji: DOCTOR.emoji,
        doctorSpec: DOCTOR.spec,
        date: fmtDateISO(selDate),
        dateLabel: fmtDate(selDate),
        time: selTime,
        reason,
        notes,
      };
      await api.post('/appointments', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dates = getDates();

  if (success) {
    return (
      <div className="booking-success-page animate-fade-in">
        <div className="success-content">
          <div className="success-icon-wrap"><CheckCircle2 size={64} /></div>
          <h1>Booking Confirmed!</h1>
          <p>Your session with {DOCTOR.name} is scheduled for <strong>{fmtDate(selDate)}</strong> at <strong>{selTime}</strong>.</p>
          <div className="success-redirect">Redirecting to your appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment-page animate-fade-in">
      <header className="book-header-fixed">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>New Consultation</h1>
        <div className="header-spacer" />
      </header>

      <div className="book-scroll-content">
        <section className="booking-doctor-card glass-panel">
          <div className="doc-avatar-large">
            <span className="doc-emoji-large">{DOCTOR.emoji}</span>
          </div>
          <div className="doc-info-large">
            <h2>{DOCTOR.name}</h2>
            <span className="doc-spec-large">{DOCTOR.spec}</span>
          </div>
        </section>

        <section className="booking-step">
          <label className="step-label">1. Select Date</label>
          <div className="booking-dates-grid">
            {dates.map(d => (
              <button 
                key={d.toISOString()} 
                className={`booking-date-chip ${selDate?.toDateString() === d.toDateString() ? 'active' : ''}`}
                onClick={() => setSelDate(d)}
              >
                <span className="chip-day">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="chip-val">{d.getDate()}</span>
              </button>
            ))}
          </div>
        </section>

        {selDate && (
          <section className="booking-step animate-slide-up">
            <label className="step-label">2. Select Time</label>
            <div className="booking-time-grid">
              {TIME_SLOTS.map(t => (
                <button 
                  key={t} 
                  className={`booking-time-chip ${selTime === t ? 'active' : ''}`}
                  onClick={() => setSelTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        )}

        {selTime && (
          <section className="booking-step animate-slide-up">
            <label className="step-label">3. Clinical Reason</label>
            <div className="booking-reason-grid">
              {REASONS.map(r => (
                <button 
                  key={r} 
                  className={`booking-reason-chip ${reason === r ? 'active' : ''}`}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
        )}

        {reason && (
          <section className="booking-step animate-slide-up">
            <label className="step-label">4. Additional Notes</label>
            <textarea 
              className="booking-notes-input"
              placeholder="Any specific symptoms or health goals you'd like to share?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        )}
      </div>

      <footer className="booking-action-footer">
        <button 
          className="confirm-book-btn" 
          disabled={!selDate || !selTime || !reason || loading}
          onClick={handleBook}
        >
          {loading ? "Processing..." : "Confirm Appointment"}
        </button>
      </footer>
    </div>
  );
};

export default BookAppointment;
