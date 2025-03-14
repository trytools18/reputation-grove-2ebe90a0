
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useSession, signOut } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from '@/lib/languageContext'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoading } = useSession()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: t('auth.loggedOut'),
        description: t('auth.loggedOutDesc'),
      })
      navigate("/")
    } catch (error: any) {
      toast({
        title: t('auth.errorLoggingOut'),
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-xl">Repute</span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.about')}
          </a>
          {/* Removed dashboard link from here */}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher variant="ghost" minimal size="sm" />

          {isLoading ? (
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Hi, {user.email}</span>
              <Button variant="outline" className="rounded-full px-5 flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                {t('common.logout')}
              </Button>
              <Button 
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center" 
                onClick={handleDashboard}
                title={t('nav.dashboard')}
              >
                <LayoutDashboard size={18} />
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" className="rounded-full px-5" onClick={handleLogin}>
                {t('common.login')}
              </Button>
              <Button className="rounded-full px-5" onClick={() => navigate("/signup")}>
                {t('common.signup')}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher variant="ghost" minimal size="sm" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 border-b border-gray-200 animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.features')}
            </a>
            <a 
              href="#pricing" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.pricing')}
            </a>
            <a 
              href="#" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            {/* Removed dashboard link from mobile menu as well */}
            <div className="pt-4 flex flex-col space-y-3">
              {isLoading ? (
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-full"></div>
              ) : user ? (
                <>
                  <div className="py-2 text-sm font-medium">Hi, {user.email}</div>
                  <Button variant="outline" className="w-full rounded-full flex items-center justify-center gap-2" onClick={handleLogout}>
                    <LogOut size={16} />
                    {t('common.logout')}
                  </Button>
                  <Button className="w-full rounded-full flex items-center justify-center gap-2" onClick={handleDashboard}>
                    <LayoutDashboard size={18} />
                    {t('nav.dashboard')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full rounded-full" onClick={handleLogin}>
                    {t('common.login')}
                  </Button>
                  <Button className="w-full rounded-full" onClick={() => navigate("/signup")}>
                    {t('common.signup')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
