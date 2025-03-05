
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateSurvey = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create a New Survey</h1>
          <p className="text-muted-foreground mt-1">
            Design your custom feedback survey
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The survey creator functionality is under development.</p>
          <p className="mt-4">Please use our pre-built templates in the meantime.</p>
          <div className="mt-6">
            <Button 
              onClick={() => navigate("/templates")}
            >
              Browse Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSurvey;
