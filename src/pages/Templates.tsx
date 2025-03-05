
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import TemplateUseDialog from "@/components/TemplateUseDialog";

const Templates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string } | null>(null);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('survey_templates')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setTemplates(data || []);
      } catch (error: any) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error loading templates",
          description: error.message || "Could not load survey templates",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast]);

  const handleUseTemplate = (template: { id: string; name: string }) => {
    setSelectedTemplate(template);
    setShowUseDialog(true);
  };

  const handleCloseDialog = () => {
    setShowUseDialog(false);
    setSelectedTemplate(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Survey Templates</h1>
          </div>
          <p className="text-muted-foreground mt-1">Choose from pre-built templates to get started quickly</p>
        </div>
        <Button onClick={() => navigate("/create-survey")}>
          Create Custom Survey
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">No templates available</h3>
            <p className="text-muted-foreground mb-4">No survey templates found</p>
            <Button onClick={() => navigate("/create-survey")}>
              Create Custom Survey
            </Button>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <Badge>{template.category}</Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>A pre-configured template with questions focused on {template.category.toLowerCase()} feedback.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleUseTemplate({ id: template.id, name: template.name })}
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <TemplateUseDialog 
        isOpen={showUseDialog} 
        onClose={handleCloseDialog} 
        template={selectedTemplate} 
      />
    </div>
  );
};

export default Templates;
