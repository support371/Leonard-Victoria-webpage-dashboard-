import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Leonard &amp; Victoria</h1>
        <p className="text-xl text-gray-600">
          A membership organization rooted in principle, purpose, and the pursuit of enduring positive impact.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          Leonard &amp; Victoria was founded on the belief that organizations can be both principled and effective — that stewardship of resources, transparent governance, and genuine community are not ideals in tension but natural companions.
        </p>
        <p>
          We bring together individuals who share a commitment to thoughtful contribution: to their communities, to the causes they believe in, and to the organizations they choose to be part of.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Our History</h2>
        <p>
          Founded in 2024, Leonard &amp; Victoria emerged from a shared conviction that membership organizations must evolve. Rather than passive dues-paying structures, we envisioned an active, engaged community where members shape governance, participate in programs, and benefit from shared resources.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Our People</h2>
        <p>
          Our leadership and membership represent diverse backgrounds united by common values. We draw from professional life, civic engagement, scholarship, and community service — and we believe this breadth strengthens rather than divides.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">Our Commitment</h2>
        <p>
          We are committed to full transparency in governance, responsible stewardship of member contributions, and meaningful accountability to those we serve.
        </p>
      </div>

      <div className="mt-16 flex gap-4">
        <Link to="/manifesto" className="px-6 py-3 bg-navy-800 text-white rounded-md font-medium hover:bg-navy-700 transition-colors">
          Read the Manifesto
        </Link>
        <Link to="/governance" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
          Governance Structure
        </Link>
      </div>
    </div>
  );
}
