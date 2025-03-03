
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";

type TemplateQuestion = {
  id: string;
  template_id: string;
  text: string;
  type: string;
  options: string[] | null;
  order_num: number;
};

export type SurveyTemplate = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string | null;
  questions?: TemplateQuestion[];
};

interface TemplateCardProps { 
  template: SurveyTemplate; 
  onUse: (template: SurveyTemplate) => void;
  getCategoryIcon: (category: string) => JSX.Element;
  formatCategoryName: (category: string) => string;
}

const TemplateCard = ({ 
  template, 
  onUse,
  getCategoryIcon,
  formatCategoryName 
}: TemplateCardProps) => {
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

export default TemplateCard;
