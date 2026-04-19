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
} from 'lucide-react';
import { api } from '../../services/api';
import { getStoredUser, isAuthenticated } from '../utils/auth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setCurrentUser(getStoredUser());
  }, [location.pathname]);

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Open Course</span>
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
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                title={currentUser?.name ? `Logout ${currentUser.name}` : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
