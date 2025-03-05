
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if this might be a survey with the wrong URL format
  const mightBeSurvey = location.pathname.includes("/s/");
  const correctSurveyPath = mightBeSurvey 
    ? location.pathname.replace("/s/", "/survey/") 
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        {mightBeSurvey && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 mb-2">
              It looks like you might be trying to access a survey with an incorrect URL format.
            </p>
            <Button variant="outline" asChild className="text-amber-800 border-amber-300 hover:bg-amber-100">
              <a href={correctSurveyPath}>Try this link instead</a>
            </Button>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Button asChild variant="default">
            <a href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </a>
          </Button>
          
          <Button asChild variant="outline">
            <a href="/dashboard" className="text-gray-600">
              Go to Dashboard
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
