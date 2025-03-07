
import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardLayoutProps = {
  children: ReactNode;
  showBackButton?: boolean;
};

const DashboardLayout = ({ children, showBackButton = false }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {showBackButton && (
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
