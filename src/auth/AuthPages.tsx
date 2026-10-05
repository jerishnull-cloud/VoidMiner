import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import {
  AuthUser,
  createAccount,
  requestPasswordReset,
  signIn,
  signOut,
  startGoogleSignIn,
  toAuthUser,
  updatePassword,
} from './authClient';
import { useAuth } from './AuthProvider';
import './auth.css';

type FieldName = 'username' | 'email' | 'password' | 'confirmPassword' | 'newPassword';
type FieldErrors = Partial<Record<FieldName, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthBackground() {
  return (
    <div className="void-miner-background auth-background" aria-hidden="true">
      <div className="void-miner-base" />
      <div className="void-miner-glow glow-left" />
      <div className="void-miner-glow glow-right" />
      <div className="void-miner-glow glow-center" />
      <div className="void-miner-fog fog-one" />
      <div className="void-miner-fog fog-two" />
      <div className="void-miner-grid" />
      <div className="minecraft-silhouette terrain-back terrain-left" />
      <div className="minecraft-silhouette terrain-back terrain-right" />
      <div className="minecraft-silhouette trees trees-left" />
      <div className="minecraft-silhouette trees trees-right" />
      <div className="floating-cube cube-one" />
      <div className="floating-cube cube-two" />
      <div className="floating-cube cube-three" />
      <div className="floating-cube cube-four" />
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className={`bg-particle particle-${index + 1}`} />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="auth-google-mark">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 5)" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.37 38.06 46.98 31.88 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 -1)" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -5)" />
    </svg>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <AuthBackground />
      <div className="auth-content">{children}</div>
      <div className="auth-footer">VOID MINER <span>•</span> ENTER THE UNKNOWN</div>
    </main>
  );
}

