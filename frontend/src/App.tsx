import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './i18n';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import CalendarView from './components/CalendarView';
import TimetablesView from './components/TimetablesView';
import TimetableDetailView from './components/TimetableDetailView';
import TimetableForm from './components/TimetableForm';
import SoundsView from './components/SoundsView';
import TemplatesView from './components/TemplatesView';

// Kaitstud marsruudi komponent
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Autentimata marsruudi komponent
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Rakenduse marsruudid
const AppRoutes = () => {
  return (
    <Routes>
      {/* Avalikud marsruudid */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />

      {/* Kaitstud marsruudid */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <CalendarView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetables"
        element={
          <ProtectedRoute>
            <Layout>
              <TimetablesView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetables/new"
        element={
          <ProtectedRoute>
            <Layout>
              <TimetableForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetables/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TimetableDetailView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Layout>
              <TemplatesView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sounds"
        element={
          <ProtectedRoute>
            <Layout>
              <SoundsView />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Tundmatu marsruut suunab avalehele */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
