import { useState } from 'react';
import { FileText, Loader2, Download } from 'lucide-react';
import { useVictoriaDocuments } from '../../../hooks/useVictoria';

const CATEGORY_BADGE = {
  governance: 'bg-purple-100 text-purple-700',
  legal:      'bg-red-100 text-red-700',
  finance:    'bg-emerald-100 text-emerald-700',
  operations: 'bg-blue-100 text-blue-700',
  member:     'bg-orange-100 text-orange-700',
  general:    'bg-gray-100 text-gray-600',
};

const fmtSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export default function VictoriaDocuments() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const { data: documents, isLoading, error } = useVictoriaDocuments({ category: categoryFilter || undefined });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-purple-950 flex items-center gap-2"><FileText size={20} /> Documents</h1>
        <p className="text-sm text-gray-500 mt-0.5">{documents?.length || 0} governance documents</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'governance', 'legal', 'finance', 'operations', 'member', 'general'].map((c) => (
          <button key={c} onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              categoryFilter === c ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {c || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !documents?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No documents found</p>
          <p className="text-gray-400 text-xs mt-1">Upload documents from the workspace Documents section.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Size</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-purple-900">{doc.title}</p>
                        {doc.description && <p className="text-xs text-gray-400">{doc.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_BADGE[doc.category] || ''}`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtSize(doc.size_bytes)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
