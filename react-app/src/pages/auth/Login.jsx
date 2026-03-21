import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { loginSchema } from '../../validation/schemas';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-navy-800 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold">LV</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="text-gray-600 mt-1 text-sm">Member portal access</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
                <Lock className="w-4 h-4 flex-shrink-0" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-navy-800 text-white font-medium rounded-md hover:bg-navy-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Not a member?{' '}
          <Link to="/membership" className="text-navy-700 hover:text-navy-900 font-medium">
            Apply for membership
          </Link>
        </p>
      </div>
    </div>
  );
}
