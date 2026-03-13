import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, Eye, RefreshCw } from 'lucide-react';

export default function DocumentVault() {
  const documents = [
    { id: 1, name: 'Trust_Deed_2020.pdf', category: 'Registration Certificate', date: 'May 10, 2026', status: 'Active' },
    { id: 2, name: 'Audited_Financials_FY25.pdf', category: 'Audited Financial Statements', date: 'May 11, 2026', status: 'Active' },
    { id: 3, name: 'Old_Registration_2018.pdf', category: 'Registration Certificate', date: 'Jan 15, 2024', status: 'Replaced' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Document Vault</h1>
          <p className="text-slate-500 mt-1">Upload and manage organisational documents used across all grant applications.</p>
        </div>
        <button 
          onClick={() => alert('Upload functionality will be implemented with backend integration.')}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Document Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Registration Certificate</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Uploaded</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Audited Financials</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Uploaded</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-lg shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">80G Certificate</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Missing</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-slate-100 p-2 rounded-lg shrink-0">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">FCRA Certificate</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Optional</p>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded Documents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Document Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Uploaded On</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <span className="font-medium text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.category}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Replace">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
