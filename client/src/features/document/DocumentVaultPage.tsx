import { useState } from 'react'
import { Plus, History, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import DocumentSummary from './components/DocumentSummary'
import DocumentTable from './components/DocumentTable'
import UploadDocumentModal from './components/UploadDocumentModal'
import { useDocuments, useUploadDocument, useDeleteDocument } from './api'
import type { DocumentResponse, DocumentCategory } from './types'

export default function DocumentVaultPage() {
  const userId = 'USER_123' // TODO: Get from auth context
  const [includeReplaced, setIncludeReplaced] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    DocumentCategory | undefined
  >()

  const { data: documents = [], isLoading } = useDocuments(
    userId,
    includeReplaced,
  )
  const uploadMutation = useUploadDocument()
  const deleteMutation = useDeleteDocument()

  const handleUpload = (formData: FormData) => {
    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false)
      },
    })
  }

  const handleReplace = (doc: DocumentResponse) => {
    setSelectedCategory(doc.category)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (globalThis.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Document Vault
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your organisation&apos;s compliance and registration documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncludeReplaced(!includeReplaced)}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
              includeReplaced
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            {includeReplaced ? 'Showing History' : 'Show History'}
          </button>
          <button
            onClick={() => {
              setSelectedCategory(undefined)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </button>
        </div>
      </div>

      {/* Summary */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 rounded-2xl border border-slate-200"
            />
          ))}
        </div>
      ) : (
        <DocumentSummary documents={documents} />
      )}

      {/* Table */}
      <DocumentTable
        documents={documents}
        onDelete={handleDelete}
        onReplace={handleReplace}
      />

      {/* Upload Modal */}
      <UploadDocumentModal
        key={`${isModalOpen}-${selectedCategory}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
        initialCategory={selectedCategory}
        userId={userId}
      />
    </div>
  )
}
