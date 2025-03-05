
import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  showBackButton?: boolean;
};

const DashboardLayout = ({ children, showBackButton = false }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
