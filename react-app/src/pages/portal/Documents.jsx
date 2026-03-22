import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Upload, X, Download, Eye } from 'lucide-react';
import { documentUploadSchema } from '../../validation/schemas';
import { apiClient } from '../../lib/api';
import { supabase } from '../../lib/supabase';

function UploadModal({ onClose }) {
  const qc = useQueryClient();
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(documentUploadSchema),
  });

  const onSubmit = async (data) => {
    setUploadError('');
    if (!file) { setUploadError('Please select a file.'); return; }

    try {
      // 1. Get signed upload URL from backend
      const { data: signedData } = await apiClient.post('/documents/upload-url', {
        filename: file.name,
        content_type: file.type,
        category: data.category,
      });

      // 2. Upload directly to Supabase storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .uploadToSignedUrl(signedData.path, signedData.token, file);

      if (storageError) throw storageError;

      // 3. Save document record via API
      await apiClient.post('/documents', {
        ...data,
        storage_path: signedData.path,
        filename: file.name,
        size_bytes: file.size,
        content_type: file.type,
      });

      qc.invalidateQueries({ queryKey: ['documents'] });
      onClose();
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Upload Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="legal">Legal</option>
              <option value="governance">Governance</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-navy-50 file:text-navy-700 file:font-medium hover:file:bg-navy-100 transition-colors"
            />
            {file && <p className="text-xs text-gray-500 mt-1">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          </div>

          {uploadError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{uploadError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-navy-800 text-white rounded-md hover:bg-navy-700 disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CATEGORY_COLORS = {
  legal: 'bg-indigo-100 text-indigo-700',
  governance: 'bg-blue-100 text-blue-700',
  finance: 'bg-green-100 text-green-700',
  operations: 'bg-orange-100 text-orange-700',
  member: 'bg-gray-100 text-gray-700',
};

export default function Documents() {
  const [showUpload, setShowUpload] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await apiClient.get('/documents');
      return res.data;
    },
  });

  const filtered = data?.documents?.filter((d) =>
    categoryFilter === 'all' || d.category === categoryFilter
  ) ?? [];

  return (
    <div className="space-y-6">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Secure document repository</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-md text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'legal', 'governance', 'finance', 'operations', 'member'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              categoryFilter === cat
                ? 'bg-navy-800 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-gray-500">Unable to load documents.</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No documents in this category.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded by</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                        {doc.filename && <p className="text-xs text-gray-400">{doc.filename}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[doc.category] || 'bg-gray-100 text-gray-700'}`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{doc.uploaded_by || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.public_url && (
                        <a
                          href={doc.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
