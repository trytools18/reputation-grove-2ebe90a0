
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { type SurveyTemplate } from "./TemplateCard";

interface TemplateDetailProps {
  template: SurveyTemplate;
  isCreating: boolean;
  onBack: () => void;
  onUse: () => void;
  getCategoryIcon: (category: string) => JSX.Element;
  formatCategoryName: (category: string) => string;
}

const TemplateDetail = ({ 
  template, 
  isCreating, 
  onBack, 
  onUse,
  getCategoryIcon,
  formatCategoryName
}: TemplateDetailProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
      <CardContent>
        <h3 className="text-lg font-medium mb-4">Template Questions</h3>
        <div className="space-y-4">
          {template.questions?.map((question, index) => (
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
          onClick={onBack}
        >
          Back to Templates
        </Button>
        <Button 
          onClick={onUse}
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
  );
};

export default TemplateDetail;
