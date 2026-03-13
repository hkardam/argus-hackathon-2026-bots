import { ClipboardCheck, Clock, CheckCircle } from 'lucide-react';

export default function ReviewerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Reviewer Dashboard</h1>
      <p className="text-slate-500 mb-8">Evaluate and score assigned grant applications.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Assigned to Review', value: '5', icon: ClipboardCheck, color: 'bg-violet-50 text-violet-700' },
          { label: 'In Progress', value: '2', icon: Clock, color: 'bg-amber-50 text-amber-700' },
          { label: 'Completed', value: '11', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700' },
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Applications to Review</h2>
        <p className="text-slate-400 text-sm">No applications assigned at this time.</p>
      </div>
    </div>
  );
}
