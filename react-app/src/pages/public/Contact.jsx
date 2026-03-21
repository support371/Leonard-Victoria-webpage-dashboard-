import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Mail, MapPin } from 'lucide-react';
import { contactSchema } from '../../validation/schemas';
import { apiClient } from '../../lib/api';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await apiClient.post('/contact', data);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          Reach out for inquiries, membership questions, or to learn more about the organization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-navy-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-gray-600 text-sm">contact@leonardandvictoria.org</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-navy-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Mailing Address</h3>
            <p className="text-gray-600 text-sm">Leonard &amp; Victoria<br />200 Civic Center Plaza, Suite 400<br />Washington, DC 20001</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Sent</h2>
              <p className="text-gray-600">We'll be in touch within 2–3 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  {...register('subject')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              {apiError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{apiError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-navy-800 text-white font-medium rounded-md hover:bg-navy-700 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
