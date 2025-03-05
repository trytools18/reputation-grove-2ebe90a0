
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Survey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setSurvey(data);
      } catch (error: any) {
        console.error("Error fetching survey:", error);
        toast({
          title: "Error",
          description: "Could not load survey",
          variant: "destructive"
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurvey();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Survey Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Survey editing functionality is coming soon.</p>
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => navigate(`/survey-detail/${id}`)}
            >
              View Results
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/survey/${id}/share`)}
            >
              Share Survey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Survey;
