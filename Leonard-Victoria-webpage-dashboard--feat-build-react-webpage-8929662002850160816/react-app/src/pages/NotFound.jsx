import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-amber-500 text-7xl font-black mb-6">404</p>
        <h1 className="text-3xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">This route doesn't exist in the Infinite Wealth Command Center platform.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all">
            Return to Website
          </button>
          <button onClick={() => navigate('/dashboard/leonard')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700">
            Owner Command
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
