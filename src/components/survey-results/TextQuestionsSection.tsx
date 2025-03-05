
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/languageContext";

type TextQuestionsSectionProps = {
  questions: any[];
  analytics: any;
  formatDate: (date: string) => string;
};

const TextQuestionsSection = ({ questions, analytics, formatDate }: TextQuestionsSectionProps) => {
  const { t } = useLanguage();
  
  if (questions.length === 0) return null;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg border-b">
        <CardTitle>{t('survey.textResponse')}</CardTitle>
        <CardDescription>{t('surveyView.shareFeedback')}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {questions.map((question) => {
            const stats = analytics.questionStats[question.id];
            if (!stats) return null;
            
            return (
              <div key={question.id} className="border-b pb-6 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{t('common.responses')}</span>
                  <span>{stats.totalAnswered} {t('survey.textResponse').toLowerCase()}</span>
                </div>
                
                {stats.responses.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                    {stats.responses.map((resp: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <p className="mb-1">{resp.response}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('dashboard.submitted')}: {formatDate(resp.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">{t('surveyResults.noResponses')}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextQuestionsSection;
