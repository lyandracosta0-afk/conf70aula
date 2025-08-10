import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasActiveSubscription: boolean;
  subscriptionLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user?.email) {
      setHasActiveSubscription(false);
      return;
    }

    setSubscriptionLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/check-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email: user.email })
      });

      if (!response.ok) {
        throw new Error('Failed to check subscription');
      }

      const data = await response.json();
      setHasActiveSubscription(data.hasActiveSubscription || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasActiveSubscription(false);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setHasActiveSubscription(false);
    }
  }, [user]);
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setHasActiveSubscription(false);
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    hasActiveSubscription,
    subscriptionLoading,
    signIn,
    signUp,
    signOut,
    checkSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};