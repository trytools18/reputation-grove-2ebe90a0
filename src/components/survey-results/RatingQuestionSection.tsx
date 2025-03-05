
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type RatingDistributionItem = {
  name: string;
  value: number;
  percentage: number;
};

type QuestionStats = {
  totalAnswered: number;
  average: number;
  distribution: RatingDistributionItem[];
};

type RatingQuestionSectionProps = {
  questions: any[];
  analytics: any;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RatingQuestionSection = ({ questions, analytics }: RatingQuestionSectionProps) => {
  if (questions.length === 0) return null;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 rounded-t-lg border-b">
        <CardTitle>Rating Questions</CardTitle>
        <CardDescription>Results from rating-based questions</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-10">
          {questions.map((question) => {
            const stats: QuestionStats = analytics.questionStats[question.id];
            if (!stats) return null;
            
            return (
              <div key={question.id} className="border-b pb-8 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) => 
                            percentage > 0 ? `${name}: ${percentage}%` : ''
                          }
                        >
                          {stats.distribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="flex items-center">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Average</span>
                      <span className="text-2xl font-bold">{stats.average.toFixed(1)} ★</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Responses</span>
                      <span>{stats.totalAnswered} answers</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Rating Distribution</h4>
                      <ul className="space-y-1">
                        {stats.distribution.map((item: any, idx: number) => (
                          <li key={item.name} className="flex items-center space-x-2">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            <span className="text-sm">
                              {item.name}: {item.percentage}% ({item.value} responses)
                            </span>
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

export default RatingQuestionSection;
