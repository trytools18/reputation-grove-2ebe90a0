
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, Link, Share2, ArrowLeft } from "lucide-react";

const SurveyShare = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  
  const { user } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const surveyUrl = `${window.location.origin}/s/${id}`;

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        setSurvey(data);
      } catch (error: any) {
        console.error("Error fetching survey:", error);
        toast({
          title: "Error fetching survey",
          description: error.message || "Could not load survey details",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurvey();
  }, [id, user, toast, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl).then(
      () => {
        setCopySuccess('Copied!');
        toast({
          title: "Link copied",
          description: "Survey link copied to clipboard",
        });
        setTimeout(() => setCopySuccess(''), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      }
    );
  };

  const generateQRCode = () => {
    setQrVisible(true);
    // In a real implementation, you'd generate a QR code with a library
    // For now, we'll just show a placeholder
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Survey Not Found</CardTitle>
            <CardDescription>The survey you're looking for does not exist or you don't have permission to access it.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Share Your Survey</CardTitle>
          <CardDescription>Share the feedback form with your customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{survey.restaurant_name}</h3>
            <div className="flex items-center space-x-2">
              <Input value={surveyUrl} readOnly />
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copySuccess && (
              <p className="text-green-500 text-sm mt-2">{copySuccess}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Sharing Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" onClick={copyToClipboard}>
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline" className="justify-start" onClick={generateQRCode}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
              <Button variant="outline" className="justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Send via Email
              </Button>
            </div>
          </div>

          {qrVisible && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">QR Code</h3>
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-400 flex items-center justify-center">
                  <p className="text-center text-gray-500">QR Code Placeholder</p>
                  {/* In a real implementation, you'd render an actual QR code here */}
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">Download QR Code</Button>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="anonymous" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="anonymous">
                    Allow anonymous responses
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Customers can submit feedback without providing contact information
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="multiple-responses" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="multiple-responses">
                    Allow multiple responses
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    The same customer can submit feedback multiple times
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/survey/${id}`)}>
            Preview Survey
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Done
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyShare;
