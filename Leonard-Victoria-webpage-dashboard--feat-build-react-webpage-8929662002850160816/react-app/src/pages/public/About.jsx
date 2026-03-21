import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEAM = [
  {
    name: 'Leonard M. Diana',
    role: 'Owner & Executive Director',
    initials: 'LD',
    gradient: 'from-amber-500 to-yellow-600',
    bio: 'Leonard is the visionary architect of the Infinite Wealth Command Center. A strategic leader and faith-based executive, he built this platform to unify healing, community, and financial alignment under one sovereign structure.',
  },
  {
    name: 'Victoria Eleanor',
    role: 'Operations Director',
    initials: 'VE',
    gradient: 'from-teal-500 to-emerald-600',
    bio: 'Victoria leads operational excellence and community engagement. Her expertise spans membership management, event coordination, and service delivery at scale across global membership communities.',
  },
  {
    name: 'Agent Bernard',
    role: 'Legal Counsel & Governance',
    initials: 'AB',
    gradient: 'from-indigo-500 to-purple-600',
    bio: 'Bernard ensures the platform operates within the highest standards of legal integrity. His focus includes PMA governance, FBO compliance, and comprehensive member protection frameworks.',
  },
];

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">About Us</p>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">Built with Purpose.<br />Operated with Principle.</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            The Infinite Wealth Command Center was founded on a singular conviction: that spiritual alignment, strategic clarity, and community support are not separate — they are a unified system.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">Our Mission</p>
            <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">To Elevate the Standard of Faith-Based Living and Leadership</h2>
            <div className="space-y-4 text-slate-500 leading-relaxed text-sm">
              <p>We exist to serve practitioners, healers, coaches, and intentional leaders who understand that wealth is not only financial — it is spiritual, relational, and communal.</p>
              <p>Our platform brings structure to that understanding. We provide the systems, resources, community, and executive support that transform aligned individuals into grounded, sovereign leaders.</p>
              <p>Every service, membership tier, and community initiative traces back to a singular question: does this help our members live and lead from their highest expression?</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 space-y-6">
            {[
              ['Spiritual Alignment', 'Faith-centered frameworks that ground every decision.'],
              ['Strategic Execution', 'Systems and tools designed for real-world results.'],
              ['Sovereign Community', 'A protected, private membership with global reach.'],
              ['Generational Thinking', 'Building legacy, not just lifestyle.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 font-bold text-sm">{title}</p>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">Leadership</p>
            <h2 className="text-3xl font-black text-slate-900">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md p-8 transition-all text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-xl mx-auto mb-6 shadow-md`}>
                  {member.initials}
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-amber-600 text-sm font-semibold mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Be Part of Something Larger?</h2>
          <p className="text-slate-400 mb-8">The Infinite Wealth community welcomes aligned individuals ready to operate from purpose.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/membership')} className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition-all">Join Membership</button>
            <button onClick={() => navigate('/contact')} className="px-8 py-3.5 border border-slate-600 hover:border-slate-500 text-slate-300 font-semibold rounded-lg transition-all">Contact the Team</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
