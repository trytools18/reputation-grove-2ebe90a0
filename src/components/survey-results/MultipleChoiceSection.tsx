
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type MultipleChoiceSectionProps = {
  questions: any[];
  analytics: any;
};

const MultipleChoiceSection = ({ questions, analytics }: MultipleChoiceSectionProps) => {
  if (questions.length === 0) return null;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg border-b">
        <CardTitle>Multiple-Choice Questions</CardTitle>
        <CardDescription>Results from selection-based questions</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-10">
          {questions.map((question) => {
            const stats = analytics.questionStats[question.id];
            if (!stats) return null;
            
            return (
              <div key={question.id} className="border-b pb-8 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={stats.distribution}
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={120}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                        <Bar dataKey="value" name="Responses" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Respondents</span>
                      <span>{stats.totalAnswered} people answered</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response Distribution</h4>
                      <ul className="space-y-2">
                        {stats.distribution.map((item: any) => (
                          <li key={item.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="text-sm flex-1">
                              {item.name} 
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full" 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">
                                {item.percentage}% ({item.value})
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceSection;
