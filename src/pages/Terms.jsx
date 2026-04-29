import React from 'react';
import { ChevronLeft, FileText, Scale, AlertTriangle, CheckSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page animate-fade-in">
      <header className="legal-header">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="header-icon-bg blue"><FileText size={24} /></div>
        <h1>Terms of Service</h1>
        <p className="last-updated">Effective Date: April 25, 2026</p>
      </header>

      <div className="legal-content">
        <section className="legal-section">
          <div className="section-head">
            <Scale size={18} />
            <h3>Standard Usage Agreement</h3>
          </div>
          <p>By accessing Nutriforus, you agree to follow our clinical guidelines and standard operating procedures. The platform is designed for nutritional support and does not replace emergency medical care.</p>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <CheckSquare size={18} />
            <h3>User Responsibilities</h3>
          </div>
          <p>Users are responsible for providing accurate health data. Misrepresentation of medical conditions may lead to ineffective protocols or platform suspension.</p>
          <ul>
            <li>Provide truthful biometric information</li>
            <li>Attend scheduled clinical consultations</li>
            <li>Maintain account credential confidentiality</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <AlertTriangle size={18} />
            <h3>Medical Disclaimer</h3>
          </div>
          <p>Nutriforus nutritionists are clinical experts, but our protocols should be reviewed by your primary physician if you have chronic medical conditions (e.g., Kidney failure, Heart disease).</p>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <Clock size={18} />
            <h3>Subscription & Refunds</h3>
          </div>
          <p>Clinical plans are billed monthly. Cancellations must be made 48 hours before the renewal date. Refunds for clinical consultations are subject to our standard review process.</p>
        </section>

        <div className="legal-footer-card glass-panel">
          <p>By using the Nutriforus platform, you acknowledge that you have read and understood these terms in their entirety.</p>
        </div>
      </div>
      <div className="nav-spacer-xl" />
    </div>
  );
};

export default Terms;
