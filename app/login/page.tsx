'use client';

import { useState, useEffect } from 'react';
import { Users, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client only if credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Helper to set cookie for demo mode
function setDemoCookie(role: string) {
  document.cookie = `demo-user-role=${role}; path=/; max-age=86400`;
}

// Helper to get redirect path based on role
function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'social_worker':
      return '/social-worker/dashboard';
    case 'volunteer':
      return '/volunteer/dashboard';
    default:
      return '/';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect param from URL on client side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectTo(params.get('redirect'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Databasen är inte konfigurerad. Kontakta administratören.');
      }

      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error('Felaktigt e-postadress eller lösenord.');
      }

      if (!data.user) {
        throw new Error('Inloggningen misslyckades. Försök igen.');
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, social_workers(*)')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist or RLS blocks it, use user metadata as fallback
      let role = 'volunteer';
      let fullName = data.user.email?.split('@')[0] || '';
      let municipality = 'Stockholm';
      let accessLevel = null;

      if (profile && !profileError) {
        role = profile.role || 'volunteer';
        fullName = profile.full_name || fullName;
        municipality = profile.municipality || municipality;
        accessLevel = profile.social_workers?.access_level || null;
      } else {
        // Try to get role from user metadata
        const userMeta = data.user.user_metadata;
        if (userMeta?.role) {
          role = userMeta.role;
        }
        console.log('Profile not found, using metadata. Role:', role);
      }
      
      // Set cookie for middleware
      setDemoCookie(role);
      
      // Store user info
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: fullName,
        role: role,
        municipality: municipality,
        access_level: accessLevel
      }));

      // Redirect based on role
      const targetPath = redirectTo || getRedirectPath(role);
      router.push(targetPath);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Inloggningen misslyckades. Kontrollera dina uppgifter.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003D5C] to-[#006B7D] flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">Kontaktperson Platform</span>
        </Link>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-[#003D5C] text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Socialsekreterare Login</h1>
            <p className="text-white/80 text-sm">
              Logga in med din kommunala e-postadress för att få tillgång till volontärdatabasen
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arbetsmail
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="namn@kommun.se"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Använd din kommunala e-postadress
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lösenord
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#006B7D] rounded" />
                  <span className="text-gray-600">Kom ihåg mig</span>
                </label>
                <a href="#" className="text-[#006B7D] hover:underline">
                  Glömt lösenord?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F39C12] hover:bg-[#E67E22] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loggar in...
                  </>
                ) : (
                  <>
                    Logga in
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Har du inget konto?
              </p>
              <Link
                href="/for-socialsekreterare"
                className="text-[#006B7D] hover:underline text-sm font-medium"
              >
                Läs mer om hur du får tillgång →
              </Link>
            </div>
          </form>

          {/* Demo hint */}
          <div className="bg-[#E8F4F8] px-8 py-4 text-center space-y-1">
            <p className="text-xs text-[#003D5C] font-semibold mb-2">Demo-inloggningar:</p>
            <p className="text-xs text-[#003D5C]">
              <strong>Admin:</strong> admin@example.com → /admin
            </p>
            <p className="text-xs text-[#003D5C]">
              <strong>Socialsekreterare:</strong> test@kommun.se → /social-worker
            </p>
            <p className="text-xs text-[#003D5C]">
              <strong>Volontär:</strong> volontar@test.se → /volunteer
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center">
        <p className="text-white/60 text-sm">
          © 2024 Kontaktperson Platform
        </p>
      </footer>
    </div>
  );
}
