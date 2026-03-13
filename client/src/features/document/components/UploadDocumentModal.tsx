import React, { useState } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import type { DocumentCategory } from '../types'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (formData: FormData) => void
  initialCategory?: DocumentCategory
  isUploading: boolean
  userId: string
}

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'REGISTRATION', label: 'Registration Certificate' },
  { value: 'AUDITED_FINANCIALS', label: 'Audited Financials' },
  { value: 'CERTIFICATE_80G', label: '80G Certificate' },
  { value: 'FCRA_CERTIFICATE', label: 'FCRA Certificate' },
  { value: 'OTHER', label: 'Other' },
]

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
  initialCategory,
  isUploading,
  userId,
}: UploadDocumentModalProps) {
  const [category, setCategory] = useState<DocumentCategory>(
    initialCategory || 'REGISTRATION',
  )
  const [documentName, setDocumentName] = useState('')
  const [file, setFile] = useState<File | undefined>()
  const [error, setError] = useState<string | undefined>()

  if (!isOpen) return undefined

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.')
        setFile(undefined)
        return
      }
      const allowedFormats = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!allowedFormats.includes(selectedFile.type)) {
        setError('Only PDF and DOC/DOCX formats are allowed.')
        setFile(undefined)
        return
      }
      setError(undefined)
      setFile(selectedFile)
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0])
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !documentName || !category) {
      setError('Please fill all required fields.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    formData.append('category', category)
    formData.append('documentName', documentName)

    onUpload(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            >
              {CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Document Title
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g. FY 2024-25 Audit Report"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">File</label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                file
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50 hover:border-emerald-500/50'
              }`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              <div className="flex flex-col items-center">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${
                    file
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-white shadow-sm text-slate-400'
                  }`}
                >
                  <Upload className="h-6 w-6" />
                </div>
                {file ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, DOC up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? 'Uploading...' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
