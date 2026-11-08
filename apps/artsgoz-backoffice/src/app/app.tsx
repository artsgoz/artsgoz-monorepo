import { LoginPanel, logout, useAuth } from '@base-components';
import { AppRouter } from '../routes/AppRouter';

export function App() {
  const { profile, loading } = useAuth();
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
      >
        Signing in…
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoginPanel />
      </div>
    );
  if (
    !['writer', 'editor', 'admin', 'superadmin'].includes(
      profile.role.toLowerCase(),
    )
  )
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>
          Your account does not have backoffice access. Ask an administrator to
          assign your role.
        </p>
        <button onClick={() => void logout()}>Sign out</button>
      </div>
    );
  return (
    <>
      <div className="flex justify-end items-center gap-4 p-3 border-b bg-white">
        <span>{profile.email}</span>
        <button onClick={() => void logout()}>Sign out</button>
      </div>
      <AppRouter />
    </>
  );
}

export default App;
