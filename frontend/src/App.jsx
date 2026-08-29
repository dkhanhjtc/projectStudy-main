import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { StatsProvider } from './contexts/StatsContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import ExamPage from './pages/ExamPage';
import PomodoroPage from './pages/PomodoroPage';
import ProfilePage from './pages/ProfilePage';

import VocabularyPage from './pages/VocabularyPage';
import GrammarPage from './pages/GrammarPage';
import ListeningPage from './pages/ListeningPage';
import SpeakingPage from './pages/SpeakingPage';
import ReadingPage from './pages/ReadingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="
          w-14 h-14 rounded-full
          bg-accent border-2 border-foreground
          shadow-[var(--shadow-pop)]
          flex items-center justify-center
          animate-[pop-in_0.5s_var(--ease-bounce)_both]
        ">
          <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-muted-foreground font-semibold text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Protected route — requires login, redirects to /auth
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

// Public route — redirect to / if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth page — public, redirects if logged in */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* App Layout — wraps all pages (Dashboard is public, others protected) */}
      <Route element={<AppLayout />}>
        {/* Dashboard is PUBLIC — accessible without login */}
        <Route path="/" element={<DashboardPage />} />

        {/* These pages REQUIRE login */}
        <Route path="/vocabulary" element={<ProtectedRoute><VocabularyPage /></ProtectedRoute>} />
        <Route path="/grammar" element={<ProtectedRoute><GrammarPage /></ProtectedRoute>} />
        <Route path="/listening" element={<ProtectedRoute><ListeningPage /></ProtectedRoute>} />
        <Route path="/speaking" element={<ProtectedRoute><SpeakingPage /></ProtectedRoute>} />
        <Route path="/reading" element={<ProtectedRoute><ReadingPage /></ProtectedRoute>} />
        
        {/* Keep legacy routes just in case */}
        <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/pomodoro" element={<ProtectedRoute><PomodoroPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        {/* Admin Route */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FlashcardProvider>
            <PomodoroProvider>
              <StatsProvider>
                <AppRoutes />
              </StatsProvider>
            </PomodoroProvider>
          </FlashcardProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
