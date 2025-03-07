import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useLanguage } from '@/lib/languageContext'; // Add this import

export type AuthSession = {
  user: User | null;
  isLoading: boolean;
  error: string | null; // Changed to string for translation keys
};

export type SignUpData = {
  email: string;
  password: string;
  businessName: string;
  phoneNumber?: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  business_name: string;
  email: string | null;
  phone_number?: string;
  business_category?: string;
  city?: string;
  onboarding_completed?: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export function useSession(): AuthSession {
  const { t } = useLanguage(); // Add translation hook
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        setError(t('auth.errors.generic')); // Use translation key
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [t]);

  return { user, isLoading, error };
}

// Updated functions with translated errors
export async function signUp({ email, password, businessName, phoneNumber }: SignUpData) {
  const { t } = useLanguage();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
        phone_number: phoneNumber,
      },
    },
  });

  if (error) {
    throw new Error(t(`auth.errors.${error.message}`) || error.message);
  }

  return data;
}

export async function signIn({ email, password }: SignInData) {
  const { t } = useLanguage();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(t(`auth.errors.${error.message}`) || error.message);
  }

  return data;
}

export async function signOut() {
  const { t } = useLanguage();
  
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(t('auth.errors.signOut'));
  }
  return true;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { t } = useLanguage();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error(t('auth.errors.fetchProfile'));
  }

  return data as UserProfile;
}

export async function updateUserProfile(updates: any) {
  const { t } = useLanguage();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error(t('auth.errors.notAuthenticated'));
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(t('auth.errors.updateProfile'));
  }

  return data;
}

export function useUserProfile() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        setError(t('auth.errors.fetchProfile'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [user, t]);

  return { 
    profile, 
    isLoading, 
    error, 
    refetch: async () => {
      if (user) {
        try {
          setIsLoading(true);
          const profileData = await getUserProfile();
          setProfile(profileData);
        } catch (err) {
          setError(t('auth.errors.fetchProfile'));
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
}