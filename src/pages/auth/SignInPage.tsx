import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState('alex@linearflow.app');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = await signIn(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleDemoSignIn = async () => {
    setErrorMessage(null);
    setEmail('alex@linearflow.app');
    setPassword('password123');
    const result = await signIn('alex@linearflow.app', 'password123');
    if (result.success) {
      navigate('/dashboard');
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your team's project tracking workspace</p>
        </div>

        {errorMessage && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertCircle size={16} className="auth-alert-icon" />
            <span className="auth-alert-text">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <div className="field-header-row">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="auth-inline-link">
                Forgot password?
              </Link>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          <div className="auth-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox"
              />
              <span className="checkbox-text">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading-content">
                <span className="spinner-sm" /> Signing in...
              </span>
            ) : (
              <>
                Sign in to workspace <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">OR TEST DRIVE</span>
          <span className="auth-divider-line" />
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-block demo-signin-btn"
          onClick={handleDemoSignIn}
          disabled={isLoading}
        >
          <CheckCircle2 size={16} className="text-emerald" />
          Continue with Pre-populated Demo Account
        </button>

        <div className="auth-footer-prompt">
          Don't have an account yet?{' '}
          <Link to="/signup" className="auth-primary-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
