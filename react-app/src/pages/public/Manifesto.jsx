import React from 'react';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Transparency First',
    body: 'Every governance decision, financial allocation, and structural change is made visible to all members. Opacity is not a feature — it is a failure mode.',
  },
  {
    num: '02',
    title: 'Stewardship Over Ownership',
    body: 'We do not own this organization; we steward it. Resources, decisions, and power belong to the community they serve, not to those who temporarily hold them.',
  },
  {
    num: '03',
    title: 'Purposeful Membership',
    body: 'Membership is an act of commitment, not consumption. We expect contribution — of time, insight, and engagement — from everyone who joins.',
  },
  {
    num: '04',
    title: 'Long-Term Thinking',
    body: 'We make decisions with a 20-year horizon, not a 2-year one. Short-term convenience is not worth long-term compromise.',
  },
  {
    num: '05',
    title: 'Earned Trust',
    body: 'Trust is built through consistent behavior over time. We earn it by doing what we say, saying what we mean, and acknowledging when we fall short.',
  },
  {
    num: '06',
    title: 'Generous by Design',
    body: 'Generosity is not an afterthought. We design programs, allocate resources, and structure membership to produce genuine benefit — for members and for those beyond our walls.',
  },
];

export default function Manifesto() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">The Manifesto</h1>
          <p className="text-xl text-navy-200 max-w-2xl">
            These are not aspirations. They are commitments — to our members, to our community, and to the future we are building together.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-12">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="flex gap-8">
              <div className="text-4xl font-bold text-navy-100 w-16 flex-shrink-0 select-none">
                {p.num}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{p.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
