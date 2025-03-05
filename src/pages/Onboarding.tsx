
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserProfile, useSession } from "@/lib/auth";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useBusinessCategories, useGreekCities } from "@/lib/i18n/businessData";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSession();
  const [businessCategory, setBusinessCategory] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const businessCategories = useBusinessCategories();
  const greekCities = useGreekCities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessCategory) {
      toast.error(t("select_business_category"));
      return;
    }
    
    if (!city) {
      toast.error(t("select_city"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        business_category: businessCategory,
        city: city,
        onboarding_completed: true,
      });
      
      toast.success(t("onboarding_completed"));
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {t("welcome_onboarding")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("onboarding_description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="business-category">{t("business_category")}</Label>
              <Select
                value={businessCategory}
                onValueChange={setBusinessCategory}
              >
                <SelectTrigger id="business-category" className="w-full">
                  <SelectValue placeholder={t("select_business_category")} />
                </SelectTrigger>
                <SelectContent>
                  {businessCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Select
                value={city}
                onValueChange={setCity}
              >
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder={t("select_city")} />
                </SelectTrigger>
                <SelectContent>
                  {greekCities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("saving") : t("complete_setup")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
