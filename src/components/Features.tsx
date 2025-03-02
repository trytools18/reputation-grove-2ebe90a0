
import { useEffect, useRef } from "react"
import { Chip } from "./ui/chip"
import { CheckCircle, QrCode, BarChart3, Zap, UserCheck, TrendingUp } from "lucide-react"

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <QrCode className="text-primary h-6 w-6" />,
      title: "Custom QR Codes",
      description: "Generate unique QR codes that customers can scan to leave feedback about your business."
    },
    {
      icon: <BarChart3 className="text-primary h-6 w-6" />,
      title: "Comprehensive Analytics",
      description: "Access detailed reports and insights on customer feedback to identify trends and areas for improvement."
    },
    {
      icon: <UserCheck className="text-primary h-6 w-6" />,
      title: "Review Redirection",
      description: "Automatically redirect satisfied customers to leave reviews on Google Maps to boost your online presence."
    },
    {
      icon: <Zap className="text-primary h-6 w-6" />,
      title: "Instant Feedback",
      description: "Collect and organize customer feedback in real-time to quickly address concerns and improve service."
    },
    {
      icon: <TrendingUp className="text-primary h-6 w-6" />,
      title: "Competitive Benchmarking",
      description: "Compare your performance against industry standards and competitors in your area."
    },
    {
      icon: <CheckCircle className="text-primary h-6 w-6" />,
      title: "Customizable Surveys",
      description: "Create tailored surveys with multiple question types to gather specific feedback from your customers."
    }
  ]

  return (
    <section id="features" className="py-24 bg-gray-50" ref={featuresRef}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
          <Chip className="mb-4">Features</Chip>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need to Manage Your Reputation</h2>
          <p className="text-foreground/80">
            Our comprehensive solution provides all the tools necessary to collect, analyze, 
            and leverage customer feedback to improve your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 reveal-on-scroll"
              style={{ transitionDelay: `${100 + index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden reveal-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-4">Intelligent Review Routing</h3>
              <p className="text-foreground/80 mb-6">
                Our smart system automatically directs satisfied customers to leave reviews on Google Maps 
                while privately collecting constructive feedback from less satisfied customers.
              </p>
              <ul className="space-y-3">
                {[
                  "Set custom rating thresholds",
                  "Maximize positive online reviews",
                  "Address concerns before they go public",
                  "Improve reputation management efficiency"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 flex items-center justify-center p-8">
              <div className="relative w-full max-w-xs mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-lg" />
                <div className="relative bg-white rounded-lg shadow-md p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-center">How was your experience?</p>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div 
                          key={rating} 
                          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 
                            ${rating === 5 ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {rating}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Any additional comments?</p>
                    <div className="w-full h-20 bg-gray-50 rounded border border-gray-200" />
                  </div>

                  <button className="w-full py-2 bg-primary text-white rounded-lg">
                    Submit Feedback
                  </button>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500">
                      5-star feedback will be redirected to Google Maps for a public review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
