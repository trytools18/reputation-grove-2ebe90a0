
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QUESTION_TYPES } from "@/integrations/supabase/client";

type IndividualResponsesSectionProps = {
  submissions: any[];
  questions: any[];
  formatDate: (date: string) => string;
};

const IndividualResponsesSection = ({ 
  submissions, 
  questions, 
  formatDate 
}: IndividualResponsesSectionProps) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No responses received yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission, index) => (
        <Card key={submission.id} className="shadow-sm border-slate-100">
          <CardHeader className="pb-2 bg-slate-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Response #{submissions.length - index}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDate(submission.created_at)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <h4 className="text-sm font-medium text-slate-700">{question.text}</h4>
                  
                  <div className="mt-1">
                    {question.type === QUESTION_TYPES.RATING && (
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {submission.answers[question.id] || "Not answered"}
                        </span>
                        {submission.answers[question.id] && (
                          <span className="text-sm text-muted-foreground ml-2">
                            out of 5
                          </span>
                        )}
                      </div>
                    )}
                    
                    {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                      <div>
                        {!submission.answers[question.id] || 
                          (Array.isArray(submission.answers[question.id]) && submission.answers[question.id].length === 0) ||
                          (!Array.isArray(submission.answers[question.id]) && submission.answers[question.id] === '') ? (
                          <span className="text-muted-foreground text-sm">Not answered</span>
                        ) : (
                          <ul className="space-y-1 mt-2">
                            {Array.isArray(submission.answers[question.id]) ? 
                              submission.answers[question.id].map((answer: string, i: number) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                  <span>{answer}</span>
                                </li>
                              )) : 
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span>{submission.answers[question.id]}</span>
                              </li>
                            }
                          </ul>
                        )}
                      </div>
                    )}
                    
                    {question.type === QUESTION_TYPES.TEXT && (
                      <div>
                        {!submission.answers[question.id] || submission.answers[question.id].trim() === "" ? (
                          <span className="text-muted-foreground text-sm">Not answered</span>
                        ) : (
                          <p className="text-sm bg-slate-50 p-3 rounded-md border border-slate-200 mt-2">
                            {submission.answers[question.id]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IndividualResponsesSection;
