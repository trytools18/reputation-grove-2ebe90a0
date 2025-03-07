
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertTemplateToSurvey, QUESTION_TYPES } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface TemplateUseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    category?: string;
  } | null;
}

const TemplateUseDialog = ({ isOpen, onClose, template }: TemplateUseDialogProps) => {
  const [businessName, setBusinessName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Function to get the business type label based on template category
  const getBusinessTypeLabel = () => {
    if (!template?.category) return language === 'el' ? "Επιχείρηση" : "Business";
    
    const categoryLabels: Record<string, { en: string; el: string }> = {
      "restaurant": { en: "Restaurant", el: "Εστιατόριο" },
      "barbershop": { en: "Barbershop", el: "Κουρείο" },
      "salon": { en: "Salon", el: "Κομμωτήριο" },
      "retail": { en: "Store", el: "Κατάστημα" },
      "cafe": { en: "Café", el: "Καφετέρια" },
      "hotel": { en: "Hotel", el: "Ξενοδοχείο" },
    };
    
    const category = template.category.toLowerCase();
    return categoryLabels[category] 
      ? categoryLabels[category][language as 'en' | 'el'] 
      : (language === 'el' ? "Επιχείρηση" : "Business");
  };

  const businessType = getBusinessTypeLabel();

  // Get the translated template name
  const getTranslatedTemplateName = () => {
    if (!template || language !== 'el') return template?.name || "";
    
    const templateNameTranslations: Record<string, string> = {
      "Restaurant Customer Satisfaction": "Ικανοποίηση Πελατών Εστιατορίου",
      "Coffee Shop Experience": "Εμπειρία Καφετέριας",
      "Haircut Satisfaction Survey": "Έρευνα Ικανοποίησης Κουρέματος",
      "Hotel Stay Experience": "Εμπειρία Διαμονής σε Ξενοδοχείο"
    };
    
    return templateNameTranslations[template.name] || template.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !template) return;
    
    if (!businessName.trim()) {
      toast({
        title: language === 'el' 
          ? `Απαιτείται όνομα ${businessType.toLowerCase()}` 
          : `${businessType} name required`,
        description: language === 'el'
          ? `Παρακαλώ εισάγετε ένα όνομα για το ${businessType.toLowerCase()} σας`
          : `Please enter a name for your ${businessType.toLowerCase()}`,
        variant: "destructive"
      });
      return;
    }
    
    if (!googleMapsUrl.trim()) {
      toast({
        title: language === 'el'
          ? "Απαιτείται URL Google Maps" 
          : "Google Maps URL required",
        description: language === 'el'
          ? "Παρακαλώ εισάγετε το URL του Google Maps για την ανακατεύθυνση"
          : "Please enter your Google Maps URL for redirection",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { id, error } = await convertTemplateToSurvey(
        template.id,
        businessName,
        googleMapsUrl,
        user.id
      );
      
      if (error) {
        if (error.includes("questions_type_check")) {
          throw new Error(language === 'el'
            ? "Υπάρχει πρόβλημα με τους τύπους ερωτήσεων στο πρότυπο. Παρακαλώ δοκιμάστε ένα διαφορετικό πρότυπο ή επικοινωνήστε με την υποστήριξη."
            : "There's an issue with question types in the template. Please try a different template or contact support.");
        }
        throw new Error(error);
      }
      
      if (!id) {
        throw new Error(language === 'el'
          ? "Αποτυχία δημιουργίας έρευνας. Δεν επιστράφηκε ID."
          : "Failed to create survey. No ID returned.");
      }
      
      toast({
        title: language === 'el' ? "Η έρευνα δημιουργήθηκε" : "Survey created",
        description: language === 'el'
          ? `Επιτυχής δημιουργία έρευνας από το πρότυπο "${getTranslatedTemplateName()}"`
          : `Successfully created survey from the "${template.name}" template`
      });
      
      // Navigate to the share page for the new survey
      navigate(`/survey/${id}/share`);
    } catch (error: any) {
      console.error("Error creating survey from template:", error);
      toast({
        title: language === 'el' ? "Σφάλμα δημιουργίας έρευνας" : "Error creating survey",
        description: error.message || (language === 'el' 
          ? "Δεν ήταν δυνατή η δημιουργία έρευνας από το πρότυπο"
          : "Could not create survey from template"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'el' ? "Δημιουργία Έρευνας από Πρότυπο" : "Create Survey from Template"}
          </DialogTitle>
          <DialogDescription>
            {language === 'el'
              ? `Εισάγετε τα στοιχεία του ${businessType.toLowerCase()} σας για να δημιουργήσετε μια έρευνα χρησιμοποιώντας το πρότυπο ${getTranslatedTemplateName()}.`
              : `Enter your ${businessType.toLowerCase()} details to create a survey using the ${template?.name} template.`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">
              {language === 'el' ? `Όνομα ${businessType}` : `${businessType} Name`}
            </Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="max-w-lg"
              placeholder={language === 'el'
                ? `Εισάγετε το όνομα του ${businessType.toLowerCase()} σας`
                : `Enter your ${businessType.toLowerCase()} name`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="google-maps-url">
              {language === 'el' ? "URL Google Maps" : "Google Maps URL"}
            </Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="google-maps-url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="pl-10"
                  placeholder="https://maps.app.goo.gl/your-business"
                  required
                />
              </div>
              <a
                href="https://support.google.com/maps/answer/144361?hl=en&co=GENIE.Platform%3DDesktop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                {language === 'el' ? "Βοήθεια" : "Help"}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'el'
                ? "Αυτό το URL θα χρησιμοποιηθεί για την ανακατεύθυνση των πελατών όταν δίνουν υψηλή βαθμολογία."
                : "This URL will be used to redirect customers when they give a high rating."}
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {language === 'el' ? "Ακύρωση" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  {language === 'el' ? "Δημιουργία..." : "Creating..."}
                </>
              ) : (
                language === 'el' ? "Δημιουργία Έρευνας" : "Create Survey"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUseDialog;
