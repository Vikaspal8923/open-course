import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  BookOpen,
  Home,
  Briefcase,
  FlaskConical,
  User,
  LogIn,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { api } from '../../services/api';
import { getStoredUser, isAuthenticated } from '../utils/auth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setCurrentUser(getStoredUser());
  }, [location.pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(isAuthenticated());
      setCurrentUser(getStoredUser());
    };

    window.addEventListener('storage', syncAuthState);
    return () => window.removeEventListener('storage', syncAuthState);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/interviews', label: 'Interviews', icon: Briefcase },
    { path: '/research', label: 'Research', icon: FlaskConical },
  ];

  if (loggedIn) {
    navItems.push({ path: '/profile', label: 'Profile', icon: User });
  }

  const handleLogout = () => {
    api.clearAuthToken();
    setLoggedIn(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const isDarkMode = mounted && resolvedTheme === 'dark';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur transition-colors dark:border-gray-800 dark:bg-gray-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Open Course</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm font-medium">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
            
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                title={currentUser?.name ? `Logout ${currentUser.name}` : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
