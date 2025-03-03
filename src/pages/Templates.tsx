
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import TemplateCard, { SurveyTemplate } from "@/components/templates/TemplateCard";
import TemplateDetail from "@/components/templates/TemplateDetail";
import TemplateFilter from "@/components/templates/TemplateFilter";
import { getCategoryIcon, formatCategoryName } from "@/components/templates/TemplateUtils";

const Templates = () => {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { user } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const { data: templatesData, error: templatesError } = await supabase
          .from('survey_templates')
          .select('*');
          
        if (templatesError) throw templatesError;
        
        if (templatesData) {
          const templatesWithQuestions = await Promise.all(
            templatesData.map(async (template) => {
              const { data: questionsData, error: questionsError } = await supabase
                .from('template_questions')
                .select('*')
                .eq('template_id', template.id)
                .order('order_num', { ascending: true });
                
              if (questionsError) throw questionsError;
              
              return {
                ...template,
                questions: questionsData || []
              };
            })
          );
          
          setTemplates(templatesWithQuestions);
          
          if (user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('business_category')
              .eq('id', user.id)
              .single();
              
            if (profileData?.business_category) {
              setSelectedCategory(profileData.business_category);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error fetching templates",
          description: error.message || "Could not load templates",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [user, toast]);

  const handleUseTemplate = (template: SurveyTemplate) => {
    setSelectedTemplate(template);
  };

  const createSurveyFromTemplate = async () => {
    if (!selectedTemplate || !user) return;
    
    setIsCreating(true);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_name, business_category')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert({
          restaurant_name: profileData.business_name || "My Survey",
          google_maps_url: "https://maps.google.com",
          minimum_positive_rating: 4,
          user_id: user.id
        })
        .select()
        .single();
        
      if (formError) throw formError;
      
      // First, let's query the database to find out what valid types are accepted
      const { data: validTypes, error: typesError } = await supabase
        .from('questions')
        .select('type')
        .limit(10);
      
      if (typesError) {
        console.error("Error fetching valid question types:", typesError);
        throw typesError;
      }
      
      console.log("Valid question types from DB:", validTypes);
      
      // Map template question types to valid database question types
      const questionsToInsert = selectedTemplate.questions?.map((question, index) => {
        // Make sure to convert the template question type to a valid database question type
        // Based on database constraints, valid types are likely 'text', 'rating', or 'multiplechoice'
        let dbType;
        
        // Convert template question type to a valid database type
        switch(question.type.toLowerCase()) {
          case 'multiplechoice':
            dbType = 'multiplechoice';
            break;
          case 'rating':
            dbType = 'rating';
            break;
          case 'text':
            dbType = 'text';
            break;
          default:
            // Default to text if unknown type
            dbType = 'text';
        }
        
        console.log(`Converting question type from ${question.type} to ${dbType}`);
        
        return {
          form_id: formData.id,
          text: question.text,
          type: dbType,
          options: question.options,
          order: index
        };
      });
      
      console.log("Questions to insert:", questionsToInsert);
      
      // Before inserting, let's log the first question to see its structure
      if (questionsToInsert && questionsToInsert.length > 0) {
        console.log("First question details:", {
          text: questionsToInsert[0].text,
          type: questionsToInsert[0].type,
          options: questionsToInsert[0].options
        });
      }
      
      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);
        
      if (questionsError) {
        console.error("Error details:", questionsError);
        throw questionsError;
      }
      
      toast({
        title: "Survey created",
        description: "Your survey has been created from the template",
      });
      
      navigate(`/create-survey?id=${formData.id}`);
      
    } catch (error: any) {
      console.error("Error creating survey from template:", error);
      toast({
        title: "Error creating survey",
        description: error.message || "Could not create survey from template",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTemplates = selectedCategory
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const categories = [...new Set(templates.map(template => template.category))];

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
          <h1 className="text-3xl font-bold">Survey Templates</h1>
          <p className="text-muted-foreground mt-1">Choose a pre-built template for your business</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/create-survey")}>
            Create Custom Survey
          </Button>
        </div>
      </div>

      {selectedTemplate ? (
        <TemplateDetail 
          template={selectedTemplate}
          isCreating={isCreating}
          onBack={() => setSelectedTemplate(null)}
          onUse={createSurveyFromTemplate}
          getCategoryIcon={getCategoryIcon}
          formatCategoryName={formatCategoryName}
        />
      ) : (
        <TemplateFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          getCategoryIcon={getCategoryIcon}
          formatCategoryName={formatCategoryName}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onUse={handleUseTemplate}
                getCategoryIcon={getCategoryIcon}
                formatCategoryName={formatCategoryName}
              />
            ))}
          </div>
        </TemplateFilter>
      )}
    </div>
  );
};

export default Templates;
