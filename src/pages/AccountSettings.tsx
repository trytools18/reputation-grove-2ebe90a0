
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

// Use the same business categories and cities as in the Onboarding page
const businessCategories = [
  { value: "restaurant", label: "Restaurant" },
  { value: "barbershop", label: "Barbershop" },
  { value: "hotel", label: "Hotel" },
  { value: "coffee", label: "Coffee Shop" },
];

const greekCities = [
  { value: "athens", label: "Athens" },
  { value: "thessaloniki", label: "Thessaloniki" },
  { value: "patras", label: "Patras" },
  { value: "heraklion", label: "Heraklion" },
  { value: "larissa", label: "Larissa" },
];

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
        title: "Settings updated",
        description: "Your account settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message || "There was an error updating your settings.",
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
          Back
        </Button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              Update your business information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input 
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                placeholder="Your business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_category">Business Category</Label>
              <Select 
                value={formData.business_category}
                onValueChange={(value) => handleSelectChange("business_category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business category" />
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
              <Label htmlFor="city">City</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
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
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AccountSettings;
