
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
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Create a loading component for suspense fallback
const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { isLoading } = useSession();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth isSignUp />} />
          <Route path="/survey/:id" element={<SurveyView />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/create-survey" element={
            <ProtectedRoute>
              <SurveyCreator />
            </ProtectedRoute>
          } />
          <Route path="/edit-survey" element={
            <ProtectedRoute>
              <SurveyCreator />
            </ProtectedRoute>
          } />
          <Route path="/survey/:id/share" element={
            <ProtectedRoute>
              <SurveyShare />
            </ProtectedRoute>
          } />
          <Route path="/survey/:id/results" element={
            <ProtectedRoute>
              <SurveyResults />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
};

export default App;
