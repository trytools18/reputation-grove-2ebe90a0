import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

// Function to format currency
const formatCurrency = (value: number, currency = "€") => {
  return `${currency}${value}`;
};

// Pricing plans data
const pricingPlans = [
  {
    name: "Basic",
    monthly: 29,
    annual: 24,
    description: "Perfect for small businesses just getting started with feedback collection.",
    features: [
      "Up to 3 feedback forms",
      "100 responses per month",
      "Basic analytics",
      "Email support",
      "30-day data retention"
    ],
    popular: false,
    cta: "Start Basic"
  },
  {
    name: "Pro",
    monthly: 59,
    annual: 49,
    description: "Ideal for growing businesses looking to gain deeper customer insights.",
    features: [
      "Unlimited feedback forms",
      "1,000 responses per month",
      "Advanced analytics",
      "Priority email support",
      "Custom branding",
      "90-day data retention",
      "Export to CSV/Excel"
    ],
    popular: true,
    cta: "Start Pro"
  },
  {
    name: "Enterprise",
    monthly: 119,
    annual: 99,
    description: "Complete solution for businesses with advanced feedback collection needs.",
    features: [
      "Everything in Pro",
      "Unlimited responses",
      "Dedicated account manager",
      "Phone support",
      "Custom integrations",
      "1-year data retention",
      "Team collaboration",
      "Advanced security features"
    ],
    popular: false,
    cta: "Contact Sales"
  }
];

interface PricingProps {
  id?: string;
}

const Pricing = ({ id = "pricing" }: PricingProps) => {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignUpClick = (plan: string) => {
    if (plan === "Enterprise") {
      // Maybe redirect to a contact form or open a modal
      window.location.href = "mailto:sales@surveystacks.com?subject=Enterprise Plan Inquiry";
    } else {
      // Redirect to signup page with plan parameter
      navigate(`/signup?plan=${plan.toLowerCase()}`);
    }
  };

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('pricing.subtitle')}
          </p>
          
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-md ${
                billingPeriod === "monthly"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-500"
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-2 rounded-md ${
                billingPeriod === "annual"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-500"
              }`}
            >
              {t('pricing.annual')}
              <span className="ml-1 text-xs text-green-600 font-medium">
                {t('pricing.saveYear')}
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                plan.popular
                  ? "ring-2 ring-primary md:scale-105"
                  : "hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
                  {t('pricing.mostPopular')}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {formatCurrency(
                      billingPeriod === "monthly" ? plan.monthly : plan.annual
                    )}
                  </span>
                  <span className="ml-1 text-gray-500">/{t('pricing.mo')}</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">
                  {plan.description}
                </p>

                <Button
                  className="mt-6 w-full"
                  onClick={() => handleSignUpClick(plan.name)}
                >
                  {t('pricing.getStarted')}
                </Button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
