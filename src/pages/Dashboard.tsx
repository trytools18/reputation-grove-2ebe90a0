import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useUserProfile, useIsAdmin } from "@/lib/auth";
import { Plus, LineChart, BarChart } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useSession();
  const { profile, isLoading } = useUserProfile();
  const [surveys, setSurveys] = useState([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(true);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    async function fetchSurveys() {
      if (!user) return;

      try {
        setIsLoadingSurveys(true);
        const { data, error } = await supabase
          .from("forms")
          .select("*, submissions(count)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSurveys(data || []);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setIsLoadingSurveys(false);
      }
    }

    fetchSurveys();
  }, [user]);

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (profile && !profile.onboarding_completed) {
    navigate("/onboarding");
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-foreground/70 mt-1">
            {profile?.business_name || "Your Restaurant"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          {isAdmin && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/admin")}
            >
              <LineChart className="h-4 w-4" />
              Admin Dashboard
            </Button>
          )}
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate("/templates")}
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.createSurvey')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingSurveys ? (
          <div className="text-center py-8 col-span-full">Loading surveys...</div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-8 col-span-full">
            <p className="text-muted-foreground">No surveys created yet.</p>
            <Button onClick={() => navigate("/templates")} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create your first survey
            </Button>
          </div>
        ) : (
          surveys.map((survey) => (
            <Card key={survey.id} className="bg-card text-card-foreground shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{survey.restaurant_name}</CardTitle>
                <CardDescription>
                  Created on {new Date(survey.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <span>{survey.submissions?.length || 0} Responses</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="secondary" size="sm" onClick={() => navigate(`/survey/${survey.id}/share`)}>
                  Share
                </Button>
                <Button size="sm" onClick={() => navigate(`/survey/${survey.id}/results`)}>
                  View Results
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
