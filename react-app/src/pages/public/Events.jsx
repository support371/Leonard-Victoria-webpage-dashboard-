import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { format } from 'date-fns';

function EventCard({ event }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-navy-700 bg-navy-50 border border-navy-100 px-2 py-0.5 rounded-full">
          {event.category || 'General'}
        </span>
        {event.member_only && (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            Members Only
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg mb-2">{event.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
      <div className="space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{event.event_date ? format(new Date(event.event_date), 'MMMM d, yyyy — h:mm a') : 'Date TBD'}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
        {event.capacity && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Capacity: {event.capacity}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await apiClient.get('/events');
      return res.data;
    },
  });

  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
        <p className="text-gray-600 text-lg">Upcoming gatherings, programs, and community activities.</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-gray-500 text-center py-16">Unable to load events at this time.</p>
      )}

      {data?.events?.length === 0 && (
        <p className="text-gray-500 text-center py-16">No upcoming events scheduled.</p>
      )}

      {data?.events && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
