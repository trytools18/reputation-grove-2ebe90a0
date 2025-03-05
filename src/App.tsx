import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useSession } from "./lib/auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CreateSurvey from "./pages/CreateSurvey";
import Survey from "./pages/Survey";
import ShareSurvey from "./pages/ShareSurvey";
import Templates from "./pages/Templates";
import SurveyDetail from "./pages/SurveyDetail";
import "./App.css";

function App() {
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { session } = useSession();
    if (!session) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const OnboardingCheck = ({ children }: { children: JSX.Element }) => {
    const { user, userProfile } = useSession();

    if (!user) {
      return <Navigate to="/" />;
    }

    // If onboarding is not completed, redirect to onboarding page
    if (userProfile && userProfile.onboarding_completed === false) {
      return <Navigate to="/onboarding" />;
    }

    return children;
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Dashboard />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-survey"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <CreateSurvey />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey/:id"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Survey />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey/:id/share"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <ShareSurvey />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Templates />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey-detail/:id"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <SurveyDetail />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
