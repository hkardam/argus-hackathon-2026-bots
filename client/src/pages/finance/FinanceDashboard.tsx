import { useState } from 'react';
import { Search, Filter, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('disbursements');

  const stats = [
    { label: 'Total Committed', value: '₹4.2 Cr', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { label: 'Total Disbursed', value: '₹1.8 Cr', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+5%' },
    { label: 'Pending Tranches', value: '₹45 L', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', trend: '8 pending' },
    { label: 'Reported Expenditure', value: '₹1.2 Cr', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'Verified' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Finance Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage disbursements, track fund utilisation, and verify expenditures.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400 mt-2">{stat.trend}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('disbursements')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'disbursements' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Pending Disbursements
          </button>
          <button
            onClick={() => setActiveTab('expenditures')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'expenditures' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Expenditure Verification
          </button>
          <button
            onClick={() => setActiveTab('utilisation')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'utilisation' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Fund Utilisation Reports
          </button>
        </div>

        {activeTab === 'disbursements' && (
          <div>
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Grant ID or NGO..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
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
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grant & Grantee</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tranche Details</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trigger Condition</th>
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
                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Agreement Acknowledged
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/finance/disbursements/GRT-CDG-2024-012" className="text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                        Mark Disbursed
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
                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 6-Month Report Approved
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/finance/disbursements/GRT-EIG-2023-088" className="text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                        Mark Disbursed
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
