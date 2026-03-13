import { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, ChevronRight, FileText, BrainCircuit, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReviewerDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Reviewer Workspace</h1>
        <p className="text-slate-500 mt-1">Evaluate assigned applications with AI-assisted insights.</p>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'pending' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Pending Reviews (3)
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'completed' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Completed Reviews (12)
          </button>
        </div>

        {activeTab === 'pending' && (
          <div>
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assigned applications..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                Sort by Deadline
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grant Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Insights Available</th>
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
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                          <BrainCircuit className="h-3 w-3" /> Summary
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                          <AlertTriangle className="h-3 w-3" /> 1 Risk Flag
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-rose-600 font-medium">Tomorrow</td>
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
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                          <BrainCircuit className="h-3 w-3" /> Summary
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" /> No Risks
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">In 3 days</td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/reviewer/reviews/APP-EIG-2024-112" className="text-sm font-medium text-purple-600 hover:text-purple-700 px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors inline-flex items-center gap-2">
                        Start Scoring
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* AI Review Package Preview (Mockup) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-300 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <BrainCircuit className="h-48 w-48 text-purple-400" />
        </div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
            <BrainCircuit className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI-Generated Review Package Preview</h2>
            <p className="text-sm text-slate-400">This is what you see when you click "Start Scoring".</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Application Summary</h3>
              <p className="text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <strong>Green Future Foundation</strong> is applying for <strong>INR 18,00,000</strong> over <strong>12 months</strong> to install solar-powered water pumps in 5 drought-prone villages in Maharashtra. The project targets <strong>2,500 beneficiaries</strong>. The organisation has 5 years of experience but this is their first major infrastructure project.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Risk Flags
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-sm text-amber-200 font-medium">Medium Risk: Budget Anomaly</p>
                <p className="text-sm text-amber-400/80 mt-1">Equipment costs (solar panels) constitute 75% of the total budget, leaving very little for community training and maintenance setup.</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">AI-Suggested Scores</h3>
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <span className="text-sm">Community Need</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Star className="h-4 w-4 fill-emerald-400" /> 5</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <span className="text-sm">Project Design</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Star className="h-4 w-4 fill-emerald-400" /> 4</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <span className="text-sm">Budget Realism</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="h-4 w-4 fill-amber-400" /> 2</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">Scores are advisory. Reviewer must confirm or override.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
