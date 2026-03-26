import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, ArrowRight, Star, Heart, Quote } from 'lucide-react';
import { apiClient } from '../../lib/api';

export default function CommunityHub() {
  const { data: hubData, isLoading } = useQuery({
    queryKey: ['community', 'hub'],
    queryFn: async () => {
      const res = await apiClient.get('/community/hub');
      return res.data;
    }
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Community Ecosystem</h1>
          <p className="text-xl text-navy-200 max-w-3xl mx-auto mb-10">
            A diverse network of members, practitioners, and visionary leaders collaborating to build a legacy.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/membership" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all">
              Join the Community
            </Link>
            <Link to="/community/services" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-navy-900">Featured Practitioners</h2>
            <p className="text-slate-500 mt-2">Meet the leaders and specialists in our network.</p>
          </div>
          <Link to="/community/profiles" className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
            ))
          ) : hubData?.featured_profiles?.map(profile => (
            <Link key={profile.id} to={`/community/profiles/${profile.id}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:shadow-xl transition-all">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                {profile.featured_image_url ? (
                  <img src={profile.featured_image_url} alt={profile.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Users size={48} />
                  </div>
                )}
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{profile.profile_type}</span>
                <h3 className="text-xl font-bold text-navy-900 mt-1">{profile.full_name}</h3>
                <p className="text-slate-500 mt-2 text-sm line-clamp-2">{profile.bio}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{profile.region}</span>
                  <span className="text-blue-600 font-bold text-sm">View Profile</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials/Stories */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-16">Community Stories</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {hubData?.stories?.map(story => (
              <div key={story.id} className="bg-white p-10 rounded-3xl border border-slate-200 relative shadow-sm">
                <Quote size={40} className="text-blue-100 absolute top-8 right-8" />
                <p className="text-lg text-slate-700 relative italic leading-relaxed">"{story.content}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {story.author_name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900">{story.author_name}</h4>
                    <p className="text-sm text-slate-500">{story.author_role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-navy-900 mb-4">Upcoming Engagements</h2>
        <p className="text-slate-500 mb-12">Connect and grow through shared experiences.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {hubData?.upcoming_events?.map(event => (
            <div key={event.id} className="p-6 border border-slate-200 rounded-2xl text-left hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="font-bold text-navy-900 mb-1">{event.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <Link to="/events" className="text-sm font-bold text-blue-600 hover:underline">Learn More</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
