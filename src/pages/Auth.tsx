
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/lib/languageContext';
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Define the login form schema
  const loginFormSchema = z.object({
    email: z.string().email(t('auth.email') + " " + t('common.required')),
    password: z.string().min(6, t('auth.password') + " " + t('common.required')),
  });
  
  // Define the signup form schema
  const signupFormSchema = z.object({
    email: z.string().email(t('auth.email') + " " + t('common.required')),
    password: z.string().min(6, t('auth.password') + " " + t('common.required')),
    businessName: z.string().min(2, t('account.businessName') + " " + t('common.required')),
    phoneNumber: z.string().optional(),
  });

  // Determine the form schema based on the current mode
  const formSchema = isLogin ? loginFormSchema : signupFormSchema;

  // Setup form with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin 
      ? { email: "", password: "" } 
      : { email: "", password: "", businessName: "", phoneNumber: "" },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn({ email: data.email, password: data.password });
        navigate("/dashboard");
      } else {
        await signUp({
          email: data.email,
          password: data.password,
          businessName: data.businessName,
          phoneNumber: data.phoneNumber,
        });
        toast({
          title: t('app.name'),
          description: t('auth.loggedOut'),
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary underline-offset-4 hover:underline"
            >
              {isLogin ? t('auth.signUp') : t('auth.logIn')}
            </button>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              placeholder="email@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Button variant="link" className="h-auto p-0 text-sm" type="button">
                {t('auth.forgotPassword')}
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">{t('account.businessName')}</Label>
                <Input
                  id="businessName"
                  placeholder={t('template.enterBusinessName', { type: t('category.business') })}
                  type="text"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className="text-sm text-destructive">{errors.businessName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('account.phoneNumber') || 'Phone Number'}</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 234 567 8900"
                  type="tel"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>
            </>
          )}
          
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : isLogin ? t('auth.logIn') : t('auth.signUp')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
