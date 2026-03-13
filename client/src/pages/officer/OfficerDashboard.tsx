import { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2, XCircle, ChevronRight, FileText, Activity, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState('screening');

  const stats = [
    { label: 'Pending Screening', value: '12', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Review Assignment', value: '8', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending Award Decision', value: '5', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Reports Overdue', value: '3', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Program Officer Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage applications, assignments, and compliance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('screening')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'screening' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Eligibility Screening Queue
          </button>
          <button
            onClick={() => setActiveTab('assignment')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'assignment' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Review Assignment
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'decisions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Award Decisions
          </button>
        </div>

        {/* Tab Content: Screening Queue */}
        {activeTab === 'screening' && (
          <div>
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
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Screening Result</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1: AI Flagged */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">APP-CDG-2024-089</p>
                      <p className="text-xs text-slate-500">Green Future Foundation</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">CDG</td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Soft Flag: Thematic Alignment
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">2 hours ago</td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/officer/applications/review" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                        Review <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                  {/* Row 2: AI Passed */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">APP-EIG-2024-102</p>
                      <p className="text-xs text-slate-500">EduTech Solutions</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">EIG</td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Passed All Checks
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">5 hours ago</td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/officer/applications/review" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                        Review <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                  {/* Row 3: AI Failed */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">APP-ECAG-2024-045</p>
                      <p className="text-xs text-slate-500">Coastal Care NGO</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">ECAG</td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium border border-rose-200">
                        <XCircle className="h-3.5 w-3.5" />
                        Failed: Budget Overhead &gt; 15%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">1 day ago</td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/officer/applications/review" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                        Review <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Review Assignment */}
        {activeTab === 'assignment' && (
          <div>
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
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Reviewers</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">APP-CDG-2024-075</p>
                      <p className="text-xs text-slate-500">Rural Development Trust</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">CDG</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Needs Assignment
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">0 / 3</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => alert('Assign reviewers functionality will be implemented.')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                        Assign <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Award Decisions */}
        {activeTab === 'decisions' && (
          <div>
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
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reviews</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">APP-EIG-2024-032</p>
                      <p className="text-xs text-slate-500">Tech for Good</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">EIG</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        8.5 / 10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">3 / 3 Completed</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => alert('Award decision functionality will be implemented.')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
                        Decide <ChevronRight className="h-4 w-4" />
                      </button>
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
