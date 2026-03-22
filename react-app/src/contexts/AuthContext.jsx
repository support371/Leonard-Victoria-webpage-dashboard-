/**
 * AuthContext — single global Supabase auth subscription.
 * Wrap the application in <AuthProvider> so any component
 * can call useAuth() without duplicating subscriptions.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = (s) => {
    setSession(s);
    setUser(s?.user ?? null);
    setRole(s?.user?.user_metadata?.role ?? null);
  };

  useEffect(() => {
    // Restore session from storage on mount
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      applySession(s);

      // When a token refresh fails, Supabase fires SIGNED_OUT
      if (event === 'SIGNED_OUT') {
        // Clear any query cache etc. — callers can react via `session === null`
        applySession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    applySession(null);
  };

  const hasRole = (...roles) => {
    if (!role) return false;
    if (role === 'super_admin' || role === 'admin') return true;
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
