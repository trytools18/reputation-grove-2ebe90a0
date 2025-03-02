
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            <span className="text-white font-semibold text-lg">R</span>
          </div>
          <span className="font-semibold text-xl">Repute</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="rounded-full px-5">
            Log in
          </Button>
          <Button className="rounded-full px-5">Sign up</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
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
              Features
            </a>
            <a 
              href="#pricing" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="outline" className="w-full rounded-full">Log in</Button>
              <Button className="w-full rounded-full">Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
