import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, Link, Share2, ArrowLeft, ExternalLink, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
const SurveyShare = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);
  const {
    user
  } = useSession();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const surveyUrl = `${window.location.origin}/survey/${id}`;
  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id || !user) return;
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('forms').select('*').eq('id', id).eq('user_id', user.id).single();
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
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopySuccess('Copied!');
      toast({
        title: "Link copied",
        description: "Survey link copied to clipboard"
      });
      setTimeout(() => setCopySuccess(''), 2000);
    }, err => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    });
  };
  const generateQRCode = () => {
    setQrVisible(true);
  };
  const downloadQRCode = () => {
    if (!qrRef.current) return;
    try {
      const svgElement = qrRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG element not found');
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      canvas.width = 512;
      canvas.height = 512;
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8'
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${survey?.restaurant_name || 'survey'}-qrcode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        toast({
          title: "QR Code downloaded",
          description: "The QR code has been saved to your device"
        });
      };
      img.src = svgUrl;
    } catch (error: any) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Download failed",
        description: error.message || "Could not download QR code",
        variant: "destructive"
      });
    }
  };
  const openSurveyForm = () => {
    window.open(surveyUrl, '_blank');
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }
  if (!survey) {
    return <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Survey Not Found</CardTitle>
            <CardDescription>The survey you're looking for does not exist or you don't have permission to access it.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Share Your Survey</CardTitle>
          <CardDescription>Share the feedback form with your customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{survey?.restaurant_name}</h3>
            <div className="flex items-center space-x-2">
              <Input value={surveyUrl} readOnly />
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copySuccess && <p className="text-green-500 text-sm mt-2">{copySuccess}</p>}
            
            <div className="mt-4">
              <Button onClick={openSurveyForm} className="w-full flex items-center justify-center gap-2">
                Open Survey Form <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
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

          {qrVisible && <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">QR Code</h3>
              <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center gap-4">
                <div ref={qrRef} className="w-64 h-64 flex items-center justify-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                  <QRCodeSVG value={surveyUrl} size={240} level="H" includeMargin={true} bgColor={"#ffffff"} fgColor={"#000000"} />
                </div>
                <Button variant="outline" onClick={downloadQRCode} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </div>}

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
    </div>;
};
export default SurveyShare;