function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`auth-card${compact ? ' auth-card-compact' : ''}`}>
      <Logo className="auth-logo" alt="VOID miner logo" />
      <p className="auth-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  autoComplete,
  trailing,
}: {
  id: FieldName;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: React.ReactNode;
  autoComplete: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className={`auth-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <span className="auth-input-icon" aria-hidden="true">{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={event => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          required
        />
        {trailing}
      </div>
      {error && <p className="auth-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function FormNotice({ message, success = false }: { message: string; success?: boolean }) {
  if (!message) return null;
  const Icon = success ? CheckCircle2 : AlertCircle;
  return <p className={`auth-notice${success ? ' is-success' : ''}`} role="status"><Icon size={17} />{message}</p>;
}

function AuthButton({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button className="auth-submit" type="submit" disabled={loading}>
      {loading && <span className="auth-spinner" aria-hidden="true" />}
      {loading ? 'PLEASE WAIT' : children}
    </button>
  );
}

function validateEmail(email: string): string {
  return emailPattern.test(email.trim()) ? '' : 'Invalid email address';
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationNotice, setRegistrationNotice] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === '1') {
      setError('');
      setRegistrationNotice(true);
    }

    const oauthError = params.get('error_description') || params.get('error');
    if (oauthError) setError(oauthError.replace(/\+/g, ' '));
  }, [location.search]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    if (password.length < 8) errors.password = 'Password must contain at least 8 characters';
    setFieldErrors(errors);
    setError('');
    setRegistrationNotice(false);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password, rememberMe);
      if (import.meta.env.DEV) {
        console.log('[AUTH] Email login successful');
        console.log('[AUTH] Redirecting to login-success');
      }
      navigate('/login-success');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Please try again.');
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setError('');
    setRegistrationNotice(false);
    setGoogleLoading(true);
    try {
      if (import.meta.env.DEV) console.log('[AUTH] Google login started');
      await startGoogleSignIn(rememberMe);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Google sign-in is not available.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard eyebrow="IDENTITY VERIFICATION" title="WELCOME BACK" subtitle="Enter the VOID and continue your journey.">
        <form className="auth-form" onSubmit={submit} noValidate>
          <Field
            id="email"
            label="EMAIL ADDRESS"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            error={fieldErrors.email}
            icon={<Mail size={17} />}
            autoComplete="email"
          />
          <Field
            id="password"
            label="PASSWORD"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            icon={<LockKeyhole size={17} />}
            autoComplete="current-password"
            trailing={(
              <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          />
          <div className="auth-options">
            <label className="auth-checkbox">
              <input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} />
              <span aria-hidden="true" />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <FormNotice message={error || authError || ''} />
          {registrationNotice && (
            <FormNotice message="ACCOUNT CREATED SUCCESSFULLY — Please sign in to continue." success />
          )}
          <AuthButton loading={loading}>SIGN IN</AuthButton>
        </form>
        <div className="auth-divider"><span>OR</span></div>
        <button className="auth-google" type="button" onClick={googleSignIn} disabled={googleLoading}>
          {googleLoading ? <span className="auth-spinner" aria-hidden="true" /> : <GoogleMark />}
          {googleLoading ? 'CONNECTING TO GOOGLE' : 'CONTINUE WITH GOOGLE'}
        </button>
        <p className="auth-switch">Don&apos;t have an account? <Link to="/register">CREATE ACCOUNT</Link></p>
      </AuthCard>
    </AuthShell>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!username.trim()) errors.username = 'Enter a username';
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    if (password.length < 8) errors.password = 'Password must contain at least 8 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    setError('');
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await createAccount(username.trim(), email.trim(), password);
      navigate('/login?registered=1', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create your account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard eyebrow="JOIN THE DIMENSION" title="CREATE YOUR VOID ACCOUNT" subtitle="Forge your identity. Your journey starts here." compact>
        <form className="auth-form" onSubmit={submit} noValidate>
          <Field id="username" label="USERNAME" placeholder="Choose a username" value={username} onChange={setUsername} error={fieldErrors.username} icon={<UserRound size={17} />} autoComplete="username" />
          <Field id="email" label="EMAIL ADDRESS" placeholder="Enter your email" value={email} onChange={setEmail} error={fieldErrors.email} icon={<Mail size={17} />} autoComplete="email" />
          <Field
            id="password"
            label="PASSWORD"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            icon={<LockKeyhole size={17} />}
            autoComplete="new-password"
            trailing={(
              <button className="auth-password-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          />
          <Field id="confirmPassword" label="CONFIRM PASSWORD" type="password" placeholder="Enter your password again" value={confirmPassword} onChange={setConfirmPassword} error={fieldErrors.confirmPassword} icon={<LockKeyhole size={17} />} autoComplete="new-password" />
          <FormNotice message={error} />
          <AuthButton loading={loading}>CREATE ACCOUNT</AuthButton>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">SIGN IN</Link></p>
      </AuthCard>
    </AuthShell>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const resettingPassword = new URLSearchParams(location.search).get('reset') === '1';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (resettingPassword) {
      if (newPassword.length < 8) errors.newPassword = 'Password must contain at least 8 characters';
      if (confirmPassword !== newPassword) errors.confirmPassword = 'Passwords do not match';
    } else {
      const emailError = validateEmail(email);
      if (emailError) errors.email = emailError;
    }
    setFieldErrors(errors);
    setError('');
    setSuccess('');
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      if (resettingPassword) {
        await updatePassword(newPassword);
        navigate('/login');
      } else {
        await requestPasswordReset(email.trim());
        setSuccess('If an account exists for that email, reset instructions will be sent.');
        setLoading(false);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to complete the password reset.');
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard
        eyebrow="RECOVER YOUR ACCESS"
        title={resettingPassword ? 'CHOOSE A NEW PASSWORD' : 'RESET PASSWORD'}
        subtitle={resettingPassword ? 'Set a new password for your VOID account.' : 'We will send secure reset instructions to your email.'}
        compact
      >
        <form className="auth-form" onSubmit={submit} noValidate>
          {resettingPassword ? (
            <>
              <Field id="newPassword" label="NEW PASSWORD" type="password" placeholder="At least 8 characters" value={newPassword} onChange={setNewPassword} error={fieldErrors.newPassword} icon={<LockKeyhole size={17} />} autoComplete="new-password" />
              <Field id="confirmPassword" label="CONFIRM PASSWORD" type="password" placeholder="Enter your password again" value={confirmPassword} onChange={setConfirmPassword} error={fieldErrors.confirmPassword} icon={<LockKeyhole size={17} />} autoComplete="new-password" />
            </>
          ) : (
            <Field id="email" label="EMAIL ADDRESS" placeholder="Enter your email" value={email} onChange={setEmail} error={fieldErrors.email} icon={<Mail size={17} />} autoComplete="email" />
          )}
          <FormNotice message={error} />
          <FormNotice message={success} success />
          <AuthButton loading={loading}>{resettingPassword ? 'UPDATE PASSWORD' : 'SEND RESET LINK'}</AuthButton>
        </form>
        <p className="auth-switch auth-back"><Link to="/login"><ArrowLeft size={15} /> BACK TO SIGN IN</Link></p>
      </AuthCard>
    </AuthShell>
  );
}

function AccountPage() {
  const { user: supabaseUser, loading, error: authError } = useAuth();
  const user: AuthUser | null = supabaseUser ? toAuthUser(supabaseUser) : null;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !supabaseUser && !loggingOut) navigate('/login', { replace: true });
  }, [loading, supabaseUser, loggingOut, navigate]);

  const logout = async () => {
    setLoggingOut(true);
    setError('');
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to end your session.');
      setLoggingOut(false);
    }
  };

  if (loading || !user) {
    return <AuthShell><div className="auth-loading"><span className="auth-spinner" /> Verifying your session</div></AuthShell>;
  }

  const avatarSrc = user.avatarUrl || undefined;
  const providerLabel = user.provider === 'google' ? 'Google' : user.provider === 'github' ? 'GitHub' : user.provider === 'email' ? 'Email' : user.provider.charAt(0).toUpperCase() + user.provider.slice(1);

  return (
    <AuthShell>
      <section className="auth-card auth-account-card">
        <div className="auth-profile-header">
          <div className="auth-avatar-wrap">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user.fullName || user.username} className="auth-avatar" />
            ) : (
              <Logo className="auth-avatar-logo" alt="VOID miner logo" />
            )}
          </div>
          <div className="auth-profile-meta">
            <p className="auth-eyebrow">VOID MINER ACCOUNT</p>
            <h1>WELCOME, {user.fullName || user.username || 'MINER'}</h1>
            <p className="auth-subtitle">{user.email}</p>
          </div>
        </div>

        <div className="auth-account-details">
          <span>NAME</span>
          <strong>{user.fullName || user.username || 'VOID MINER'}</strong>
        </div>
        <div className="auth-account-details">
          <span>EMAIL</span>
          <strong>{user.email}</strong>
        </div>
        <div className="auth-account-details">
          <span>AUTHENTICATION</span>
          <strong>Signed in with {providerLabel}</strong>
        </div>
        <div className="auth-account-details">
          <span>STATUS</span>
          <strong>Account active</strong>
        </div>

        <div className="auth-account-actions">
          <button type="button" className="auth-submit auth-profile-button" onClick={() => navigate('/account')}>
            PROFILE
          </button>
          <button type="button" className="auth-submit auth-home-button" onClick={() => navigate('/')}>
            HOME
          </button>
        </div>

        <FormNotice message={error || authError || ''} />
        <button className="auth-submit auth-logout" type="button" onClick={logout} disabled={loggingOut}>
          {loggingOut && <span className="auth-spinner" aria-hidden="true" />}
          {loggingOut ? 'PLEASE WAIT' : 'LOGOUT'}
        </button>
      </section>
    </AuthShell>
  );
}

function LoginSuccessPage() {
  return (
    <AuthShell>
      <section className="auth-card auth-success-card" role="status" aria-live="polite">
        <Logo className="auth-logo" alt="VOID miner logo" />
        <div className="auth-success-check" aria-hidden="true">
          <CheckCircle2 size={34} strokeWidth={2.2} />
        </div>
        <p className="auth-eyebrow">IDENTITY VERIFIED</p>
        <h1>LOGIN SUCCESSFUL</h1>
        <p className="auth-subtitle">Welcome back to the VOID.<br />Authentication completed successfully.</p>
        <div className="auth-success-progress" aria-hidden="true">
          <span />
        </div>
        <p className="auth-success-loading"><span className="auth-spinner" /> ENTERING THE VOID...</p>
      </section>
    </AuthShell>
  );
}

export function AuthPages({ path }: { path: string }) {
  if (path === '/register') return <RegisterPage />;
  if (path === '/forgot-password') return <ForgotPasswordPage />;
  if (path === '/account') return <AccountPage />;
  if (path === '/login-success') return <LoginSuccessPage />;
  return <LoginPage />;
}
