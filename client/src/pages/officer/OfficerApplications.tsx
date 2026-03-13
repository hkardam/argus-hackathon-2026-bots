import { useState } from 'react';
import { Search, Filter, ChevronRight, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OfficerApplications() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-1">Manage and review incoming grant applications.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            All Applications
          </button>
          <button
            onClick={() => setActiveTab('screening')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'screening' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Needs Screening
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'review' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Under Review
          </button>
        </div>

        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grant Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">APP-CDG-2024-089</p>
                  <p className="text-xs text-slate-500">Green Future Foundation</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">CDG</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Needs Screening
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">2 hours ago</td>
                <td className="px-6 py-4 text-right">
                  <Link to="/officer/applications/review" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                    Review <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">APP-EIG-2024-102</p>
                  <p className="text-xs text-slate-500">EduTech Solutions</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">EIG</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Under Review
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">5 hours ago</td>
                <td className="px-6 py-4 text-right">
                  <Link to="/officer/applications/review" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                    View <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
