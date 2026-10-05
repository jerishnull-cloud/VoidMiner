import type { User } from '@supabase/supabase-js';
import { createClient, setRememberSession } from '../../utils/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  provider: string;
}

export function toAuthUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  const username = typeof metadata.username === 'string' ? metadata.username : '';
  const fullName = typeof metadata.full_name === 'string' && metadata.full_name.trim()
    ? metadata.full_name.trim()
    : typeof metadata.name === 'string' && metadata.name.trim()
      ? metadata.name.trim()
      : user.email?.split('@')[0] || 'MINER';
  const avatarUrl = typeof metadata.avatar_url === 'string' && metadata.avatar_url
    ? metadata.avatar_url
    : typeof metadata.picture === 'string' && metadata.picture
      ? metadata.picture
      : null;
  const provider = typeof user.app_metadata?.provider === 'string' && user.app_metadata.provider
    ? user.app_metadata.provider
    : 'email';

  return {
    id: user.id,
    email: user.email ?? '',
    username: username.trim() || fullName,
    fullName,
    avatarUrl,
    provider,
  };
}

export async function signIn(email: string, password: string, rememberMe: boolean): Promise<AuthUser> {
  setRememberSession(rememberMe);
  const { data, error } = await createClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Supabase did not return an authenticated account.');
  return toAuthUser(data.user);
}

export async function createAccount(username: string, email: string, password: string): Promise<boolean> {
  const { data, error } = await createClient().auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${window.location.origin}/login?registered=1`,
    },
  });

  if (error) throw error;
  if (data.session) {
    const { error: signOutError } = await createClient().auth.signOut();
    if (signOutError) throw signOutError;
  }
  return Boolean(data.session);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await createClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/forgot-password?reset=1`,
  });

  if (error) throw error;
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await createClient().auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await createClient().auth.signOut();
  if (error) throw error;
}

export async function startGoogleSignIn(rememberMe: boolean): Promise<void> {
  setRememberSession(rememberMe);
  const { error } = await createClient().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login-success`,
    },
  });

  if (error) throw error;
}
