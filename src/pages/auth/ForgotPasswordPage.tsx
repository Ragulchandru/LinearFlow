import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    // Simulate sending recovery instructions
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <Layers size={22} className="auth-logo-icon" />
          </div>
          <span className="auth-brand-name">LinearFlow</span>
        </div>

        {!isSubmitted ? (
          <>
            <div className="auth-heading-group">
              <h1 className="auth-title">Reset password</h1>
              <p className="auth-subtitle">
                Enter the email address associated with your account and we'll send you a recovery link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="recovery-email">
                  Work Email
                </label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="recovery-email"
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="btn-loading-content">
                    <span className="spinner-sm" /> Sending link...
                  </span>
                ) : (
                  <>
                    Send recovery link <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="success-icon-badge">
              <CheckCircle2 size={32} className="text-emerald" />
            </div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We've dispatched password reset instructions to <strong className="text-primary">{email}</strong>. Please check your spam folder if it doesn't arrive within 2 minutes.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => setIsSubmitted(false)}
            >
              Re-enter email address
            </button>
          </div>
        )}

        <div className="auth-footer-prompt">
          <Link to="/signin" className="auth-inline-link flex-center gap-1">
            <ArrowLeft size={14} /> Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
