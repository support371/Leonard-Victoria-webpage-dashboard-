import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { apiClient } from '../../lib/api';

const AMOUNTS = [25, 50, 100, 250, 500];

export default function Donate() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;

  const handleDonate = async () => {
    setError('');
    if (!finalAmount || finalAmount < 1) {
      setError('Please enter a valid donation amount.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/payments/checkout', {
        plan: 'donation',
        amount: finalAmount,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.message || 'Unable to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-96 py-16 bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h1>
            <p className="text-gray-600">
              Your generosity directly supports our programs, community initiatives, and operations.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(''); }}
                className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  amount === a && !customAmount
                    ? 'bg-navy-800 text-white border-navy-800'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-navy-400'
                }`}
              >
                ${a}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Or enter a custom amount ($)</label>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Other amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
          )}

          <button
            onClick={handleDonate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-navy-800 text-white font-semibold rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Redirecting...' : `Donate $${finalAmount || '...'}`}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Processed securely via Stripe. Leonard &amp; Victoria does not store your payment details.
          </p>
        </div>
      </div>
    </div>
  );
}
