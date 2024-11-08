import { appConfig } from '../config/app.config';

export const getAuthHeaders = () => {
  const token = localStorage.getItem(appConfig.auth.tokenKey);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
