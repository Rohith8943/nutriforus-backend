import React from 'react';
import { ChevronLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page animate-fade-in">
      <header className="legal-header">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="header-icon-bg green"><Shield size={24} /></div>
        <h1>Privacy Agreement</h1>
        <p className="last-updated">Last Updated: April 25, 2026</p>
      </header>

      <div className="legal-content">
        <section className="legal-section">
          <div className="section-head">
            <Lock size={18} />
            <h3>Data Encryption</h3>
          </div>
          <p>Nutriforus uses military-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your clinical records are stored in HIPAA-compliant isolated environments.</p>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <Database size={18} />
            <h3>Information We Collect</h3>
          </div>
          <p>We collect biometric data, dietary logs, and health profiles to create personalized nutrition protocols. This data is exclusively used for clinical purposes and is never sold to third parties.</p>
          <ul>
            <li>Personal Identifiers (Name, Email)</li>
            <li>Biometric Data (Weight, Height, Body Fat %)</li>
            <li>Dietary History and Preferences</li>
            <li>Clinical Consultation Notes</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <Eye size={18} />
            <h3>Your Privacy Rights</h3>
          </div>
          <p>Under the GDPR and clinical data protection laws, you have the right to access, rectify, or erase your personal data. You can request a full clinical data export at any time through the support panel.</p>
        </section>

        <section className="legal-section">
          <div className="section-head">
            <Globe size={18} />
            <h3>Third-Party Sharing</h3>
          </div>
          <p>Your data is only shared with authorized clinical personnel (Nutritionists and Doctors) assigned to your case. We do not integrate with advertising networks or social media tracking.</p>
        </section>

        <div className="legal-footer-card glass-panel">
          <p>Questions about our privacy practices? Contact our Data Protection Officer at <strong>dpo@nutriforus.com</strong></p>
        </div>
      </div>
      <div className="nav-spacer-xl" />
    </div>
  );
};

export default Privacy;
