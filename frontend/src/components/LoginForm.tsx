import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Logo from './Logo';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { appConfig } from '../config/app.config';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const toast = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Valideeri sisendid
    if (!username.trim() || !password.trim()) {
      toast.error(t('validation.required'));
      return;
    }

    setIsLoading(true);
    const toastId = toast.info(t('auth.authenticating'), 0);

    try {
      // Uuenda toasti autentimise olekuga
      toast.updateToast(toastId, {
        message: t('auth.verifying'),
        variant: 'info'
      });

      await login(username, password);

      // Uuenda toasti õnnestumise olekuga
      toast.updateToast(toastId, {
        message: t('auth.loginSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });

      navigate('/', { replace: true });
    } catch (err) {
      // Uuenda toasti vea olekuga
      toast.updateToast(toastId, {
        message: t('errors.loginFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'et' ? 'en' : 'et';
    setLanguage(newLang);
    toast.info(t('common.languageChanged', { language: t(`languages.${newLang}`) }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Language toggle */}
      <div className="fixed top-4 right-4">
        <Button
          variant="ghost"
          onClick={toggleLanguage}
          className="gap-2"
          startIcon={<Globe className="h-5 w-5" />}
        >
          <span className="uppercase">{language}</span>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <Card.Content>
          <div className="text-center mb-8">
            <div className="w-32 mx-auto text-primary">
              <Logo />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-content">
              {t('auth.login')}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="username"
              label={t('auth.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              fullWidth
              startIcon={<User className="h-5 w-5" />}
              disabled={isLoading}
            />

            <Input
              id="password"
              type="password"
              label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
              startIcon={<Lock className="h-5 w-5" />}
              disabled={isLoading}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
            >
              {t('auth.login')}
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LoginForm;
