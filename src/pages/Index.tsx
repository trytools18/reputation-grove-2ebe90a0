
import { useRef, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Pricing from "@/components/Pricing"
import Footer from "@/components/Footer"

const Index = () => {
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intersection Observer for revealing elements on scroll
    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll')
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('revealed')
        }
      })
    }

    // Initial check
    setTimeout(handleScroll, 100)
    window.addEventListener('scroll', handleScroll)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={appRef} className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}

export default Index
