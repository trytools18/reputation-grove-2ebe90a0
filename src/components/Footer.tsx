
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useLanguage } from '@/lib/languageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* CTA Section */}
        <div className="bg-foreground text-white rounded-xl p-8 mb-16 max-w-5xl mx-auto text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,55,55,0.8),rgba(30,30,30,0))]" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('home.readyTransform')}</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              {t('home.joinHundreds')}
            </p>
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full px-6">
              {t('home.getStartedFree')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">R</span>
              </div>
              <span className="font-semibold text-xl">{t('app.name')}</span>
            </div>
            <p className="text-foreground/70 mb-6 max-w-md">
              {t('footer.helpingRestaurants')}
            </p>
            <div className="mb-6">
              <p className="font-medium mb-2">{t('footer.subscribeNewsletter')}</p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder={t('footer.enterEmail')} 
                  className="rounded-full bg-white" 
                />
                <Button className="rounded-full">{t('footer.subscribe')}</Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'footer.features', text: t('footer.features') },
                { key: 'footer.pricing', text: t('footer.pricing') },
                { key: 'footer.testimonials', text: t('footer.testimonials') },
                { key: 'footer.caseStudies', text: t('footer.caseStudies') },
                { key: 'footer.api', text: t('footer.api') }
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'footer.about', text: t('footer.about') },
                { key: 'footer.blog', text: t('footer.blog') },
                { key: 'footer.careers', text: t('footer.careers') },
                { key: 'footer.press', text: t('footer.press') },
                { key: 'footer.partners', text: t('footer.partners') }
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'footer.helpCenter', text: t('footer.helpCenter') },
                { key: 'footer.contactUs', text: t('footer.contactUs') },
                { key: 'footer.privacyPolicy', text: t('footer.privacyPolicy') },
                { key: 'footer.termsOfService', text: t('footer.termsOfService') },
                { key: 'footer.status', text: t('footer.status') }
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/70 mb-4 md:mb-0">
            {t('footer.allRightsReserved')}
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
