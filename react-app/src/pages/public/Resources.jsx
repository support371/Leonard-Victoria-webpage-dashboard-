import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const RESOURCES = [
  { title: 'Governance Charter', description: 'The foundational governance document of Leonard & Victoria.', type: 'PDF', href: '#' },
  { title: 'Member Handbook', description: 'A guide to rights, responsibilities, and participation.', type: 'PDF', href: '#' },
  { title: 'Annual Report 2024', description: 'Financial overview, program summaries, and organizational updates.', type: 'PDF', href: '#' },
  { title: 'Manifesto (Printable)', description: 'A formatted print version of our core commitments.', type: 'PDF', href: '/manifesto' },
];

export default function Resources() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
        <p className="text-gray-600 text-lg">Public documents, guides, and materials for current and prospective members.</p>
      </div>

      <div className="space-y-4 mb-16">
        {RESOURCES.map((r) => (
          <a
            key={r.title}
            href={r.href}
            className="flex items-center gap-5 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-navy-300 transition-all group"
          >
            <div className="w-11 h-11 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-navy-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-0.5">{r.title}</h3>
              <p className="text-sm text-gray-500">{r.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">{r.type}</span>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-navy-500 transition-colors" />
            </div>
          </a>
        ))}
      </div>

      <div className="bg-navy-50 border border-navy-100 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Members-Only Documents</h2>
        <p className="text-gray-600 mb-5 text-sm">
          Governance minutes, financial statements, and member-restricted materials are available in the member portal.
        </p>
        <Link
          to="/portal"
          className="inline-block px-6 py-2.5 bg-navy-800 text-white rounded-md text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          Access Member Portal
        </Link>
      </div>
    </div>
  );
}
