import { Search, Filter, AlertTriangle, CheckCircle2, ChevronRight, BrainCircuit, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReviewerReviews() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Assigned Reviews</h1>
        <p className="text-slate-500 mt-1">Manage and complete your assigned grant application evaluations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assigned applications..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grant Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">APP-CDG-2024-089</p>
                  <p className="text-xs text-slate-500">Green Future Foundation</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">CDG</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-rose-600 font-medium flex items-center gap-1.5 mt-2">
                  <Clock className="h-4 w-4" /> Tomorrow
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/reviewer/reviews/APP-CDG-2024-089" className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                    Start Scoring
                  </Link>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">APP-EIG-2024-112</p>
                  <p className="text-xs text-slate-500">Tech for All India</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">EIG</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1.5 mt-2">
                  <Clock className="h-4 w-4" /> In 3 days
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/reviewer/reviews/APP-EIG-2024-112" className="text-sm font-medium text-purple-600 hover:text-purple-700 px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors inline-flex items-center gap-2">
                    Continue Review
                  </Link>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">APP-ECAG-2024-045</p>
                  <p className="text-xs text-slate-500">Coastal Care NGO</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">ECAG</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="h-4 w-4" /> Submitted
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/reviewer/reviews/APP-ECAG-2024-045" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                    View Score
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
