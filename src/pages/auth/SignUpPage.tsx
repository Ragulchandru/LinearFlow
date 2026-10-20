import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff, ArrowRight, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to create your workspace.');
      return;
    }

    const result = await signUp(fullName, email, password);
    if (result.success) {
      navigate('/onboarding');
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
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

        <div className="auth-heading-group">
          <h1 className="auth-title">Create your workspace</h1>
          <p className="auth-subtitle">Get started with streamlined issue tracking and high-velocity roadmaps</p>
        </div>

        {errorMessage && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertCircle size={16} className="auth-alert-icon" />
            <span className="auth-alert-text">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <div className="input-with-icon">
              <UserIcon size={16} className="field-icon" />
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="Sarah Connor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Work Email
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="sarah@skynet-research.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="field-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="auth-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="form-checkbox"
              />
              <span className="checkbox-text">
                I agree to the <span className="text-secondary">Terms of Service</span> and{' '}
                <span className="text-secondary">Privacy Policy</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading-content">
                <span className="spinner-sm" /> Creating account...
              </span>
            ) : (
              <>
                Create account & Continue <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          Already have an account?{' '}
          <Link to="/signin" className="auth-primary-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
