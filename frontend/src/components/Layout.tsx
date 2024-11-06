import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Bell, Settings, LogOut, Globe, Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Logo from './Logo';
import Button from './ui/Button';
import { appConfig } from '../config/app.config';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'nav.calendar', href: '/', icon: Calendar },
    { name: 'nav.timetables', href: '/timetables', icon: Clock },
    { name: 'nav.templates', href: '/templates', icon: FileText },
    { name: 'nav.sounds', href: '/sounds', icon: Bell },
  ];

  // Sulge mobiilimenüü navigeerimisel
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const toastId = toast.info(t('auth.loggingOut'), 0);

    try {
      await logout();
      
      toast.updateToast(toastId, {
        message: t('auth.logoutSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });

      navigate('/login', { replace: true });
    } catch (error) {
      toast.updateToast(toastId, {
        message: t('errors.logoutFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'et' ? 'en' : 'et';
    setLanguage(newLang);
    toast.info(t('common.languageChanged', { 
      language: t(`languages.${newLang}`) 
    }), appConfig.toast.duration.info);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 text-primary">
                <Logo />
              </div>
              
              {/* Desktop navigation */}
              <nav className="hidden md:flex ml-8 space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                        ${location.pathname === item.href
                          ? 'bg-background text-primary'
                          : 'text-content-light hover:text-primary hover:bg-background'
                        }`}
                      aria-current={location.pathname === item.href ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 mr-1.5" />
                      <span>{t(item.name)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Desktop right menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="gap-2"
                startIcon={<Globe className="h-5 w-5" />}
                aria-label={t('common.changeLanguage')}
              >
                <span className="uppercase">{language}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2"
                startIcon={<LogOut className="h-5 w-5" />}
              >
                {t('auth.logout')}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium
                    ${location.pathname === item.href
                      ? 'bg-background text-primary'
                      : 'text-content-light hover:text-primary hover:bg-background'
                    }`}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    <span>{t(item.name)}</span>
                  </div>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="w-full justify-start gap-2"
              startIcon={<Globe className="h-5 w-5" />}
              aria-label={t('common.changeLanguage')}
            >
              <span className="uppercase">{language}</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2"
              startIcon={<LogOut className="h-5 w-5" />}
            >
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
