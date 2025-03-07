
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Eye } from "lucide-react";
import TemplateUseDialog from "@/components/TemplateUseDialog";
import TemplatePreviewDialog from "@/components/TemplatePreviewDialog";
import { useLanguage } from "@/lib/languageContext";

const Templates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; category?: string } | null>(null);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('survey_templates')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        // Process templates to translate them if in Greek
        const processedTemplates = data?.map(template => {
          if (language === 'el') {
            return {
              ...template,
              name: translateTemplateName(template.name),
              description: translateTemplateDescription(template.description),
              category: translateCategory(template.category)
            };
          }
          return template;
        }) || [];
        
        setTemplates(processedTemplates);
      } catch (error: any) {
        console.error("Error fetching templates:", error);
        toast({
          title: language === 'el' ? "Σφάλμα φόρτωσης προτύπων" : "Error loading templates",
          description: error.message || (language === 'el' ? "Δεν ήταν δυνατή η φόρτωση των προτύπων έρευνας" : "Could not load survey templates"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast, language]);

  // Helper functions to translate template content
  const translateTemplateName = (name: string): string => {
    const nameTranslations: Record<string, string> = {
      "Restaurant Customer Satisfaction": "Ικανοποίηση Πελατών Εστιατορίου",
      "Coffee Shop Experience": "Εμπειρία Καφετέριας",
      "Haircut Satisfaction Survey": "Έρευνα Ικανοποίησης Κουρέματος",
      "Hotel Stay Experience": "Εμπειρία Διαμονής σε Ξενοδοχείο"
    };
    
    return nameTranslations[name] || name;
  };
  
  const translateTemplateDescription = (description: string): string => {
    const descriptionTranslations: Record<string, string> = {
      "A short survey to gather feedback about dining experience": "Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία δείπνου",
      "A quick survey to gather feedback about your visit": "Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με την επίσκεψή σας",
      "A quick survey to gather feedback about haircut and service": "Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με το κούρεμα και την εξυπηρέτηση",
      "A brief survey to gather feedback about guest experience": "Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία των επισκεπτών"
    };
    
    return descriptionTranslations[description] || description;
  };
  
  const translateCategory = (category: string): string => {
    const categoryTranslations: Record<string, string> = {
      "Restaurant": "Εστιατόριο",
      "Cafe": "Καφετέρια",
      "Barbershop": "Κουρείο",
      "Hotel": "Ξενοδοχείο",
      "Retail": "Κατάστημα"
    };
    
    return categoryTranslations[category] || category;
  };

  const handleUseTemplate = (template: { id: string; name: string; category: string }) => {
    // Store the original name for the API call but display the translated name
    setSelectedTemplate({
      id: template.id,
      name: template.name,
      category: template.category
    });
    setShowUseDialog(true);
  };

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setShowPreviewDialog(true);
  };

  const handleCloseDialog = () => {
    setShowUseDialog(false);
    setSelectedTemplate(null);
  };

  const handleClosePreviewDialog = () => {
    setShowPreviewDialog(false);
    setPreviewTemplateId(null);
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
              {t('common.back')}
            </Button>
            <h1 className="text-3xl font-bold">{t('template.title')}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{t('template.description')}</p>
        </div>
        <Button onClick={() => navigate("/create-survey")}>
          {t('survey.createCustomSurvey')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              {language === 'el' ? "Δεν υπάρχουν διαθέσιμα πρότυπα" : "No templates available"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'el' ? "Δεν βρέθηκαν πρότυπα ερευνών" : "No survey templates found"}
            </p>
            <Button onClick={() => navigate("/create-survey")}>
              {t('survey.createCustomSurvey')}
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
                  <p>
                    {language === 'el'
                      ? `Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για ${template.category.toLowerCase()}.`
                      : `A pre-configured template with questions focused on ${template.category.toLowerCase()} feedback.`}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handlePreviewTemplate(template.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'el' ? "Προεπισκόπηση" : "Preview"}
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => handleUseTemplate({ 
                    id: template.id, 
                    name: template.name,
                    category: template.category 
                  })}
                >
                  {language === 'el' ? "Χρήση Προτύπου" : "Use Template"}
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
      
      <TemplatePreviewDialog
        isOpen={showPreviewDialog}
        onClose={handleClosePreviewDialog}
        templateId={previewTemplateId}
      />
    </div>
  );
};

export default Templates;
