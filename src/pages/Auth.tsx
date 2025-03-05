
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, useSession, getUserProfile } from "@/lib/auth";
import { toast } from "sonner";

interface AuthProps {
  isSignUp?: boolean;
}

const Auth = ({ isSignUp }: AuthProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useSession();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(isSignUp ? "signup" : "login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Check URL parameters for tab selection
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    }
  }, [location]);

  useEffect(() => {
    // Redirect if logged in
    const checkAuthAndRedirect = async () => {
      if (user && !isLoading) {
        try {
          const profile = await getUserProfile();
          // Always check if onboarding is completed first
          if (profile && !profile.onboarding_completed) {
            navigate("/onboarding");
            return;
          }
          // If onboarding is completed, go to dashboard
          navigate("/dashboard");
        } catch (error) {
          console.error("Error checking profile:", error);
          // If there's an error fetching the profile, default to dashboard
          navigate("/dashboard");
        }
      }
    };
    
    checkAuthAndRedirect();
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn({ email, password });
      toast.success("Logged in successfully");
      // Redirect will happen in the useEffect based on onboarding status
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!businessName) {
      toast.error("Business name is required");
      setIsSubmitting(false);
      return;
    }

    if (!phoneNumber) {
      toast.error("Phone number is required");
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp({ email, password, businessName, phoneNumber });
      toast.success("Account created! Please check your email to confirm your registration.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {activeTab === "login" ? "Log in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === "login" 
              ? "Enter your credentials to access your account"
              : "Sign up to start creating feedback surveys"}
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="mt-8"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
