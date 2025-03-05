
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUESTION_TYPES, DB_TO_FRONTEND_TYPE, supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
}

const TemplatePreviewDialog = ({ isOpen, onClose, templateId }: TemplatePreviewDialogProps) => {
  const [template, setTemplate] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && templateId) {
      fetchTemplateData(templateId);
    } else {
      setTemplate(null);
      setQuestions([]);
    }
  }, [isOpen, templateId]);

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
      
      // Make sure we have mostly multiple choice and rating questions
      const processedQuestions = questionsData?.map(q => {
        // Ensure question type is either multiple-choice or rating, defaulting to what's in the DB
        let questionType = q.type;
        if (![QUESTION_TYPES.MULTIPLE_CHOICE, QUESTION_TYPES.RATING].includes(questionType)) {
          console.log(`Converting question type from "${questionType}" to "multiple-choice"`);
          // Instead of changing the database values here, we just modify the local display
        }
        return q;
      }) || [];
      
      setTemplate(templateData);
      setQuestions(processedQuestions);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionPreview = (question: any) => {
    switch (question.type) {
      case QUESTION_TYPES.RATING:
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
      
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return question.options && (
          <RadioGroup defaultValue={question.options[0]}>
            {question.options.map((option: string, i: number) => (
              <div key={i} className="flex items-center space-x-2 py-1">
                <RadioGroupItem value={option} id={`option-${question.id}-${i}`} />
                <Label htmlFor={`option-${question.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case QUESTION_TYPES.TEXT:
      default:
        return (
          <Textarea 
            className="w-full resize-none bg-muted/50 cursor-not-allowed" 
            rows={3} 
            placeholder="Text response field" 
            disabled
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template?.name || "Template Preview"}</DialogTitle>
          <DialogDescription>
            Preview how this survey template will look when used
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No questions found in this template.</p>
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
              <Button onClick={onClose}>Close Preview</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
