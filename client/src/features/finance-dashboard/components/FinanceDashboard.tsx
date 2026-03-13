import { DollarSign, FileCheck, AlertCircle, TrendingUp } from 'lucide-react';

export default function FinanceDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Finance Officer Dashboard</h1>
      <p className="text-slate-500 mb-8">Oversee disbursements, expenditures, and financial reporting.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Pending Disbursement', value: '₹12.4L', icon: DollarSign, color: 'bg-amber-50 text-amber-700' },
          { label: 'Reports Submitted', value: '27', icon: FileCheck, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Compliance Issues', value: '3', icon: AlertCircle, color: 'bg-red-50 text-red-700' },
          { label: 'Total Disbursed', value: '₹2.1Cr', icon: TrendingUp, color: 'bg-blue-50 text-blue-700' },
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Disbursements</h2>
        <p className="text-slate-400 text-sm">No pending disbursements at this time.</p>
      </div>
    </div>
  );
}
