import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Users,
  Briefcase,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workspace, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Profile
  const [name, setName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'Product Engineer');
  const [timezone, setTimezone] = useState(
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles'
  );

  // Step 2: Workspace
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || 'Engineering & Product');
  const [workspaceSlug, setWorkspaceSlug] = useState(
    workspace?.slug || 'eng-product'
  );

  // Step 3: Invites
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);

  // Step 4: Initial Project & Template
  const [loadDemoData, setLoadDemoData] = useState(true);
  const [projectName, setProjectName] = useState('Core Platform 2.0');

  const addInviteField = () => {
    if (inviteEmails.length < 5) {
      setInviteEmails([...inviteEmails, '']);
    }
  };

  const updateInviteField = (index: number, val: string) => {
    const updated = [...inviteEmails];
    updated[index] = val;
    setInviteEmails(updated);
  };

  const removeInviteField = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    completeOnboarding({
      workspaceName: workspaceName.trim() || 'My Workspace',
      workspaceSlug: workspaceSlug.trim() || 'my-workspace',
      jobTitle: jobTitle.trim(),
      inviteEmails: inviteEmails.filter((e) => e.trim().includes('@')),
    });
    navigate('/dashboard');
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: 'Profile' },
      { id: 2, label: 'Workspace' },
      { id: 3, label: 'Team' },
      { id: 4, label: 'Get Started' },
    ];

    return (
      <div className="onboarding-stepper">
        {steps.map((s, index) => {
          const isCompleted = step > s.id;
          const isCurrent = step === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className={`stepper-node ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="stepper-circle">
                  {isCompleted ? <Check size={14} /> : s.id}
                </div>
                <span className="stepper-label">{s.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`stepper-line ${step > s.id ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="onboarding-page-container">
      <div className="onboarding-card">
        {/* Header */}
        <div className="onboarding-header">
          <div className="auth-brand">
            <div className="auth-logo-badge">
              <Layers size={22} className="auth-logo-icon" />
            </div>
            <span className="auth-brand-name">LinearFlow</span>
          </div>
          {renderStepIndicator()}
        </div>

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div className="onboarding-step-content">
            <div className="step-title-group">
              <h1 className="step-title">Welcome to LinearFlow</h1>
              <p className="step-subtitle">Let's set up your profile so your team recognizes your contributions.</p>
            </div>

            <div className="onboarding-profile-preview">
              <div className="avatar avatar-xl avatar-placeholder">
                {name ? name.substring(0, 2).toUpperCase() : 'ME'}
              </div>
              <div className="profile-preview-text">
                <span className="profile-preview-name">{name || 'Your Name'}</span>
                <span className="profile-preview-role">{jobTitle || 'Role'}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-name">Your Full Name</label>
              <input
                id="user-name"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-job-title">Your Role or Job Title</label>
              <input
                id="user-job-title"
                type="text"
                className="form-input"
                placeholder="e.g. Staff Software Engineer / Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-timezone">Timezone</label>
              <select
                id="user-timezone"
                className="form-input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/Los_Angeles">Pacific Time (UTC-7)</option>
                <option value="America/New_York">Eastern Time (UTC-4)</option>
                <option value="Europe/London">London (UTC+1)</option>
                <option value="Europe/Paris">Central Europe (UTC+2)</option>
                <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                <option value="Asia/Kolkata">India (UTC+5:30)</option>
              </select>
            </div>

            <div className="onboarding-actions">
              <div />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Workspace Setup */}
        {step === 2 && (
          <div className="onboarding-step-content">
            <div className="step-title-group">
              <h1 className="step-title">Name your workspace</h1>
              <p className="step-subtitle">Workspaces group your team's projects, cycles, and issues in one shared place.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ws-name">Workspace Name</label>
              <div className="input-with-icon">
                <Building2 size={16} className="field-icon" />
                <input
                  id="ws-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Engineering"
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ws-slug">Workspace URL</label>
              <div className="url-slug-preview">
                <span className="slug-prefix">linearflow.app/</span>
                <input
                  id="ws-slug"
                  type="text"
                  className="slug-input"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
              </div>
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!workspaceName.trim()}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Invite Teammates */}
        {step === 3 && (
          <div className="onboarding-step-content">
            <div className="step-title-group">
              <h1 className="step-title">Invite your team</h1>
              <p className="step-subtitle">LinearFlow is built for collaborative velocity. Invite coworkers now or skip for later.</p>
            </div>

            <div className="invite-inputs-list">
              {inviteEmails.map((email, idx) => (
                <div key={idx} className="invite-input-row">
                  <div className="input-with-icon flex-1">
                    <Users size={16} className="field-icon" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder={`colleague${idx + 1}@company.com`}
                      value={email}
                      onChange={(e) => updateInviteField(idx, e.target.value)}
                    />
                  </div>
                  {inviteEmails.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon text-muted hover-destructive"
                      onClick={() => removeInviteField(idx)}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}

              {inviteEmails.length < 5 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm align-self-start"
                  onClick={addInviteField}
                >
                  <Plus size={14} /> Add another email
                </button>
              )}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <div className="flex-center gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(4)}
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(4)}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: First Project & Template */}
        {step === 4 && (
          <div className="onboarding-step-content">
            <div className="step-title-group">
              <h1 className="step-title">Set up your first project</h1>
              <p className="step-subtitle">Choose how you'd like to initialize your LinearFlow experience.</p>
            </div>

            <div className="template-options-grid">
              <div
                className={`template-card ${loadDemoData ? 'selected' : ''}`}
                onClick={() => setLoadDemoData(true)}
              >
                <div className="template-card-header">
                  <Sparkles size={20} className="text-primary" />
                  <span className="template-badge">Recommended</span>
                </div>
                <h3 className="template-title">Complete Demo Workspace</h3>
                <p className="template-desc">
                  Populate with 9 curated engineering & design issues, 3 active projects, priorities, and timeline history.
                </p>
                <div className="template-check">
                  {loadDemoData && <CheckCircle2 size={18} className="text-primary" />}
                </div>
              </div>

              <div
                className={`template-card ${!loadDemoData ? 'selected' : ''}`}
                onClick={() => setLoadDemoData(false)}
              >
                <div className="template-card-header">
                  <Briefcase size={20} className="text-secondary" />
                </div>
                <h3 className="template-title">Clean Slate Project</h3>
                <p className="template-desc">
                  Start fresh with a single empty project and create your own issues from scratch.
                </p>
                <div className="template-check">
                  {!loadDemoData && <CheckCircle2 size={18} className="text-primary" />}
                </div>
              </div>
            </div>

            {!loadDemoData && (
              <div className="form-group mt-3">
                <label className="form-label" htmlFor="project-name">Initial Project Name</label>
                <input
                  id="project-name"
                  type="text"
                  className="form-input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Mobile App Q4"
                />
              </div>
            )}

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(3)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinish}
              >
                Launch Workspace <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OnboardingPage;
