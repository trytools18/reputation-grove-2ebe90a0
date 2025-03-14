
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
    // Bot detection: if the honeypot field is filled, it's likely a bot
    if (data.website && data.website.length > 0) {
      // Fake success to fool the bot
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message,
          phone: data.phone || 'Not provided',
        },
      });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon.",
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
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
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
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Our team is here to help with any questions you might have about our services or to discuss how we can help improve your business reputation.
              </p>
              
              <div className="space-y-4 mt-8">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-primary">support@repute.com</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Office Hours</h3>
                  <p>Monday to Friday, 9:00 AM - 5:00 PM</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>123 Reputation Street, Innovation District, 10001</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
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
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
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
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What can we help you with?" 
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
                    {isSubmitting ? "Sending..." : "Send Message"}
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
