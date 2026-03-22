import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, BookOpen, Heart, Award, Globe } from 'lucide-react';

const VALUES = [
  { icon: Shield,   title: 'Principled Governance',  desc: 'Transparent structures, ethical stewardship, and clear accountability at every level.' },
  { icon: Users,    title: 'Purposeful Community',    desc: 'A curated membership united by shared commitments, not just shared interests.' },
  { icon: BookOpen, title: 'Continuous Learning',     desc: 'Programs and resources that cultivate wisdom, skill, and informed leadership.' },
  { icon: Heart,    title: 'Generous Service',         desc: 'A culture of giving — to members, to communities, and to causes that matter.' },
  { icon: Award,    title: 'Member Accountability',   desc: 'High expectations and clear structures that make membership meaningful.' },
  { icon: Globe,    title: 'Civic Responsibility',    desc: 'Engagement with the broader world as an expression of organizational values.' },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-200 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Leonard &amp; Victoria</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A membership organization rooted in principle, purpose, and the pursuit of enduring positive impact.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '2024', label: 'Founded' },
            { value: '500+', label: 'Members' },
            { value: '12',   label: 'Programs' },
            { value: '3',    label: 'Workspaces' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-bold">{value}</div>
              <div className="text-xs text-navy-300 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

        {/* Values Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-navy-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={18} className="text-navy-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link to="/manifesto" className="px-6 py-3 bg-navy-800 text-white rounded-md font-medium hover:bg-navy-700 transition-colors">
            Read the Manifesto
          </Link>
          <Link to="/governance" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Governance Structure
          </Link>
          <Link to="/membership" className="px-6 py-3 border border-navy-300 text-navy-700 rounded-md font-medium hover:bg-navy-50 transition-colors">
            Join as a Member
          </Link>
        </div>
      </div>
    </div>
  );
}
