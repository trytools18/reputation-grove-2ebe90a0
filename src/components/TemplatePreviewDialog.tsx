
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUESTION_TYPES, supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/languageContext";

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
}

const TemplatePreviewDialog = ({ isOpen, onClose, templateId }: TemplatePreviewDialogProps) => {
  const [template, setTemplate] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (isOpen && templateId) {
      fetchTemplateData(templateId);
    } else {
      setTemplate(null);
      setQuestions([]);
    }
  }, [isOpen, templateId, language]);

  const fetchTemplateData = async (id: string) => {
    setIsLoading(true);
    try {
      // Fetch template info
      const { data: templateData, error: templateError } = await supabase
        .from('survey_templates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (templateError) throw templateError;
      
      // Fetch template questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('template_questions')
        .select('*')
        .eq('template_id', id)
        .order('order_num', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      // Process questions to ensure they are rendered properly
      const processedQuestions = questionsData?.map(q => {
        // Translate question text based on language
        let questionText = q.text;
        
        // If language is Greek, translate the question text
        if (language === 'el') {
          questionText = translateQuestionText(questionText, q.type);
        }
        
        // If the question has a type that's not multiple-choice or rating,
        // convert it to one of those types for preview purposes
        let questionType = q.type;
        let options = q.options || [];
        
        if (![QUESTION_TYPES.MULTIPLE_CHOICE, QUESTION_TYPES.RATING].includes(questionType)) {
          // Default to multiple-choice with standard options if no options are provided
          if (!options || options.length === 0) {
            questionType = QUESTION_TYPES.MULTIPLE_CHOICE;
            options = language === 'el' 
              ? ['Εξαιρετικό', 'Καλό', 'Μέτριο', 'Κάτω του μετρίου', 'Κακό'] 
              : ['Excellent', 'Good', 'Average', 'Below average', 'Poor'];
          } else {
            questionType = QUESTION_TYPES.MULTIPLE_CHOICE;
          }
        }
        
        // Translate options if language is Greek and we have multiple-choice
        if (language === 'el' && questionType === QUESTION_TYPES.MULTIPLE_CHOICE && options.length > 0) {
          options = translateOptions(options);
        }
        
        return {
          ...q,
          text: questionText,
          type: questionType,
          options: options
        };
      }) || [];
      
      setTemplate(templateData);
      setQuestions(processedQuestions);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to translate question text
  const translateQuestionText = (text: string, type: string): string => {
    // Common questions with translations
    const translations: Record<string, string> = {
      "How would you rate your overall experience?": "Πώς θα βαθμολογούσατε τη συνολική σας εμπειρία;",
      "How satisfied were you with our service?": "Πόσο ικανοποιημένοι ήσασταν με την εξυπηρέτησή μας;",
      "How would you rate the quality of our food?": "Πώς θα βαθμολογούσατε την ποιότητα του φαγητού μας;",
      "How likely are you to recommend us to a friend?": "Πόσο πιθανό είναι να μας συστήσετε σε έναν φίλο;",
      "How would you rate the cleanliness of our restaurant?": "Πώς θα βαθμολογούσατε την καθαριότητα του εστιατορίου μας;",
      "How was the speed of service?": "Πώς ήταν η ταχύτητα εξυπηρέτησης;",
      "Rate the friendliness of our staff": "Βαθμολογήστε τη φιλικότητα του προσωπικού μας",
      "What did you enjoy most about your visit?": "Τι σας άρεσε περισσότερο από την επίσκεψή σας;",
      "Which aspects of our service could be improved?": "Ποιες πτυχές της υπηρεσίας μας θα μπορούσαν να βελτιωθούν;",
      "Do you have any additional comments or suggestions?": "Έχετε πρόσθετα σχόλια ή προτάσεις;",
      "What brought you to our restaurant today?": "Τι σας έφερε στο εστιατόριό μας σήμερα;",
      "How did you hear about us?": "Πώς μάθατε για εμάς;",
      "Would you visit us again?": "Θα μας επισκεπτόσασταν ξανά;",
      "How would you rate the value for money?": "Πώς θα βαθμολογούσατε τη σχέση ποιότητας/τιμής;",
      "How would you rate the ambiance of our restaurant?": "Πώς θα βαθμολογούσατε την ατμόσφαιρα του εστιατορίου μας;",
      "How was your haircut experience?": "Πώς ήταν η εμπειρία του κουρέματός σας;",
      "Rate the quality of our coffee": "Βαθμολογήστε την ποιότητα του καφέ μας",
      "How was your stay at our hotel?": "Πώς ήταν η διαμονή σας στο ξενοδοχείο μας;",
    };
    
    return translations[text] || text;
  };

  // Helper function to translate multiple choice options
  const translateOptions = (options: string[]): string[] => {
    const optionTranslations: Record<string, string> = {
      "Excellent": "Εξαιρετικό",
      "Good": "Καλό",
      "Average": "Μέτριο",
      "Below average": "Κάτω του μετρίου",
      "Poor": "Κακό",
      "Food quality": "Ποιότητα φαγητού",
      "Service": "Εξυπηρέτηση",
      "Ambiance": "Ατμόσφαιρα",
      "Value for money": "Σχέση ποιότητας/τιμής",
      "Cleanliness": "Καθαριότητα",
      "Location": "Τοποθεσία",
      "Staff friendliness": "Φιλικότητα προσωπικού",
      "Yes": "Ναι",
      "No": "Όχι",
      "Maybe": "Ίσως",
      "Friend recommendation": "Σύσταση φίλου",
      "Online search": "Διαδικτυακή αναζήτηση",
      "Social media": "Μέσα κοινωνικής δικτύωσης",
      "Advertisement": "Διαφήμιση",
      "Walking by": "Τυχαία περαστικός/ή",
      "Other": "Άλλο"
    };
    
    return options.map(option => optionTranslations[option] || option);
  };

  const renderQuestionPreview = (question: any) => {
    // Always render either multiple-choice or rating
    if (question.type === QUESTION_TYPES.RATING) {
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="w-10 h-10 rounded-full border hover:bg-primary/10 transition-colors flex items-center justify-center text-sm cursor-default"
            >
              {i + 1}
            </div>
          ))}
        </div>
      );
    } else {
      // Default to multiple choice
      // Ensure we have options to display
      const options = question.options && question.options.length > 0 
        ? question.options 
        : (language === 'el' 
          ? ['Εξαιρετικό', 'Καλό', 'Μέτριο', 'Κάτω του μετρίου', 'Κακό'] 
          : ['Excellent', 'Good', 'Average', 'Below average', 'Poor']);
        
      return (
        <RadioGroup defaultValue={options[0]}>
          {options.map((option: string, i: number) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <RadioGroupItem value={option} id={`option-${question.id}-${i}`} />
              <Label htmlFor={`option-${question.id}-${i}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    }
  };

  const getTranslatedTemplateName = () => {
    if (!template || language !== 'el') return template?.name || "Template Preview";
    
    const templateNameTranslations: Record<string, string> = {
      "Restaurant Customer Satisfaction": "Ικανοποίηση Πελατών Εστιατορίου",
      "Coffee Shop Experience": "Εμπειρία Καφετέριας",
      "Haircut Satisfaction Survey": "Έρευνα Ικανοποίησης Κουρέματος",
      "Hotel Stay Experience": "Εμπειρία Διαμονής σε Ξενοδοχείο"
    };
    
    return templateNameTranslations[template.name] || template.name;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTranslatedTemplateName()}</DialogTitle>
          <DialogDescription>
            {language === 'el' 
              ? "Προεπισκόπηση του πώς θα εμφανίζεται αυτό το πρότυπο έρευνας όταν χρησιμοποιηθεί" 
              : "Preview how this survey template will look when used"}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {language === 'el'
                  ? "Δεν βρέθηκαν ερωτήσεις σε αυτό το πρότυπο."
                  : "No questions found in this template."}
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((question) => (
                  <Card key={question.id} className="shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">{question.text}</h3>
                      {renderQuestionPreview(question)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                {language === 'el' ? "Κλείσιμο Προεπισκόπησης" : "Close Preview"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
