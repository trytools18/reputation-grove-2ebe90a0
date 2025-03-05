
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertTemplateToSurvey } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

interface TemplateUseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
  } | null;
}

const TemplateUseDialog = ({ isOpen, onClose, template }: TemplateUseDialogProps) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !template) return;
    
    if (!restaurantName.trim()) {
      toast({
        title: "Restaurant name required",
        description: "Please enter a name for your restaurant",
        variant: "destructive"
      });
      return;
    }
    
    if (!googleMapsUrl.trim()) {
      toast({
        title: "Google Maps URL required",
        description: "Please enter your Google Maps URL for redirection",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { id, error } = await convertTemplateToSurvey(
        template.id,
        restaurantName,
        googleMapsUrl,
        user.id
      );
      
      if (error) throw new Error(error);
      
      toast({
        title: "Survey created",
        description: `Successfully created survey from the "${template.name}" template`
      });
      
      // Navigate to the share page for the new survey
      navigate(`/survey/${id}/share`);
    } catch (error: any) {
      console.error("Error creating survey from template:", error);
      toast({
        title: "Error creating survey",
        description: error.message || "Could not create survey from template",
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
          <DialogTitle>Create Survey from Template</DialogTitle>
          <DialogDescription>
            Enter your restaurant details to create a survey using the {template?.name} template.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">Restaurant Name</Label>
            <Input
              id="restaurant-name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter your restaurant name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="google-maps-url">Google Maps URL</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="google-maps-url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="pl-10"
                  placeholder="https://maps.app.goo.gl/your-restaurant"
                  required
                />
              </div>
              <a
                href="https://support.google.com/maps/answer/144361?hl=en&co=GENIE.Platform%3DDesktop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                Help
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              This URL will be used to redirect customers when they give a high rating.
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Survey"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUseDialog;
