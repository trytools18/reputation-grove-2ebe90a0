
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
import AccountSettings from "./pages/AccountSettings";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import { useSession } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { LanguageProvider } from "./lib/languageContext";

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const DashboardRoute = ({ children, showBackButton = false }: { children: React.ReactNode, showBackButton?: boolean }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout showBackButton={showBackButton}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

const App = () => {
  const { isLoading } = useSession();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <LanguageProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth?tab=signup" replace />} />
            <Route path="/survey/:id" element={<SurveyView />} />
            <Route path="/dashboard" element={
              <DashboardRoute>
                <Dashboard />
              </DashboardRoute>
            } />
            <Route path="/account-settings" element={
              <DashboardRoute>
                <AccountSettings />
              </DashboardRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/create-survey" element={
              <DashboardRoute showBackButton={true}>
                <SurveyCreator />
              </DashboardRoute>
            } />
            <Route path="/edit-survey" element={
              <DashboardRoute showBackButton={true}>
                <SurveyCreator />
              </DashboardRoute>
            } />
            <Route path="/survey/:id/share" element={
              <DashboardRoute showBackButton={true}>
                <SurveyShare />
              </DashboardRoute>
            } />
            <Route path="/survey/:id/results" element={
              <DashboardRoute showBackButton={true}>
                <SurveyResults />
              </DashboardRoute>
            } />
            <Route path="/templates" element={
              <DashboardRoute>
                <Templates />
              </DashboardRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </LanguageProvider>
  );
};

export default App;
