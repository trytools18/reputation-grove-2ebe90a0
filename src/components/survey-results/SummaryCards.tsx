
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCardsProps = {
  totalResponses: number;
  averageRating: number;
  completionRate: string;
};

const SummaryCards = ({ 
  totalResponses, 
  averageRating, 
  completionRate 
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalResponses}</div>
          <p className="text-sm text-muted-foreground mt-1">Total survey submissions</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <p className="text-sm text-muted-foreground mt-1">Out of 5 stars</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completionRate}</div>
          <p className="text-sm text-muted-foreground mt-1">Of started surveys</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
