import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function setRememberSession(remember: boolean): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const maxAge = remember ? '; Max-Age=2592000' : '';
  document.cookie = `void-miner-remember=${remember ? '1' : '0'}; Path=/; SameSite=Lax${maxAge}${secure}`;
}

export function createClient() {
  const missingConfig = [
    !supabaseUrl && 'VITE_SUPABASE_URL',
    !supabasePublishableKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
  ].filter((name): name is string => Boolean(name));

  if (missingConfig.length > 0) {
    throw new Error(`Authentication configuration is missing: ${missingConfig.join(', ')}.`);
  }

  browserClient ??= createBrowserClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
    cookieOptions: {
      name: 'void-miner-auth',
      ...(document.cookie.split('; ').includes('void-miner-remember=1') ? { maxAge: 2592000 } : {}),
      path: '/',
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    },
  });

  return browserClient;
}
