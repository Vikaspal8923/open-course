import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';

export function Root() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
}
