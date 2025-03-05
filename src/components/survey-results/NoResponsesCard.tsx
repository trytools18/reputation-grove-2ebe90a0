
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type NoResponsesCardProps = {
  surveyId: string;
};

const NoResponsesCard = ({ surveyId }: NoResponsesCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">No responses received yet for this survey.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate(`/survey/${surveyId}/share`)}
        >
          Share your survey to collect responses
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoResponsesCard;
