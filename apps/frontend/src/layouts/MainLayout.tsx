import { Link, Outlet } from 'react-router';
import { PATHS } from '../routes/paths';

export default function MainLayout() {
  return (
    <div>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to={PATHS.ROOT}>Home</Link>
        <Link to={PATHS.ABOUT}>About</Link>
      </nav>
      <Outlet />
    </div>
  );
}
