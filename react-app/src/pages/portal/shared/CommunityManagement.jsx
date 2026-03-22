import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, CheckCircle, XCircle, User, Briefcase, LayoutGrid, Star, ArrowRight } from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function CommunityManagement() {
  const queryClient = useQueryClient();
  const { data: hubData, isLoading } = useQuery({
    queryKey: ['admin', 'community', 'hub'],
    queryFn: async () => {
      const res = await apiClient.get('/community/hub');
      return res.data;
    }
  });

  const featuredMutation = useMutation({
    mutationFn: async (payload) => {
      return apiClient.post('/admin/community/featured/update', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'community', 'hub']);
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-3">
          <Shield className="text-blue-600" /> Community Management
        </h1>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
          Hub Moderation
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Featured Profiles Management */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
            <LayoutGrid size={20} className="text-blue-600" /> Featured Profiles
          </h2>
          <div className="space-y-4">
            {hubData?.featured_profiles?.map((profile, idx) => (
              <div key={profile.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-white font-bold">
                    {profile.full_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{profile.full_name}</p>
                    <p className="text-xs text-slate-400">{profile.profile_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => featuredMutation.mutate({ section: 'hub_featured', resource_type: 'profile', resource_id: profile.id, sort_order: idx, active: false })}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-600 hover:text-blue-600 transition-all text-sm">
              + Add Featured Profile
            </button>
          </div>
        </div>

        {/* Community Stories / Testimonials */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
            <Star size={20} className="text-blue-600" /> Featured Stories
          </h2>
          <div className="space-y-4">
            {hubData?.stories?.map(story => (
              <div key={story.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 italic mb-3">"{story.content.substring(0, 100)}..."</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-800">— {story.author_name}</span>
                  <button className="text-xs font-bold text-red-600 hover:underline">Remove Featured</button>
                </div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-600 hover:text-blue-600 transition-all text-sm">
              + Add Community Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
