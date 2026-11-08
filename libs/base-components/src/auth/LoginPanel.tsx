import { useEffect, useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { useAuth } from './auth-context';

function loginError(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use':
      'This email already has an account. Sign in instead.',
    'auth/weak-password': 'Use a password with at least six characters.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/unauthorized-domain':
      'This site is not an authorized Firebase login domain.',
    'auth/operation-not-allowed':
      'This login method is not enabled in Firebase.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return (
    messages[code] ||
    (error instanceof Error ? error.message : 'Unable to sign in.')
  );
}

export function LoginPanel({ onClose }: { onClose?: () => void }) {
  const { profile, loading, error: sessionError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (profile) onClose?.();
  }, [profile, onClose]);
  const run = async (operation: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
    } catch (cause) {
      setError(loginError(cause));
    } finally {
      setBusy(false);
    }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(() =>
      register
        ? createUserWithEmailAndPassword(auth, email.trim(), password)
        : signInWithEmailAndPassword(auth, email.trim(), password),
    );
  };
  const disabled = busy || loading;
  return (
    <section
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-gray-900"
      aria-label="Sign in"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {register ? 'Create an account' : 'Sign in to Artsgoz'}
        </h1>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close login">
            ✕
          </button>
        )}
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          Email
          <input
            className="block w-full rounded-lg border p-3 mt-1"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block">
          Password
          <input
            className="block w-full rounded-lg border p-3 mt-1"
            type="password"
            autoComplete={register ? 'new-password' : 'current-password'}
            minLength={register ? 6 : undefined}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          className="w-full rounded-lg bg-[#DE5D8F] p-3 text-white disabled:opacity-50"
          disabled={disabled}
        >
          {disabled ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <button
        className="w-full rounded-lg border p-3 mt-4 disabled:opacity-50"
        disabled={disabled}
        onClick={() =>
          void run(() => {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
              hd: 'student.chula.ac.th',
              prompt: 'select_account',
            });
            return signInWithPopup(auth, provider);
          })
        }
      >
        Continue with Google
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Google sign-in requires @student.chula.ac.th. Email/password accepts any
        email address.
      </p>
      {(error || sessionError) && (
        <p role="alert" className="text-red-700 mt-4">
          {error || sessionError}
        </p>
      )}
      {notice && (
        <p role="status" className="text-green-700 mt-4">
          {notice}
        </p>
      )}
      <div className="flex justify-between gap-4 mt-6 text-sm">
        <button
          disabled={disabled}
          onClick={() => {
            setRegister(!register);
            setError(null);
          }}
        >
          {register ? 'Already have an account?' : 'Create an account'}
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            void run(async () => {
              if (!email.trim())
                throw new Error('Enter your email address first.');
              await sendPasswordResetEmail(auth, email.trim());
              setNotice(
                'If an account exists, a password reset email has been sent.',
              );
            })
          }
        >
          Forgot password?
        </button>
      </div>
    </section>
  );
}
