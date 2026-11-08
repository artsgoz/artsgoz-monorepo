// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './auth-context';
import { isAllowedGoogleEmail, validateSignIn } from './policy';
import { apiErrorMessage } from './api';

const mocks = vi.hoisted(() => ({
  listener: undefined as undefined | ((user: unknown) => void),
  request: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('./firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: vi.fn((_auth, listener) => {
    mocks.listener = listener;
    return vi.fn();
  }),
  signOut: mocks.signOut,
}));
vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  backendRequest: mocks.request,
}));

function Probe() {
  const { profile, loading, error } = useAuth();
  return (
    <div>{loading ? 'loading' : error || profile?.email || 'signed out'}</div>
  );
}
function user(provider: string, email: string, verified = true) {
  return {
    email,
    getIdTokenResult: vi.fn().mockResolvedValue({
      signInProvider: provider,
      token: 'firebase-id-token',
      claims: { email_verified: verified },
    }),
  };
}

beforeEach(() => {
  mocks.request.mockReset();
  mocks.signOut.mockClear();
});
afterEach(cleanup);

describe('provider email policy', () => {
  it.each(['name@student.chula.ac.th', 'name@STUDENT.CHULA.AC.TH'])(
    'accepts student Google address %s',
    (email) => expect(isAllowedGoogleEmail(email)).toBe(true),
  );
  it.each([
    'name@gmail.com',
    'name@chula.ac.th',
    'name@student.chula.ac.th.evil.test',
    'name@@student.chula.ac.th',
  ])('rejects other Google address %s', (email) =>
    expect(isAllowedGoogleEmail(email)).toBe(false),
  );
  it('requires verification for Google and permits ordinary password addresses', () => {
    expect(() =>
      validateSignIn('google.com', 'name@student.chula.ac.th', false),
    ).toThrow('verified');
    expect(() =>
      validateSignIn('password', 'name@gmail.com', false),
    ).not.toThrow();
  });
  it('reads nested backend errors', () =>
    expect(
      apiErrorMessage(
        { error: { code: 'forbidden', message: 'Not allowed' } },
        'fallback',
      ),
    ).toBe('Not allowed'));
});

describe('Firebase and backend session', () => {
  it('rejects non-student Google login before contacting the backend', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    act(() => mocks.listener?.(user('google.com', 'name@gmail.com')));
    await screen.findByText(/Google sign-in requires/);
    expect(mocks.request).not.toHaveBeenCalled();
    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
  });
  it.each([
    ['password', 'name@gmail.com'],
    ['google.com', 'name@student.chula.ac.th'],
  ])(
    'synchronizes %s ID tokens before exposing the profile',
    async (provider, email) => {
      mocks.request.mockResolvedValue({
        user: { id: 'backend-id', email, role: 'member' },
      });
      render(
        <AuthProvider>
          <Probe />
        </AuthProvider>,
      );
      act(() => mocks.listener?.(user(provider, email)));
      await screen.findByText(email);
      expect(mocks.request).toHaveBeenCalledWith('/auth/firebase', {
        method: 'POST',
        body: JSON.stringify({ id_token: 'firebase-id-token' }),
      });
    },
  );
  it('clears Firebase login when the backend rejects the token', async () => {
    mocks.request.mockRejectedValue(new Error('Token rejected'));
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    act(() => mocks.listener?.(user('password', 'name@gmail.com')));
    await screen.findByText('Token rejected');
    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
  });
  it('ignores an outstanding profile request after logout', async () => {
    let complete: (value: unknown) => void = () => undefined;
    mocks.request.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    act(() => mocks.listener?.(user('password', 'name@gmail.com')));
    await waitFor(() => expect(mocks.request).toHaveBeenCalled());
    act(() => mocks.listener?.(null));
    await act(async () => complete({ user: { email: 'name@gmail.com' } }));
    expect(screen.queryByText('name@gmail.com')).toBeNull();
    expect(screen.getByText('signed out')).toBeTruthy();
  });
});
