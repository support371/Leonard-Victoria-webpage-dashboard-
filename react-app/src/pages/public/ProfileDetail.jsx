import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Globe, Briefcase, MapPin, Shield, Star, Heart, ArrowLeft, Send } from 'lucide-react';
import { apiClient } from '../../lib/api';

export default function ProfileDetail() {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['community', 'profile', id],
    queryFn: async () => {
      const res = await apiClient.get(`/community/profiles/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex justify-center items-center h-screen animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto" />
          <div className="h-6 w-48 bg-slate-100 rounded mx-auto" />
          <div className="h-4 w-64 bg-slate-50 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) return <div>Profile not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/community/hub" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-navy-900 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Community Hub
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Core Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative group">
                {profile.featured_image_url ? (
                  <img src={profile.featured_image_url} alt={profile.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={80} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-white/20 uppercase tracking-widest">
                  {profile.profile_type}
                </div>
              </div>
              <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-navy-900">{profile.full_name}</h1>
                <p className="text-slate-500 font-medium mt-1 mb-6">{profile.region}</p>
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-100">
                    {profile.availability}
                  </span>
                </div>
                <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group">
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> {profile.contact_cta}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-6">Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Region</p>
                    <p className="text-sm font-bold text-navy-900">{profile.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Availability</p>
                    <p className="text-sm font-bold text-navy-900 capitalize">{profile.availability}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details/Services */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Professional Bio</h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-6">Expertise & Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties?.map(spec => (
                    <span key={spec} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {profile.services?.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900 ml-2">Services & Offerings</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.services.map(service => (
                    <div key={service.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                          <Briefcase size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-3">{service.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">{service.expected_outcome}</p>
                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">{service.price_info || 'Connect for details'}</span>
                        <Send size={18} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
