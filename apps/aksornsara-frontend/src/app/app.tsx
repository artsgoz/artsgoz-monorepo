import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useAuth } from '../auth/auth-context';
import { getAuthErrorMessage } from '../auth/errors';
import { isFirebaseConfigured, requireAuth } from '../auth/firebase';

function LoginPage() {
  const { user, loading, error: sessionError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (loading) return <p role="status">Restoring your session…</p>;
  if (user) return <Navigate to="/account" replace />;

  function changeMode(next: typeof mode) {
    setMode(next);
    setError('');
    setMessage('');
    setPassword('');
  }

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      const auth = requireAuth();
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email.trim());
        setMessage(
          'If an account exists for this email, you will receive a password reset link.',
        );
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    });
  }

  return (
    <section className="auth-card">
      <h1 id="auth-title">
        {mode === 'register'
          ? 'Create your account'
          : mode === 'reset'
            ? 'Reset your password'
            : 'Welcome back'}
      </h1>
      <p className="auth-description">
        {mode === 'reset'
          ? 'Enter your email and we’ll send you a reset link.'
          : 'Sign in to your Aksornsara account.'}
      </p>
      {!isFirebaseConfigured && (
        <p className="auth-notice" role="status">
          Sign-in is currently unavailable. Please contact the site
          administrator.
        </p>
      )}
      {(error || sessionError) && (
        <p className="auth-error" role="alert">
          {error || sessionError}
        </p>
      )}
      {message && (
        <p className="auth-notice" role="status">
          {message}
        </p>
      )}
      <fieldset disabled={busy || !isFirebaseConfigured}>
        {mode !== 'reset' && (
          <>
            <button
              className="button button-secondary"
              type="button"
              onClick={() =>
                void run(() => {
                  const provider = new GoogleAuthProvider();
                  provider.setCustomParameters({ prompt: 'select_account' });
                  return signInWithPopup(requireAuth(), provider);
                })
              }
            >
              Continue with Google
            </button>
            <div className="auth-divider">
              <span>or use email</span>
            </div>
          </>
        )}
        <form onSubmit={submit} aria-busy={busy}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          {mode !== 'reset' && (
            <>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={mode === 'register' ? 6 : undefined}
                autoComplete={
                  mode === 'register' ? 'new-password' : 'current-password'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby={
                  mode === 'register' ? 'password-hint' : undefined
                }
              />
              {mode === 'register' && (
                <small id="password-hint">Use at least 6 characters.</small>
              )}
            </>
          )}
          <button className="button button-primary" type="submit">
            {busy
              ? 'Please wait…'
              : mode === 'register'
                ? 'Create account'
                : mode === 'reset'
                  ? 'Send reset link'
                  : 'Sign in'}
          </button>
        </form>
      </fieldset>
      <div className="auth-links">
        {mode === 'login' ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => changeMode('reset')}
            >
              Forgot password?
            </button>
            <p>
              New here?{' '}
              <button
                type="button"
                disabled={busy}
                onClick={() => changeMode('register')}
              >
                Create an account
              </button>
            </p>
          </>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => changeMode('login')}
          >
            Back to sign in
          </button>
        )}
      </div>
    </section>
  );
}

function AccountPage() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <p role="status">Restoring your session…</p>;
  if (!user) return <Navigate to="/login" replace />;

  async function logout() {
    setBusy(true);
    setError('');
    try {
      await signOut(requireAuth());
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-card" aria-labelledby="account-title">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1 id="account-title">Hello, {user.displayName || 'reader'}.</h1>
      <p className="auth-description">You’re signed in to Aksornsara.</p>
      <dl className="account-details">
        <dt>Email</dt>
        <dd>{user.email || 'No email address'}</dd>
        <dt>Email status</dt>
        <dd>{user.emailVerified ? 'Verified' : 'Not verified'}</dd>
      </dl>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button button-secondary"
        type="button"
        disabled={busy}
        onClick={() => void logout()}
      >
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </section>
  );
}

export function App() {
  return (
    <div className="auth-shell">
      <header className="site-header">
        <Link to="/">
          อักษรสาราณียกร <span>Aksornsara</span>
        </Link>
      </header>
      <main className="auth-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">ชมรมอักษรสาราณียกร</footer>
    </div>
  );
}

export default App;
