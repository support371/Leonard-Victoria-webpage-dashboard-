import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { memberApplicationSchema } from '../../validation/schemas';
import { apiClient } from '../../lib/api';

const TIERS = [
  {
    id: 'community',
    name: 'Community',
    price: '$25',
    period: '/month',
    description: 'For those beginning their journey of principled engagement.',
    features: [
      'Member newsletter',
      'Access to public events',
      'Member directory listing',
      'Voting rights on basic matters',
      'Community resource library',
    ],
  },
  {
    id: 'stewardship',
    name: 'Stewardship',
    price: '$75',
    period: '/month',
    featured: true,
    description: 'For active contributors committed to deeper organizational involvement.',
    features: [
      'Everything in Community',
      'Access to all programs',
      'Committee participation rights',
      'Exclusive member events',
      'Document repository access',
      'Priority support',
    ],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    price: '$250',
    period: '/month',
    description: 'For leaders shaping the long-term direction of the organization.',
    features: [
      'Everything in Stewardship',
      'Governance council eligibility',
      'Annual recognition',
      'Direct leadership access',
      'Legacy project sponsorship rights',
      'Founding member designation',
    ],
  },
];

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(memberApplicationSchema),
    defaultValues: { membership_tier: 'stewardship' },
  });

  const watchedTier = watch('membership_tier');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await apiClient.post('/applications', data);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received</h2>
          <p className="text-gray-600">
            Thank you for applying. Your application is under review. A member of our team will be in touch within 3–5 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Tiers */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Membership Tiers</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Choose the level of engagement that best reflects your commitment to the organization's mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                id={tier.id}
                className={`rounded-xl p-8 transition-all ${
                  tier.featured
                    ? 'bg-navy-900 text-white shadow-xl ring-2 ring-navy-500'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                <h3 className={`font-semibold text-lg mb-1 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <div className={`flex items-baseline mb-4 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className={`ml-1 text-sm ${tier.featured ? 'text-navy-300' : 'text-gray-500'}`}>{tier.period}</span>
                </div>
                <p className={`text-sm mb-6 ${tier.featured ? 'text-navy-300' : 'text-gray-500'}`}>{tier.description}</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start text-sm">
                      <Check className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${tier.featured ? 'text-navy-300' : 'text-green-500'}`} />
                      <span className={tier.featured ? 'text-navy-200' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  onClick={() => setValue('membership_tier', tier.id)}
                  className={`block text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tier.featured
                      ? 'bg-white text-navy-900 hover:bg-gray-100'
                      : 'bg-navy-800 text-white hover:bg-navy-700'
                  }`}
                >
                  Apply for {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Membership</h2>
          <p className="text-gray-600 mb-10">All applications are reviewed by our membership committee.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  {...register('first_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  {...register('last_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Tier</label>
              <select
                {...register('membership_tier')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                <option value="community">Community — $25/month</option>
                <option value="stewardship">Stewardship — $75/month</option>
                <option value="legacy">Legacy — $250/month</option>
              </select>
              {errors.membership_tier && <p className="text-xs text-red-500 mt-1">{errors.membership_tier.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to join? <span className="text-gray-400">(min 20 characters)</span>
              </label>
              <textarea
                {...register('motivation')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              {errors.motivation && <p className="text-xs text-red-500 mt-1">{errors.motivation.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral (optional)</label>
              <input
                {...register('referral')}
                placeholder="Who referred you?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>

            {apiError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-navy-800 text-white font-medium rounded-md hover:bg-navy-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
