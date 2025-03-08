
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import PricingCard from '@/components/Pricing';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Define pricing tiers
  const pricingTiers = [
    {
      tier: "free",
      price: 0,
      description: t('pricing.freeDesc'),
      features: [
        { name: "basicSurvey", available: true },
        { name: "responses100", available: true },
        { name: "basicAnalytics", available: true },
        { name: "emailSupport", available: true },
        { name: "googleMapsRedirect", available: false },
        { name: "customQR", available: false },
        { name: "advancedAnalytics", available: false },
      ],
    },
    {
      tier: "pro",
      price: 19,
      description: t('pricing.proDesc'),
      features: [
        { name: "basicSurvey", available: true },
        { name: "unlimitedSurveys", available: true },
        { name: "responses1000", available: true },
        { name: "googleMapsRedirect", available: true },
        { name: "advancedAnalytics", available: true },
        { name: "customQR", available: true },
        { name: "priorityEmail", available: true },
      ],
      mostPopular: true,
    },
    {
      tier: "premium",
      price: 49,
      description: t('pricing.premiumDesc'),
      features: [
        { name: "everythingPro", available: true },
        { name: "unlimitedResponses", available: true },
        { name: "benchmarking", available: true },
        { name: "industryAverages", available: true },
        { name: "customBranding", available: true },
        { name: "apiAccess", available: true },
        { name: "dedicatedManager", available: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.heading')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('pricing.description')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.tier}
                tier={tier.tier}
                price={tier.price}
                description={tier.description}
                features={tier.features}
                mostPopular={tier.mostPopular}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">{t('pricing.allPlans')}</p>
            <a href="mailto:sales@repute.com" className="text-primary hover:underline">
              {t('pricing.contactSales')}
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
