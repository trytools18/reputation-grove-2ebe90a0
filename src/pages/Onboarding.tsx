
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserProfile, useSession } from "@/lib/auth";
import { toast } from "sonner";

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

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSession();
  const [businessCategory, setBusinessCategory] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Please select a business category");
      return;
    }
    
    if (!city) {
      toast.error("Please select a city");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        business_category: businessCategory,
        city: city,
        onboarding_completed: true,
      });
      
      toast.success("Onboarding completed!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Your Feedback Journey
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us a bit about your business to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="business-category">Business Category</Label>
              <Select
                value={businessCategory}
                onValueChange={setBusinessCategory}
              >
                <SelectTrigger id="business-category" className="w-full">
                  <SelectValue placeholder="Select your business category" />
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
                value={city}
                onValueChange={setCity}
              >
                <SelectTrigger id="city" className="w-full">
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
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
