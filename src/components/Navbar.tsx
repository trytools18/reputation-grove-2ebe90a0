
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/lib/auth";
import NavbarLanguageSwitcher from "./NavbarLanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading } = useSession();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? "bg-white/95 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Feedback App</Link>

          <div className="lg:hidden flex items-center gap-2">
            <NavbarLanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-1"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-6">
              <Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t("features")}
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t("pricing")}
              </Link>
              <NavbarLanguageSwitcher />
            </div>

            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="animate-pulse h-10 w-20 bg-gray-200 rounded-md"></div>
              ) : user ? (
                <Button onClick={() => navigate("/dashboard")}>
                  {t("dashboard")}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    {t("login")}
                  </Button>
                  <Button onClick={() => navigate("/signup")}>
                    {t("signup")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 lg:hidden">
            <div className="flex flex-col gap-4">
              <Link 
                to="/features" 
                className="px-2 py-2 hover:bg-gray-100 rounded-md text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("features")}
              </Link>
              <Link 
                to="/pricing" 
                className="px-2 py-2 hover:bg-gray-100 rounded-md text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("pricing")}
              </Link>
              
              <div className="mt-2 flex flex-col gap-2">
                {user ? (
                  <Button onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}>
                    {t("dashboard")}
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("login")}
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate("/signup");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("signup")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
