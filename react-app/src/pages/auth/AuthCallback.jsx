/**
 * AuthCallback — handles Supabase redirect after email confirmation,
 * magic link sign-in, or OAuth. Supabase appends tokens in the URL hash
 * which the JS client picks up automatically via onAuthStateChange.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Supabase processes the URL hash automatically — just wait for the session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStatus('success');
        const role = session.user?.user_metadata?.role;
        const target = (role === 'admin' || role === 'super_admin') ? '/portal/leonard' : '/portal';
        setTimeout(() => navigate(target, { replace: true }), 1500);
      } else if (event === 'USER_UPDATED' && session) {
        setStatus('success');
        const role = session.user?.user_metadata?.role;
        const target = (role === 'admin' || role === 'super_admin') ? '/portal/leonard' : '/portal';
        setTimeout(() => navigate(target, { replace: true }), 1500);
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setStatus('error');
        setMessage('Authentication failed. The link may have expired.');
      }
    });

    // Fallback: if no event fires after 8s, show error
    const timer = setTimeout(() => {
      setStatus((prev) => {
        if (prev === 'loading') {
          setMessage('Authentication timed out. Please try again.');
          return 'error';
        }
        return prev;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="animate-spin h-10 w-10 text-navy-600 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">Signing you in…</h1>
            <p className="text-sm text-gray-500 mt-1">Please wait while we verify your credentials.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">Welcome back!</h1>
            <p className="text-sm text-gray-500 mt-1">Redirecting to your portal…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">Authentication failed</h1>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-5 px-5 py-2 bg-navy-800 text-white rounded-md text-sm font-medium hover:bg-navy-700 transition-colors"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
