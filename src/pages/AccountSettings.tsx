
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile, updateUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useBusinessCategories, useGreekCities } from "@/lib/i18n/businessData";

const AccountSettings = () => {
  const { profile, isLoading, refetch } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    business_category: "",
    city: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const businessCategories = useBusinessCategories();
  const greekCities = useGreekCities();

  // Once profile is loaded, set the form data
  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || "",
        business_category: profile.business_category || "",
        city: profile.city || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateUserProfile(formData);
      await refetch();
      toast({
        title: t("settings_updated"),
        description: t("settings_updated_success"),
      });
    } catch (error: any) {
      toast({
        title: t("error_updating_settings"),
        description: error.message || t("error"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto mr-2" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
        <h1 className="text-3xl font-bold">{t("account_settings_title")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t("business_profile")}</CardTitle>
            <CardDescription>
              {t("update_business_info")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">{t("business_name_label")}</Label>
              <Input 
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                placeholder={t("business_name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_category">{t("business_category")}</Label>
              <Select 
                value={formData.business_category}
                onValueChange={(value) => handleSelectChange("business_category", value)}
              >
                <SelectTrigger>
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
                value={formData.city}
                onValueChange={(value) => handleSelectChange("city", value)}
              >
                <SelectTrigger>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving} variant="success">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : t("save_changes")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AccountSettings;
