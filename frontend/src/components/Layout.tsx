import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 text-primary">
                <Logo />
              </div>
              
              {/* Main navigation */}
              <nav className="ml-8 flex space-x-4">
                <Link
                  to="/"
                  className={`nav-link ${isActivePath('/') ? 'nav-link-active' : ''}`}
                >
                  <Calendar className="w-5 h-5 mr-1.5" />
                  Kalender
                </Link>
                <Link
                  to="/timetables"
                  className={`nav-link ${isActivePath('/timetables') ? 'nav-link-active' : ''}`}
                >
                  <Clock className="w-5 h-5 mr-1.5" />
                  Tunniplaanid
                </Link>
                <Link
                  to="/templates"
                  className={`nav-link ${isActivePath('/templates') ? 'nav-link-active' : ''}`}
                >
                  <Bell className="w-5 h-5 mr-1.5" />
                  Mallid
                </Link>
                <Link
                  to="/holidays"
                  className={`nav-link ${isActivePath('/holidays') ? 'nav-link-active' : ''}`}
                >
                  <Calendar className="w-5 h-5 mr-1.5" />
                  Pühad
                </Link>
              </nav>
            </div>

            {/* Right side menu */}
            <div className="flex items-center">
              <button className="p-2 text-content-light rounded-lg hover:bg-background hover:text-primary">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="ml-2 p-2 text-content-light rounded-lg hover:bg-background hover:text-primary"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
