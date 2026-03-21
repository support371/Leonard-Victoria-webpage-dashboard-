import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Upload, Eye, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkspaceDocuments } from '../../hooks/useWorkspaces';
import { documentUploadSchema } from '../../validation/schemas';
import api from '../../lib/api';

// Must match the DB CHECK constraint on documents.category
const CATEGORIES = ['general', 'legal', 'governance', 'finance', 'operations', 'member'];

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function WorkspaceDocuments() {
  const { workspaceSlug } = useParams();
  const queryClient = useQueryClient();
  const { data: documents, isLoading, error } = useWorkspaceDocuments(workspaceSlug);

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(documentUploadSchema) });

  const onUpload = async (formData) => {
    setUploading(true);
    setUploadError(null);
    try {
      const file = formData.file[0];

      // Step 1: Get signed upload URL from workspace-scoped endpoint
      const { data: urlData } = await api.post(
        `/api/portal/${workspaceSlug}/documents/upload-url`,
        { filename: file.name, content_type: file.type }
      );

      // Step 2: Upload directly to Supabase Storage
      const uploadRes = await fetch(urlData.signed_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Storage upload failed');

      // Step 3: Save metadata
      await api.post(`/api/portal/${workspaceSlug}/documents`, {
        title: formData.title,
        category: formData.category,
        description: formData.description || undefined,
        storage_path: urlData.path,
        filename: file.name,
        size_bytes: file.size,
        content_type: file.type,
      });

      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceSlug, 'documents'] });
      reset();
      setShowUpload(false);
    } catch (err) {
      setUploadError(err.response?.data?.error || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const filtered =
    filterCategory === 'all'
      ? documents
      : documents?.filter((d) => d.category === filterCategory);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Documents</h1>
          <p className="text-gray-500 text-sm mt-1">
            Secure, workspace-scoped document storage.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
        >
          <Upload size={16} />
          Upload
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-navy-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin h-6 w-6 text-navy-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load documents.</p>
      ) : filtered?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No documents yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Size</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Uploaded</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy-900">{doc.title}</td>
                  <td className="px-6 py-4 text-gray-500 capitalize">{doc.category}</td>
                  <td className="px-6 py-4 text-gray-500">{formatBytes(doc.size_bytes)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {doc.signed_url && (
                      <a
                        href={doc.signed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-navy-600 hover:text-navy-800 text-xs font-medium"
                      >
                        <Eye size={14} />
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-navy-900">Upload Document</h2>
              <button onClick={() => { setShowUpload(false); reset(); setUploadError(null); }}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  {...register('title')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  placeholder="Document title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  {...register('category')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                <input
                  type="file"
                  {...register('file')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100"
                />
                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
              </div>

              {uploadError && (
                <p className="text-red-500 text-sm">{uploadError}</p>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-navy-800 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading…' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
