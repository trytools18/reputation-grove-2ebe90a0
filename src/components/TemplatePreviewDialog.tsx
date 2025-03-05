
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateQuestion {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  order_num: number;
}

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
  templateName: string | null;
}

const TemplatePreviewDialog = ({ isOpen, onClose, templateId, templateName }: TemplatePreviewDialogProps) => {
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplateQuestions = async () => {
      if (!templateId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('template_questions')
          .select('*')
          .eq('template_id', templateId)
          .order('order_num', { ascending: true });
          
        if (error) throw error;
        
        setQuestions(data || []);
      } catch (error) {
        console.error("Error fetching template questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && templateId) {
      fetchTemplateQuestions();
    }
  }, [isOpen, templateId]);

  const renderQuestionType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rating':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Rating</Badge>;
      case 'multiple-choice':
      case 'multiplechoice':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Multiple Choice</Badge>;
      case 'text':
        return <Badge className="bg-green-500 hover:bg-green-600">Text</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const renderQuestionPreview = (question: TemplateQuestion) => {
    const questionType = question.type.toLowerCase();

    if (questionType === 'rating') {
      return (
        <div className="mt-2 flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex flex-col items-center mr-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                {rating}
              </div>
              <span className="text-xs mt-1">
                {rating === 1 ? 'Poor' : rating === 5 ? 'Excellent' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (questionType === 'multiple-choice' || questionType === 'multiplechoice') {
      return (
        <div className="mt-2 space-y-2">
          {question.options?.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-4 h-4 rounded-full border border-gray-400 mr-2"></div>
              <span>{option}</span>
            </div>
          )) || <div className="text-sm text-muted-foreground">No options defined</div>}
        </div>
      );
    }

    if (questionType === 'text') {
      return (
        <div className="mt-2 h-24 bg-gray-100 border border-gray-300 rounded-md p-3 text-sm text-muted-foreground">
          Text response area
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{templateName || 'Template'} Preview</DialogTitle>
          <DialogDescription>
            Preview the questions that will be included in your survey
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions found in this template</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-base">{index + 1}. {question.text}</h3>
                    {renderQuestionType(question.type)}
                  </div>
                  {renderQuestionPreview(question)}
                  {index < questions.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
