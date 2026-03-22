import React from 'react';

export default function Privacy() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: January 1, 2024</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>
            We collect information you provide directly: name, email address, phone number, and membership application details. We also collect limited usage data such as IP addresses and browser type for security and analytics purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>
            We use your information to process membership applications, communicate organizational news, facilitate program participation, process payments, and comply with legal obligations. We do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h2>
          <p>
            Member data is stored securely using industry-standard encryption. We use Supabase-managed PostgreSQL infrastructure with row-level security policies. Payment processing is handled exclusively by Stripe — we do not store payment card details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Retention</h2>
          <p>
            We retain member data for the duration of active membership plus three years. Contact form submissions are retained for two years. You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
          <p>
            You have the right to access, correct, and delete your personal data. You may opt out of non-essential communications at any time. To exercise these rights, contact us at privacy@leonardandvictoria.org.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
          <p>
            Questions about this policy should be directed to: privacy@leonardandvictoria.org
          </p>
        </section>
      </div>
    </div>
  );
}
