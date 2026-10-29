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

const cardClass = 'w-full max-w-md border border-stone-200 bg-white p-6';
const secondaryButtonClass =
  'flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50';
const linkButtonClass =
  'rounded-sm font-medium text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50';
const inputClass =
  'min-h-12 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-3 text-base text-stone-900 placeholder:text-stone-400 transition focus:border-stone-700 focus:outline-2 focus:outline-offset-2 focus:outline-stone-700/30 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500';

function LoginPage() {
  const { user, loading, error: sessionError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (loading)
    return (
      <p className="text-sm text-stone-500" role="status">
        Restoring your session…
      </p>
    );
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
    <section className={cardClass} aria-labelledby="auth-title">
      <h1
        id="auth-title"
        className="text-3xl font-semibold tracking-tight text-stone-900"
      >
        {mode === 'register'
          ? 'Create your account'
          : mode === 'reset'
            ? 'Reset your password'
            : 'Welcome back'}
      </h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-stone-500">
        {mode === 'reset'
          ? 'Enter your email and we’ll send you a reset link.'
          : 'Sign in to your Aksornsara account.'}
      </p>
      {!isFirebaseConfigured && (
        <p
          className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3.5 text-sm leading-6 text-emerald-900"
          role="status"
        >
          Sign-in is currently unavailable. Please contact the site
          administrator.
        </p>
      )}
      {(error || sessionError) && (
        <p
          className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm leading-6 text-red-800"
          role="alert"
        >
          {error || sessionError}
        </p>
      )}
      {message && (
        <p
          className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3.5 text-sm leading-6 text-emerald-900"
          role="status"
        >
          {message}
        </p>
      )}
      <fieldset
        className="min-w-0 border-0 p-0"
        disabled={busy || !isFirebaseConfigured}
      >
        {mode !== 'reset' && (
          <>
            <button
              className={secondaryButtonClass}
              type="button"
              onClick={() =>
                void run(() => {
                  const provider = new GoogleAuthProvider();
                  provider.setCustomParameters({ prompt: 'select_account' });
                  return signInWithPopup(requireAuth(), provider);
                })
              }
            >
              <span
                aria-hidden="true"
                className="text-lg font-bold text-stone-700"
              >
                G
              </span>
              Continue with Google
            </button>
            <div className="my-6 flex items-center gap-4 text-xs text-stone-400">
              <span className="h-px flex-1 bg-stone-200" aria-hidden="true" />
              <span>or use email</span>
              <span className="h-px flex-1 bg-stone-200" aria-hidden="true" />
            </div>
          </>
        )}
        <form
          className="flex flex-col gap-2.5"
          onSubmit={submit}
          aria-busy={busy}
        >
          <label className="text-sm font-medium text-stone-700" htmlFor="email">
            Email address
          </label>
          <input
            className={inputClass}
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
              <label
                className="mt-3 text-sm font-medium text-stone-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={inputClass}
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
                <small id="password-hint" className="text-xs text-stone-500">
                  Use at least 6 characters.
                </small>
              )}
            </>
          )}
          <button
            className="mt-4 min-h-12 w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
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
      <div className="mt-6 space-y-5 text-center text-sm text-stone-500">
        {mode === 'login' ? (
          <>
            <button
              type="button"
              disabled={busy}
              className={linkButtonClass}
              onClick={() => changeMode('reset')}
            >
              Forgot password?
            </button>
            <p>
              New here?{' '}
              <button
                type="button"
                disabled={busy}
                className={linkButtonClass}
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
            className={linkButtonClass}
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

  if (loading)
    return (
      <p className="text-sm text-stone-500" role="status">
        Restoring your session…
      </p>
    );
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
    <section className={cardClass} aria-labelledby="account-title">
      <h1
        id="account-title"
        className="text-3xl font-semibold tracking-tight wrap-anywhere text-stone-900"
      >
        Hello, {user.displayName || 'reader'}.
      </h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-stone-500">
        You’re signed in to Aksornsara.
      </p>
      <dl className="mb-8 space-y-2 rounded-lg bg-stone-50 p-4 text-sm [&_dt]:font-medium [&_dt]:text-stone-500 [&_dd]:wrap-anywhere [&_dd]:text-stone-800 [&_dt:not(:first-child)]:pt-3">
        <dt>Email</dt>
        <dd>{user.email || 'No email address'}</dd>
        <dt>Email status</dt>
        <dd>{user.emailVerified ? 'Verified' : 'Not verified'}</dd>
      </dl>
      {error && (
        <p
          className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm leading-6 text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}
      <button
        className={secondaryButtonClass}
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
    <div className="relative flex min-h-dvh flex-col bg-stone-50 font-maintenance text-stone-800">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none -rotate-12 opacity-10 text-4xl font-bold">
        <p>เทส MVP Oauth</p>
        <p>ใช้ได้แค่ Google Login</p>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
