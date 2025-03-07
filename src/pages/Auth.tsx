
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSession, signIn, signUp } from '@/lib/auth';
import { useLanguage } from '@/lib/languageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Auth = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useLanguage();
  const { user } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set mode based on path
    if (location.pathname === '/signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [location.pathname]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setBusinessName('');
    navigate(mode === 'login' ? '/signup' : '/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn({ email, password });
        toast({
          title: t('auth.loginSuccess'),
          description: t('auth.welcomeBack'),
        });
      } else {
        await signUp({ 
          email, 
          password, 
          businessName
        });
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.accountCreated'),
        });
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: mode === 'login' ? t('auth.loginError') : t('auth.signupError'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="ghost" />
      </div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t('auth.welcome')}</CardTitle>
          <CardDescription>
            {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {mode === 'signup' && (
              <div className="grid gap-2">
                <Label htmlFor="businessName">{t('account.businessName')}</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t('account.businessNamePlaceholder')}
                  required
                />
              </div>
            )}
            <Button disabled={isLoading} className="w-full mt-4" type="submit">
              {isLoading ? t('common.loading') : (mode === 'login' ? t('auth.logIn') : t('auth.signUp'))}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <small>
            {mode === 'login' ? (
              <>
                {t('auth.noAccount')}
                <Button variant="link" onClick={toggleMode}>
                  {t('auth.signUp')}
                </Button>
              </>
            ) : (
              <>
                {t('auth.hasAccount')}
                <Button variant="link" onClick={toggleMode}>
                  {t('auth.logIn')}
                </Button>
              </>
            )}
          </small>
          {mode === 'login' && (
            <Button variant="link">
              {t('auth.forgotPassword')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
