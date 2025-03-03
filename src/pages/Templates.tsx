
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Clipboard, Coffee, Scissors, Hotel, Utensils, ListFilter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type TemplateQuestion = {
  id: string;
  template_id: string;
  text: string;
  type: string;
  options: string[] | null;
  order_num: number;
};

type SurveyTemplate = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string | null;
  questions?: TemplateQuestion[];
};

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'barbershop':
        return <Scissors className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      default:
        return <ListFilter className="h-4 w-4" />;
    }
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                {getCategoryIcon(selectedTemplate.category)}
                {formatCategoryName(selectedTemplate.category)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Template Questions</h3>
            <div className="space-y-4">
              {selectedTemplate.questions?.map((question, index) => (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {question.type === 'rating' ? 'Rating Question' : 
                       question.type === 'multiplechoice' ? 'Multiple Choice' : 'Text Response'}
                    </span>
                  </div>
                  <h4 className="font-medium">{question.text}</h4>
                  
                  {question.type === 'multiplechoice' && question.options && (
                    <div className="mt-2 pl-4">
                      <ul className="list-disc text-sm space-y-1 text-muted-foreground">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="mt-2 flex space-x-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="w-8 h-8 flex items-center justify-center border rounded-full">
                          {num}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
            >
              Back to Templates
            </Button>
            <Button 
              onClick={createSurveyFromTemplate}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-b-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Use Template
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Tabs defaultValue={selectedCategory || categories[0]}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
                All Templates
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-1"
                >
                  {getCategoryIcon(category)}
                  {formatCategoryName(category)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onUse={handleUseTemplate}
                    getCategoryIcon={getCategoryIcon}
                    formatCategoryName={formatCategoryName}
                  />
                ))}
              </div>
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates
                    .filter(template => template.category === category)
                    .map(template => (
                      <TemplateCard 
                        key={template.id} 
                        template={template} 
                        onUse={handleUseTemplate}
                        getCategoryIcon={getCategoryIcon}
                        formatCategoryName={formatCategoryName}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

const TemplateCard = ({ 
  template, 
  onUse,
  getCategoryIcon,
  formatCategoryName 
}: { 
  template: SurveyTemplate; 
  onUse: (template: SurveyTemplate) => void;
  getCategoryIcon: (category: string) => JSX.Element;
  formatCategoryName: (category: string) => string;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon(template.category)}
            {formatCategoryName(template.category)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{template.questions?.length || 0} questions</span>
          <ul className="mt-2 space-y-1">
            {template.questions?.slice(0, 3).map((question, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span className="line-clamp-1">{question.text}</span>
              </li>
            ))}
            {template.questions && template.questions.length > 3 && (
              <li className="text-xs text-muted-foreground mt-1">
                + {template.questions.length - 3} more questions
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onUse(template)}>
          <Clipboard className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Templates;
