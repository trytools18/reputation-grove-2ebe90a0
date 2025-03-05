
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthSession = {
  user: User | null;
  userProfile: UserProfile | null;
  session: boolean;
  isLoading: boolean;
  error: Error | null;
};

export type SignUpData = {
  email: string;
  password: string;
  businessName: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  business_name: string;
  email: string | null;
  business_category?: string;
  city?: string;
  onboarding_completed?: boolean;
  created_at: string | null;
  updated_at: string | null;
};

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getSessionAndProfile() {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }
          
          if (data) {
            setUserProfile(data as UserProfile);
          }
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    }

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile when auth state changes
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }
          
          if (data) {
            setUserProfile(data as UserProfile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      session: !!user, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession(): AuthSession {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  
  return context;
}

export async function signUp({ email, password, businessName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
  return true;
}

export async function getUserProfile(): Promise<UserProfile | null> {
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
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data as UserProfile;
}

export async function updateUserProfile(updates: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}
