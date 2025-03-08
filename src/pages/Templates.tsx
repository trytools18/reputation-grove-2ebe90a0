
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/languageContext";
import TemplatePreviewDialog from "@/components/TemplatePreviewDialog";
import TemplateUseDialog from "@/components/TemplateUseDialog";

const templates = [
  {
    id: "coffee",
    type: "coffee",
    name: "Coffee Shop Experience",
    description: "A quick survey to gather feedback about your visit",
    longDescription: "A pre-configured template with questions focused on coffee feedback.",
  },
  {
    id: "haircut",
    type: "barbershop",
    name: "Haircut Satisfaction Survey",
    description: "A quick survey to gather feedback about haircut and service",
    longDescription: "A pre-configured template with questions focused on barbershop feedback.",
  },
  {
    id: "hotel",
    type: "hotel",
    name: "Hotel Stay Experience",
    description: "A brief survey to gather feedback about guest experience",
    longDescription: "A pre-configured template with questions focused on hotel feedback.",
  },
  {
    id: "restaurant",
    type: "restaurant",
    name: "Restaurant Customer Satisfaction",
    description: "A short survey to gather feedback about dining experience",
    longDescription: "A pre-configured template with questions focused on restaurant feedback.",
  }
];

const Templates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [useTemplateId, setUseTemplateId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUseOpen, setIsUseOpen] = useState(false);
  const { t, language } = useLanguage();

  const getTranslatedName = (template: any) => {
    if (language === 'el') {
      const nameTranslations: Record<string, string> = {
        "Coffee Shop Experience": "Εμπειρία Καφετέριας",
        "Haircut Satisfaction Survey": "Έρευνα Ικανοποίησης Κουρέματος",
        "Hotel Stay Experience": "Εμπειρία Διαμονής σε Ξενοδοχείο",
        "Restaurant Customer Satisfaction": "Ικανοποίηση Πελατών Εστιατορίου"
      };
      return nameTranslations[template.name] || template.name;
    }
    return template.name;
  };

  const getTranslatedDescription = (template: any) => {
    if (language === 'el') {
      const descTranslations: Record<string, string> = {
        "A quick survey to gather feedback about your visit": "Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με την επίσκεψή σας",
        "A quick survey to gather feedback about haircut and service": "Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με το κούρεμα και την εξυπηρέτηση",
        "A brief survey to gather feedback about guest experience": "Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία των επισκεπτών",
        "A short survey to gather feedback about dining experience": "Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία δείπνου"
      };
      return descTranslations[template.description] || template.description;
    }
    return template.description;
  };

  const getTranslatedLongDescription = (template: any) => {
    if (language === 'el') {
      const longDescTranslations: Record<string, string> = {
        "A pre-configured template with questions focused on coffee feedback.": "Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για καφέ.",
        "A pre-configured template with questions focused on barbershop feedback.": "Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το κουρείο.",
        "A pre-configured template with questions focused on hotel feedback.": "Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το ξενοδοχείο.",
        "A pre-configured template with questions focused on restaurant feedback.": "Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το εστιατόριο."
      };
      return longDescTranslations[template.longDescription] || template.longDescription;
    }
    return template.longDescription;
  };
  
  const openPreview = async (templateId: string) => {
    try {
      // Find the real template ID from Supabase
      const { data, error } = await supabase
        .from('survey_templates')
        .select('id')
        .eq('template_code', templateId)
        .single();
        
      if (error) throw error;
      
      setPreviewTemplateId(data.id);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error opening template preview:", error);
      toast({
        title: t('common.error'),
        description: `${t('common.error')} ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };
  
  const openUseTemplate = (templateId: string) => {
    setUseTemplateId(templateId);
    setIsUseOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t('template.title')}</h1>
            <p className="text-muted-foreground">{t('template.description')}</p>
          </div>
          <Button 
            onClick={() => navigate('/survey/create')}
            className="mt-4 sm:mt-0"
          >
            {t('survey.createCustomSurvey')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl mb-1">{getTranslatedName(template)}</CardTitle>
                  <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                    {template.type}
                  </Badge>
                </div>
                <CardDescription>{getTranslatedDescription(template)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {getTranslatedLongDescription(template)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 pb-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openPreview(template.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('common.preview')}
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => openUseTemplate(template.id)}
                >
                  {t('template.useTemplate')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <TemplatePreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        templateId={previewTemplateId}
      />
      
      <TemplateUseDialog
        isOpen={isUseOpen}
        onClose={() => setIsUseOpen(false)}
        templateId={useTemplateId}
      />
    </DashboardLayout>
  );
};

export default Templates;
