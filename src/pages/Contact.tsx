
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/lib/languageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Contact form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  phone: z.string().optional(),
  // Honeypot field for bot detection
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
      website: "", // Honeypot field
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Clear any previous errors
    setSubmitError(null);
    
    // Bot detection: if the honeypot field is filled, it's likely a bot
    if (data.website && data.website.length > 0) {
      // Fake success to fool the bot
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone || 'Not provided',
      });
      
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message,
          phone: data.phone || 'Not provided',
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to send message");
      }

      console.log("Response from edge function:", result);

      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });
      
      form.reset({
        name: "",
        email: "",
        message: "",
        phone: "",
        website: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      setSubmitError(error.message || t('contact.errorMessage'));
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">{t('contact.getInTouch')}</h2>
              <p className="text-muted-foreground">
                {t('contact.teamHelp')}
              </p>
              
              <div className="space-y-4 mt-8">
                <div>
                  <h3 className="font-medium">{t('contact.email')}</h3>
                  <p className="text-primary">{t('contact.emailAddress')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">{t('contact.officeHours')}</h3>
                  <p>{t('contact.officeHoursValue')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">{t('contact.location')}</h3>
                  <p>{t('contact.locationValue')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">{t('contact.sendMessage')}</h2>
              
              {submitError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('contact.errorTitle')}</AlertTitle>
                  <AlertDescription>
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.name')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.phone')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.phone')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.message')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('contact.messagePlaceholder')} 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Honeypot field - hidden from users, but bots might fill it out */}
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
