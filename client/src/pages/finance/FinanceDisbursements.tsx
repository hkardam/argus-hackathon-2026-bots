import { Search, Filter, DollarSign, ArrowUpRight, CheckCircle2, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinanceDisbursements() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Disbursements</h1>
        <p className="text-slate-500 mt-1">Manage and process grant fund transfers.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Grant ID or NGO..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="all">All Statuses</option>
              <option value="pending">Pending Transfer</option>
              <option value="processing">Processing</option>
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
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grant & Grantee</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tranche Details</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">GRT-CDG-2024-012</p>
                  <p className="text-xs text-slate-500">Green Future Foundation</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Inception Tranche
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹ 9,00,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending Transfer
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/finance/disbursements/GRT-CDG-2024-012" className="text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                    Process
                  </Link>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">GRT-EIG-2023-088</p>
                  <p className="text-xs text-slate-500">EduTech Solutions</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Mid-Project Tranche
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹ 15,00,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/finance/disbursements/GRT-EIG-2023-088" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                    View Details
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
