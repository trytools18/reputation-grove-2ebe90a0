
import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { cn } from '@/lib/utils';

export interface PricingCardProps {
  tier: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: { name: string; available: boolean }[];
  mostPopular?: boolean;
  currency?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  originalPrice,
  description,
  features,
  mostPopular = false,
  currency = '€',
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "border rounded-lg p-6 relative",
        mostPopular ? "border-primary shadow-md" : "border-gray-200",
      )}
    >
      {mostPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-3 text-xs font-semibold rounded-br-lg rounded-tl-none">
          {t('pricing.mostPopular')}
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-2">
        {t(`pricing.${tier}.title`) || tier.charAt(0).toUpperCase() + tier.slice(1)}
      </h3>
      <div className="text-5xl font-bold mb-4 flex items-end">
        {originalPrice ? (
          <>
            <span className="text-5xl">{currency}{price}</span>
            <span className="text-lg text-gray-500 line-through ml-2">{currency}{originalPrice}</span>
            <span className="text-sm text-gray-500 ml-1">/{t('pricing.mo')}</span>
          </>
        ) : (
          <>
            {currency}{price}
            <span className="text-sm text-gray-500">/{t('pricing.mo')}</span>
          </>
        )}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2">
            {feature.available ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <X className="h-4 w-4 mr-2 text-red-500" />
            )}
            <span>{t(`pricing.${feature.name}`)}</span>
          </li>
        ))}
      </ul>
      <button className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded hover:bg-primary-dark transition-colors w-full">
        {t('pricing.getStarted')}
      </button>
    </div>
  );
};

export default PricingCard;
