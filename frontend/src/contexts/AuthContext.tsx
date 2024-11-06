import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useToast } from './ToastContext';
import apiService, { auth as authApi, type AuthResponse } from '../services/api';
import { appConfig } from '../config/app.config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();

  // Kontrolli autentimist rakenduse käivitumisel
  useEffect(() => {
    const token = localStorage.getItem(appConfig.auth.tokenKey);
    if (token) {
      checkAuth();
    }
  }, []);

  // Sessiooni aegumise kontroll
  useEffect(() => {
    if (!isAuthenticated) return;

    const tokenExpiryCheck = setInterval(() => {
      const token = localStorage.getItem(appConfig.auth.tokenKey);
      if (!token) {
        handleSessionExpired();
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        // Kui token aegub hoiatusaja jooksul, näita hoiatust
        if (expiryTime - currentTime < appConfig.auth.tokenExpiryWarning) {
          toast.warning(t('auth.sessionExpiring'), appConfig.toast.duration.warning);
        }
        
        // Kui token on aegunud, logi välja
        if (currentTime >= expiryTime) {
          handleSessionExpired();
        }
      } catch (error) {
        handleSessionExpired();
      }
    }, 60 * 1000); // Kontrolli iga minuti järel

    return () => clearInterval(tokenExpiryCheck);
  }, [isAuthenticated, t, toast]);

  const handleSessionExpired = async () => {
    await logout();
    toast.error(t('auth.sessionExpired'), appConfig.toast.duration.error);
    navigate('/login', { replace: true });
  };

  const checkAuth = async () => {
    try {
      await authApi.check();
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem(appConfig.auth.tokenKey);
      localStorage.removeItem(appConfig.auth.refreshTokenKey);
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      const { token, refreshToken } = response.data;
      
      localStorage.setItem(appConfig.auth.tokenKey, token);
      if (refreshToken) {
        localStorage.setItem(appConfig.auth.refreshTokenKey, refreshToken);
      }
      
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error(t('auth.invalidCredentials'));
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(appConfig.auth.tokenKey);
      localStorage.removeItem(appConfig.auth.refreshTokenKey);
      setIsAuthenticated(false);
    }
  };

  // Token uuendamise loogika
  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem(appConfig.auth.refreshTokenKey);
    if (!currentRefreshToken) return false;

    try {
      const response = await authApi.refresh({ refreshToken: currentRefreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem(appConfig.auth.tokenKey, token);
      if (newRefreshToken) {
        localStorage.setItem(appConfig.auth.refreshTokenKey, newRefreshToken);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // API päringute interceptor
  useEffect(() => {
    const interceptor = apiService.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Kui token on aegunud ja pole veel proovitud uuendada
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Proovi tokenit uuendada
          const refreshed = await refreshToken();
          if (refreshed) {
            // Kui uuendamine õnnestus, proovi algset päringut uuesti
            const token = localStorage.getItem(appConfig.auth.tokenKey);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiService.axios(originalRequest);
          }

          // Kui uuendamine ebaõnnestus, logi välja
          handleSessionExpired();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiService.axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
