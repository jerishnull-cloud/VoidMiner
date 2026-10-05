import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js';
import { createClient } from '../../utils/supabase/client';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch (initializationError) {
      if (active) {
        setError(initializationError instanceof Error
          ? initializationError.message
          : 'Unable to initialize authentication.');
        setLoading(false);
      }
      return () => { active = false; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession: Session | null) => {
        receivedAuthEvent = true;
        if (!active) return;
        setSession(nextSession);
        setError(null);
        setLoading(false);
      },
    );

    void supabase.auth.getSession()
      .then((result: { data: { session: Session | null }; error: AuthError | null }) => {
        if (!active || receivedAuthEvent) return;
        if (result.error) throw result.error;
        setSession(result.data.session);
        setError(null);
        setLoading(false);
      })
      .catch((sessionError: unknown) => {
        if (!active || receivedAuthEvent) return;
        setSession(null);
        setError(sessionError instanceof Error ? sessionError.message : 'Unable to restore your session.');
        setLoading(false);
        console.error('Supabase session initialization failed:', sessionError);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
