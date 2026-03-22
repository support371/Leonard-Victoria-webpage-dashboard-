import React from 'react';

export default function Governance() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Governance</h1>
        <p className="text-xl text-gray-600">
          How we make decisions, who holds authority, and how members exercise their voice.
        </p>
      </div>

      <div className="space-y-12 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Structure</h2>
          <p className="leading-relaxed">
            Leonard &amp; Victoria operates under a member-governed structure. The organization is led by a Stewardship Council elected annually from and by the membership, with operational administration handled by a professional team accountable to that council.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Decision-Making</h2>
          <p className="leading-relaxed mb-4">
            Major decisions — including budget allocation, program additions, and governance amendments — require member input and council approval. We use a tiered decision framework:
          </p>
          <ul className="space-y-3">
            {[
              ['Operational decisions', 'Made by staff within council-approved parameters'],
              ['Program decisions', 'Made by council with member advisory input'],
              ['Governance amendments', 'Require two-thirds council vote and member ratification'],
              ['Major financial decisions', 'Full membership vote required above threshold'],
            ].map(([type, rule]) => (
              <li key={type} className="flex gap-3">
                <span className="font-medium text-gray-900 min-w-48">{type}:</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transparency</h2>
          <p className="leading-relaxed">
            Council meeting minutes, financial summaries, and governance decisions are published to the member portal within 30 days of ratification. Members may request additional detail on any matter through the formal inquiry process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Member Rights</h2>
          <ul className="space-y-2">
            {[
              'Vote in all member-ratification decisions',
              'Run for Stewardship Council after one year of continuous membership',
              'Submit formal proposals for governance or program changes',
              'Access meeting minutes and financial summaries',
              'Request review of any council decision within 60 days',
            ].map((right) => (
              <li key={right} className="flex items-start gap-2">
                <span className="text-navy-600 mt-0.5">•</span>
                <span>{right}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
