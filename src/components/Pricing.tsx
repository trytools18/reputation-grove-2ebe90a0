
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "./ui/chip"
import { Check } from "lucide-react"
import { useLanguage } from '@/lib/languageContext'

const Pricing = () => {
  const [annual, setAnnual] = useState(true)
  const { t } = useLanguage()

  const plans = [
    {
      name: t('pricing.free'),
      description: t('pricing.freeDesc'),
      monthly: 0,
      annual: 0,
      features: [
        t('pricing.basicSurvey'),
        t('pricing.responses100'),
        t('pricing.basicAnalytics'),
        t('pricing.emailSupport')
      ]
    },
    {
      name: t('pricing.pro'),
      description: t('pricing.proDesc'),
      monthly: 29,
      annual: 24,
      features: [
        t('pricing.unlimitedSurveys'),
        t('pricing.responses1000'),
        t('pricing.googleMapsRedirect'),
        t('pricing.advancedAnalytics'),
        t('pricing.customQR'),
        t('pricing.priorityEmail')
      ],
      popular: true
    },
    {
      name: t('pricing.premium'),
      description: t('pricing.premiumDesc'),
      monthly: 79,
      annual: 69,
      features: [
        t('pricing.everythingPro'),
        t('pricing.unlimitedResponses'),
        t('pricing.benchmarking'),
        t('pricing.industryAverages'),
        t('pricing.customBranding'),
        t('pricing.apiAccess'),
        t('pricing.dedicatedManager')
      ]
    }
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
          <Chip className="mb-4">{t('pricing.title')}</Chip>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('pricing.heading')}</h2>
          <p className="text-foreground/80 mb-8">
            {t('pricing.description')}
          </p>

          <div className="flex items-center justify-center space-x-3">
            <span className={`text-sm ${!annual ? 'text-foreground' : 'text-foreground/60'}`}>{t('pricing.monthly')}</span>
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
              {t('pricing.annual')} <span className="text-green-600 font-medium">{t('pricing.save')}</span>
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
                  {t('pricing.mostPopular')}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/70 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">
                    ${annual ? plan.annual : plan.monthly}
                    <span className="text-sm font-normal text-foreground/70">/{t('pricing.mo')}</span>
                  </p>
                  {annual && plan.monthly > 0 && (
                    <p className="text-sm text-green-600">
                      {t('pricing.saveYear', { amount: (plan.monthly - plan.annual) * 12 })}
                    </p>
                  )}
                </div>
                <Button 
                  className={`w-full rounded-lg mb-6 ${
                    plan.popular ? '' : 'bg-foreground/90 hover:bg-foreground'
                  }`}
                >
                  {t('pricing.getStarted')}
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
            {t('pricing.allPlans')} <a href="#" className="text-primary font-medium">{t('pricing.contactSales')}</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
