import { Award, FileText, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyGrants() {
  const grants = [
    { 
      id: 'GRANT-101', 
      programme: 'Environment & Climate Action', 
      project: 'Coastal Mangrove Restoration', 
      status: 'Active', 
      startDate: 'Feb 1, 2026', 
      endDate: 'Jan 31, 2027',
      amount: '₹15,00,000'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Grants</h1>
        <p className="text-slate-500 mt-1">Manage your approved and active grants.</p>
      </div>

      {grants.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Active Grants</h3>
          <p className="text-slate-500 max-w-sm mx-auto">You don't have any approved grants yet. Submit an application to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {grants.map((grant) => (
            <div key={grant.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-slate-900">{grant.id}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {grant.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">{grant.project}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Total Award</p>
                  <p className="text-lg font-bold text-emerald-600">{grant.amount}</p>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Programme</p>
                  <p className="font-medium text-slate-900">{grant.programme}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Duration</p>
                  <p className="font-medium text-slate-900">{grant.startDate} — {grant.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Next Milestone</p>
                  <p className="font-medium text-rose-600">Mid-Point Report (Due Aug 1, 2026)</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-3">
                <Link to="/applicant/applications" className="inline-flex items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  <FileText className="h-4 w-4 mr-2 text-slate-500" />
                  View Grant Details
                </Link>
                <button className="inline-flex items-center px-4 py-2 border border-emerald-600 shadow-sm text-sm font-medium rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Report
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  <IndianRupee className="h-4 w-4 mr-2 text-slate-500" />
                  View Disbursements
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
