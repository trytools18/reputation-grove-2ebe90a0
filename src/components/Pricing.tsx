
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "./ui/chip"
import { Check } from "lucide-react"

const Pricing = () => {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Free",
      description: "Basic tools for small businesses just getting started.",
      monthly: 0,
      annual: 0,
      features: [
        "Basic survey creation",
        "Up to 100 responses per month",
        "Basic analytics dashboard",
        "Email support"
      ]
    },
    {
      name: "Pro",
      description: "Advanced tools for growing businesses.",
      monthly: 29,
      annual: 24,
      features: [
        "Unlimited survey creation",
        "Up to 1,000 responses per month",
        "Google Maps review redirection",
        "Advanced analytics dashboard",
        "Custom QR codes and short links",
        "Priority email support"
      ],
      popular: true
    },
    {
      name: "Premium",
      description: "Complete solution for established businesses.",
      monthly: 79,
      annual: 69,
      features: [
        "Everything in Pro",
        "Unlimited responses",
        "Competitive benchmarking",
        "Industry and city averages",
        "Custom branding",
        "API access",
        "Dedicated account manager"
      ]
    }
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
          <Chip className="mb-4">Pricing</Chip>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-foreground/80 mb-8">
            Choose the plan that best fits your business needs. No hidden fees or complicated pricing structures.
          </p>

          <div className="flex items-center justify-center space-x-3">
            <span className={`text-sm ${!annual ? 'text-foreground' : 'text-foreground/60'}`}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)} 
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  annual ? 'translate-x-7' : 'translate-x-1'
                }`} 
              />
            </button>
            <span className={`text-sm ${annual ? 'text-foreground' : 'text-foreground/60'}`}>
              Annual <span className="text-green-600 font-medium">Save 15%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 reveal-on-scroll ${
                plan.popular 
                  ? 'shadow-lg scale-105 border-primary/50 relative z-10' 
                  : 'shadow-sm hover:shadow-md'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-xs font-medium py-1 text-center">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/70 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">
                    ${annual ? plan.annual : plan.monthly}
                    <span className="text-sm font-normal text-foreground/70">/mo</span>
                  </p>
                  {annual && plan.monthly > 0 && (
                    <p className="text-sm text-green-600">
                      Save ${(plan.monthly - plan.annual) * 12}/year
                    </p>
                  )}
                </div>
                <Button 
                  className={`w-full rounded-lg mb-6 ${
                    plan.popular ? '' : 'bg-foreground/90 hover:bg-foreground'
                  }`}
                >
                  Get started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex text-sm">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-xl mx-auto pt-4 reveal-on-scroll">
          <p className="text-foreground/80 text-sm">
            All plans include access to our customer support team, regular product updates, 
            and our knowledge base. Need a custom solution? <a href="#" className="text-primary font-medium">Contact our sales team</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
