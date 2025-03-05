
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Copy, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';

const ShareSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

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
        
        // Create share URL
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/survey-view/${id}`);
        
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Survey Link</p>
                <div className="flex">
                  <Input value={shareUrl} readOnly className="rounded-r-none" />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/survey-detail/${id}`)}
                >
                  View Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="border p-4 rounded-md bg-white">
              <QRCodeSVG 
                value={shareUrl} 
                size={200}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Scan this QR code to access the survey
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                // Create canvas and download QR code as image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const svg = document.querySelector('svg');
                if (svg && ctx) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const a = document.createElement('a');
                    a.download = `survey-qr-${id}.png`;
                    a.href = canvas.toDataURL('image/png');
                    a.click();
                  };
                  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                }
              }}
            >
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareSurvey;
