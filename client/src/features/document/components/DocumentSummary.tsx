import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import type { DocumentResponse, DocumentCategory } from '../types'

interface DocumentSummaryProps {
  documents: DocumentResponse[]
}

const REQUIRED_CATEGORIES: { key: DocumentCategory; label: string }[] = [
  { key: 'REGISTRATION', label: 'Registration Certificate' },
  { key: 'AUDITED_FINANCIALS', label: 'Audited Financials' },
  { key: 'CERTIFICATE_80G', label: '80G Certificate' },
  { key: 'FCRA_CERTIFICATE', label: 'FCRA Certificate' },
]

export default function DocumentSummary({ documents }: DocumentSummaryProps) {
  const getDocForCategory = (category: DocumentCategory) => {
    return documents.find(
      (d) => d.category === category && d.status === 'ACTIVE',
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {REQUIRED_CATEGORIES.map(({ key, label }) => {
        const doc = getDocForCategory(key)
        return (
          <div
            key={key}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              {doc ? (
                <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              ) : (
                <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  doc
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {doc ? 'Uploaded' : 'Missing'}
              </span>
              {doc && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
