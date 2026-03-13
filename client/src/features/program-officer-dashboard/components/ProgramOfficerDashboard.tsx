import { ClipboardList, CheckCircle, XCircle, Users } from 'lucide-react';

export default function ProgramOfficerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Program Officer Dashboard</h1>
      <p className="text-slate-500 mb-8">Manage grant programs and review applications.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Pending Review', value: '12', icon: ClipboardList, color: 'bg-amber-50 text-amber-700' },
          { label: 'Approved', value: '34', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Rejected', value: '8', icon: XCircle, color: 'bg-red-50 text-red-700' },
          { label: 'Total Applicants', value: '54', icon: Users, color: 'bg-blue-50 text-blue-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Applications Awaiting Decision</h2>
        <p className="text-slate-400 text-sm">No applications pending at this time.</p>
      </div>
    </div>
  );
}
