
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Copy, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from 'qrcode.react';

const ShareSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyUrl, setSurveyUrl] = useState("");

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
        
        // Create a public survey URL
        const baseUrl = window.location.origin;
        setSurveyUrl(`${baseUrl}/survey-view/${id}`);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast({
      title: "Link copied",
      description: "Survey link copied to clipboard"
    });
  };

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
          onClick={() => navigate(`/survey/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Survey
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Share Your Survey</h1>
          <p className="text-muted-foreground mt-1">
            Share your survey with customers to collect feedback
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Share Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input value={surveyUrl} readOnly className="flex-1" />
              <Button size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={surveyUrl} size={180} />
            </div>
            <Button className="mt-4" onClick={() => {
              // Create a temporary link to download the QR code
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = url;
                link.download = `survey-qr-${id}.png`;
                link.click();
              }
            }}>
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareSurvey;
