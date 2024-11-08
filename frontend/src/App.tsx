import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import CalendarView from './components/CalendarView';
import SoundsView from './components/SoundsView';
import TimetablesView from './components/TimetablesView';
import TimetableForm from './components/TimetableForm';
import TimetableDetailView from './components/TimetableDetailView';

// Kaitseb marsruute, mis nõuavad autentimist
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-content">Laadimine...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Suunab autenditud kasutaja avalehele
function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-content">Laadimine...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
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
                  <div>Mallid (tulekul)</div>
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
          <Route
            path="/holidays"
            element={
              <ProtectedRoute>
                <Layout>
                  <div>Pühad (tulekul)</div>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
