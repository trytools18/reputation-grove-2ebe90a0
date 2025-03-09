import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export type UserRole = 'user' | 'admin' | 'support';

export type AuthSession = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
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
  role: UserRole;
  created_at: string | null;
  updated_at: string | null;
};

export function useSession(): AuthSession {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(error as Error);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}

export async function signUp({ email, password, businessName, phoneNumber }: SignUpData) {
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

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
        console.error("Error fetching user profile:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  return { profile, isLoading, error, refetch: async () => {
    if (user) {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
  }};
}

export async function getUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }

  return data as UserProfile[];
}

export async function logAdminAction(actionType: string, targetUserId?: string, details?: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: actionType,
      target_user_id: targetUserId,
      details
    });

  if (error) {
    console.error("Error logging admin action:", error);
    throw error;
  }

  return true;
}

export async function impersonateUser(userId: string) {
  // First log this admin action
  await logAdminAction('impersonate_user', userId);
  
  // For security, verify again that the current user is an admin
  const currentProfile = await getUserProfile();
  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error("Unauthorized: Only admins can impersonate users");
  }
  
  // Store the admin's ID in local storage for returning later
  localStorage.setItem('adminImpersonating', 'true');
  localStorage.setItem('originalAdminId', currentProfile.id);
  
  // Sign in as the target user
  // Note: This is a simplified implementation - in production you'd use more secure methods
  // like JWT exchange through a secure server endpoint
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userId, // This is a placeholder - you'll need a real auth mechanism
    password: 'dummy', // This won't work as-is - you need a real implementation
  });
  
  if (error) {
    throw new Error("Unable to impersonate user: " + error.message);
  }
  
  return data;
}

export function useIsAdmin() {
  const { profile, isLoading, error } = useUserProfile();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    if (profile && !isLoading && !error) {
      setIsAdmin(profile.role === 'admin');
    }
  }, [profile, isLoading, error]);
  
  return { isAdmin, isLoading, error };
}
