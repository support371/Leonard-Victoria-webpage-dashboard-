import React from 'react';

export default function Disclosures() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclosures</h1>
      <p className="text-gray-500 mb-10">Last updated: January 1, 2024</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Organizational Structure</h2>
          <p>
            Leonard &amp; Victoria is a membership organization operating in accordance with its governance charter. It is not a registered charity or 501(c)(3) entity. Donations are not tax-deductible unless separately designated through applicable charitable programs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Financial Disclosures</h2>
          <p>
            Annual financial summaries are published to the member portal following each fiscal year-end review. Members may request additional financial detail through the formal inquiry process described in the governance charter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Conflicts of Interest</h2>
          <p>
            Council members and staff are required to disclose any conflicts of interest in writing and recuse themselves from related decisions. A register of disclosures is maintained and available to members upon request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
          <p>
            We use the following third-party services: Stripe (payment processing), Supabase (data storage and authentication), and Vercel (hosting). Use of these services is governed by their respective terms and privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact for Disclosures</h2>
          <p>
            Inquiries regarding organizational disclosures: disclosures@leonardandvictoria.org
          </p>
        </section>
      </div>
    </div>
  );
}
