
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signOut, useSession, useUserProfile } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Home, LogOut, PlusCircle, User } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSession();
  const { profile } = useUserProfile();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "There was an error logging out.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { icon: Home, label: t('nav.dashboard'), path: "/dashboard" },
    { icon: PlusCircle, label: t('nav.createSurvey'), path: "/create-survey" },
    { icon: User, label: t('nav.account'), path: "/account-settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-semibold text-lg">R</span>
            </div>
            <span className="font-semibold text-xl">{t('app.name')}</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-semibold text-lg">R</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="p-2 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {!collapsed && profile && (
          <div className="mb-4">
            <div className="text-sm font-medium truncate">{profile.business_name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        )}
        {!collapsed && (
          <div className="mb-3">
            <LanguageSwitcher variant="ghost" size="sm" />
          </div>
        )}
        {collapsed && (
          <div className="mb-3 flex justify-center">
            <LanguageSwitcher variant="ghost" size="icon" minimal={true} />
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">{t('common.logout')}</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
