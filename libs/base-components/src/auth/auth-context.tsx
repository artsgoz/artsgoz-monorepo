import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onIdTokenChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { backendRequest, API_BASE_URL, type BackendUser } from './api';
import { validateSignIn } from './policy';

interface AuthState {
  user: User | null;
  profile: BackendUser | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let generation = 0;
    const unsubscribe = onIdTokenChanged(
      auth,
      (user) => {
        const current = ++generation;
        if (!user) {
          setState((previous) => ({
            user: null,
            profile: null,
            loading: false,
            error: previous.error,
          }));
          return;
        }
        setState({ user: null, profile: null, loading: true, error: null });
        void (async () => {
          const token = await user.getIdTokenResult();
          validateSignIn(
            token.signInProvider,
            user.email,
            token.claims.email_verified === true,
          );
          const response = await backendRequest<{ user: BackendUser }>(
            '/auth/firebase',
            {
              method: 'POST',
              body: JSON.stringify({ id_token: token.token }),
            },
          );
          if (current === generation)
            setState({
              user,
              profile: {
                ...response.user,
                avatar_url: response.user.avatar_url
                  ? new URL(response.user.avatar_url, API_BASE_URL).href
                  : '',
              },
              loading: false,
              error: null,
            });
        })().catch(async (error) => {
          if (current !== generation) return;
          const message =
            error instanceof Error ? error.message : 'Unable to sign in.';
          setState({
            user: null,
            profile: null,
            loading: false,
            error: message,
          });
          await signOut(auth).catch(() => undefined);
        });
      },
      (error) =>
        setState({
          user: null,
          profile: null,
          loading: false,
          error: error.message,
        }),
    );
    return () => {
      generation++;
      unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}

export async function logout() {
  await signOut(auth);
}
