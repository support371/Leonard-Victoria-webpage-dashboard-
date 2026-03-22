import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema } from '../../validation/schemas';
import { apiClient } from '../../lib/api';

export default function NewsletterForm({ dark = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data) => {
    try {
      await apiClient.post('/contact', { ...data, subject: 'Newsletter Subscription', message: 'Newsletter opt-in' });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <p className={`text-sm font-medium ${dark ? 'text-green-300' : 'text-green-700'}`}>
        You're subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <input
          type="email"
          placeholder="Your email address"
          {...register('email')}
          className={`w-full px-4 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-navy-500 ${
            dark
              ? 'bg-navy-800 border-navy-700 text-white placeholder-navy-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-5 py-2.5 bg-navy-700 hover:bg-navy-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </form>
  );
}
