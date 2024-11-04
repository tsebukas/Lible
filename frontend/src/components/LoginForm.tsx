import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Vale kasutajanimi või parool');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="15 12 85 32" className="w-32 mx-auto text-primary">
            <path d="M40 40 L40 15 M40 40 L55 40" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  fill="none"/>
            <path d="M40 15 A25 25 0 0 1 65 40" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                  strokeDasharray="0.5,4"
                  fill="none"/>
            <circle cx="52.5" cy="18.4" r="1.2" fill="currentColor"/>
            <circle cx="61.6" cy="27.5" r="1.2" fill="currentColor"/>
            <text x="59" y="41" 
                  fontFamily="Arial" 
                  fontSize="20" 
                  fontWeight="300"
                  fill="currentColor"
                  letterSpacing="1">ıble</text>
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-content">Logi sisse</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-content-light">
              Kasutajanimi
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content-light">
              Parool
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sisselogimine...' : 'Logi sisse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
