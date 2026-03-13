import { FileText, Trash2, RotateCcw, ExternalLink } from 'lucide-react'
import type { DocumentResponse } from '../types'

interface DocumentTableProps {
  documents: DocumentResponse[]
  onDelete: (id: string) => void
  onReplace: (doc: DocumentResponse) => void
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function DocumentTable({
  documents,
  onDelete,
  onReplace,
}: DocumentTableProps) {

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Document Log</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Document Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Uploaded At</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No documents found. Upload your first document to get started.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className={`hover:bg-slate-50 transition-colors ${doc.status === 'REPLACED' ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText
                          className={`h-5 w-5 ${doc.status === 'ACTIVE' ? 'text-blue-600' : 'text-slate-400'}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {doc.documentName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.contentType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.category}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatSize(doc.fileSize)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(doc.uploadedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View"
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        onClick={() => globalThis.open(doc.filePath, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      {doc.status === 'ACTIVE' && (
                        <button
                          title="Replace"
                          className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                          onClick={() => onReplace(doc)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        title="Delete"
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        onClick={() => onDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
