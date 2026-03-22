import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Shield, Heart } from 'lucide-react';
import NewsletterForm from '../../components/ui/NewsletterForm';

const PILLARS = [
  {
    icon: Shield,
    title: 'Principled Governance',
    description: 'Transparent structures built on shared values, member accountability, and ethical stewardship of collective resources.',
  },
  {
    icon: Users,
    title: 'Community of Purpose',
    description: 'A curated membership of individuals committed to meaningful contribution and lasting positive impact.',
  },
  {
    icon: BookOpen,
    title: 'Living Knowledge',
    description: 'Ongoing programs, events, and resources that cultivate wisdom, skill, and informed decision-making.',
  },
  {
    icon: Heart,
    title: 'Generous Service',
    description: 'A culture of giving — to members, to communities, and to causes that align with our shared manifesto.',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-black opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-medium text-navy-300 border border-navy-700 px-3 py-1 rounded-full mb-6">
              Est. 2024 — A Principled Organization
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Stewardship.<br />
              <span className="text-navy-300">Community.</span><br />
              Purpose.
            </h1>
            <p className="text-lg text-navy-200 max-w-2xl mb-10 leading-relaxed">
              Leonard &amp; Victoria is a membership organization dedicated to principled governance, shared prosperity, and the cultivation of meaningful community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/membership"
                className="inline-flex items-center px-6 py-3 bg-white text-navy-900 font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                Explore Membership
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/manifesto"
                className="inline-flex items-center px-6 py-3 border border-navy-600 text-white font-semibold rounded-md hover:bg-navy-800 transition-colors"
              >
                Read the Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Four pillars guide every decision, program, and relationship within our organization.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="group p-6 rounded-xl border border-gray-200 hover:border-navy-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-navy-100 transition-colors">
                  <pillar.icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Members' },
              { value: '12',   label: 'Active Programs' },
              { value: '$2M+', label: 'Member Contributions' },
              { value: '3',    label: 'Governance Workspaces' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-navy-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { tier: 'Community', price: '$25/mo', desc: 'For those beginning their journey of principled engagement.', href: '/membership#community' },
              { tier: 'Stewardship', price: '$75/mo', desc: 'For active contributors committed to deeper organizational involvement.', href: '/membership#stewardship', featured: true },
              { tier: 'Legacy', price: '$250/mo', desc: 'For leaders shaping the long-term direction and legacy of the organization.', href: '/membership#legacy' },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-xl p-8 ${plan.featured ? 'bg-navy-900 text-white shadow-xl' : 'bg-white border border-gray-200'}`}
              >
                <h3 className={`font-semibold mb-1 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>{plan.tier}</h3>
                <div className={`text-3xl font-bold mb-4 ${plan.featured ? 'text-navy-200' : 'text-gray-900'}`}>{plan.price}</div>
                <p className={`text-sm mb-6 ${plan.featured ? 'text-navy-300' : 'text-gray-500'}`}>{plan.desc}</p>
                <Link
                  to={plan.href}
                  className={`block text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    plan.featured
                      ? 'bg-white text-navy-900 hover:bg-gray-100'
                      : 'bg-navy-800 text-white hover:bg-navy-700'
                  }`}
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-navy-300 mb-8">
            Receive updates on programs, governance matters, and community news.
          </p>
          <NewsletterForm dark />
        </div>
      </section>
    </>
  );
}
