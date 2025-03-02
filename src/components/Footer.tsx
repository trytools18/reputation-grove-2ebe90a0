
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* CTA Section */}
        <div className="bg-foreground text-white rounded-xl p-8 mb-16 max-w-5xl mx-auto text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,55,55,0.8),rgba(30,30,30,0))]" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your restaurant's reputation?</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Join hundreds of successful restaurants already using our platform to collect feedback and improve their online presence.
            </p>
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full px-6">
              Get started for free
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">R</span>
              </div>
              <span className="font-semibold text-xl">Repute</span>
            </div>
            <p className="text-foreground/70 mb-6 max-w-md">
              Helping restaurants and cafés transform customer feedback into growth and improved online reputation.
            </p>
            <div className="mb-6">
              <p className="font-medium mb-2">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-full bg-white" 
                />
                <Button className="rounded-full">Subscribe</Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Testimonials", "Case Studies", "API"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Press", "Partners"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Status"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/70 mb-4 md:mb-0">
            © 2023 Repute. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
