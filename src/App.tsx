
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SurveyCreator from "./components/SurveyCreator";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import SurveyShare from "./pages/SurveyShare";
import SurveyView from "./pages/SurveyView";
import { useSession, getUserProfile } from "./lib/auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          const profile = await getUserProfile();
          if (profile && !profile.onboarding_completed) {
            setNeedsOnboarding(true);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        } finally {
          setIsCheckingProfile(false);
        }
      } else {
        setIsCheckingProfile(false);
      }
    };
    
    if (!isLoading) {
      checkOnboardingStatus();
    }
  }, [user, isLoading]);
  
  if (isLoading || isCheckingProfile) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-survey" 
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <SurveyCreator />
                </OnboardingCheck>
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
            path="/survey/:id/share" 
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <SurveyShare />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          {/* Add the missing route for viewing a specific survey */}
          <Route 
            path="/survey/:id" 
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <SurveyCreator />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route path="/s/:id" element={<SurveyView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
