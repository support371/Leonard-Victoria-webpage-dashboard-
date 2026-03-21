import React from 'react';

export default function Terms() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
      <p className="text-gray-500 mb-10">Last updated: January 1, 2024</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing the Leonard &amp; Victoria website and member portal, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Membership</h2>
          <p>
            Membership is granted upon approval by the membership committee. Members agree to abide by the organization's governance documents, code of conduct, and manifesto. Membership may be revoked for violations of these standards following a fair review process.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Payments and Refunds</h2>
          <p>
            Membership dues and donations are processed by Stripe. Membership dues are billed monthly and may be cancelled at any time effective at the end of the current billing period. Donations are non-refundable unless made in error.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Prohibited Conduct</h2>
          <p>
            Members and visitors agree not to engage in any conduct that violates applicable laws, infringes on the rights of others, disrupts organizational operations, or misrepresents their identity or affiliation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
          <p>
            Leonard &amp; Victoria is not liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you in the prior 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms. Members will be notified of material changes via email at least 30 days before they take effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
          <p>
            Questions about these terms: legal@leonardandvictoria.org
          </p>
        </section>
      </div>
    </div>
  );
}
