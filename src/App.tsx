
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import SurveyCreator from "./components/SurveyCreator";
import SurveyShare from "./pages/SurveyShare";
import SurveyView from "./pages/SurveyView";
import SurveyResults from "./pages/SurveyResults";
import Templates from "./pages/Templates";
import { useSession } from "./lib/auth";

const App = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth isSignUp />} />
        <Route path="/survey/:id" element={<SurveyView />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/create-survey" element={<SurveyCreator />} />
            <Route path="/edit-survey" element={<SurveyCreator />} />
            <Route path="/survey/:id/share" element={<SurveyShare />} />
            <Route path="/survey/:id/results" element={<SurveyResults />} />
            <Route path="/templates" element={<Templates />} />
          </>
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
