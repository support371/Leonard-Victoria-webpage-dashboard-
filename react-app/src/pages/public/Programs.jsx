import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Mic, Globe } from 'lucide-react';

const PROGRAMS = [
  {
    icon: BookOpen,
    title: 'Member Education Series',
    category: 'Education',
    description:
      'Monthly deep-dives into governance, finance, and leadership facilitated by practitioners and scholars.',
    audience: 'All members',
  },
  {
    icon: Users,
    title: 'Mentorship Circles',
    category: 'Development',
    description:
      'Structured peer mentorship connecting members across experience levels for mutual growth and accountability.',
    audience: 'Stewardship & Legacy members',
  },
  {
    icon: Mic,
    title: 'Community Dialogues',
    category: 'Dialogue',
    description:
      'Facilitated conversations on challenging topics that matter to our community, with a commitment to honest, respectful engagement.',
    audience: 'All members',
  },
  {
    icon: Globe,
    title: 'Civic Engagement Initiative',
    category: 'Civic',
    description:
      'Coordinated participation in local governance, public comment processes, and community stewardship projects.',
    audience: 'All members',
  },
];

export default function Programs() {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Programs are the lifeblood of the organization — they are how purpose becomes practice.
        </p>
      </div>

      <div className="space-y-8">
        {PROGRAMS.map((program) => (
          <div
            key={program.title}
            className="flex gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <program.icon className="w-7 h-7 text-navy-700" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{program.title}</h3>
                <span className="text-xs font-medium text-navy-700 bg-navy-50 border border-navy-100 px-2 py-0.5 rounded-full">
                  {program.category}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{program.description}</p>
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-600">For:</span> {program.audience}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-navy-50 border border-navy-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Propose a Program</h2>
        <p className="text-gray-600 mb-6">
          Members are encouraged to propose new programs that align with our manifesto.
        </p>
        <Link
          to="/contact"
          className="inline-block px-6 py-3 bg-navy-800 text-white rounded-md font-medium hover:bg-navy-700 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
