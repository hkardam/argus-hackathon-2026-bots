import { Users, Shield, Activity, Database } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Platform Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">Full system access — users, roles, and platform health.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: '128', icon: Users, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active Sessions', value: '14', icon: Activity, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Roles Configured', value: '5', icon: Shield, color: 'bg-violet-50 text-violet-700' },
          { label: 'DB Records', value: '4.2K', icon: Database, color: 'bg-slate-100 text-slate-700' },
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System Overview</h2>
        <p className="text-slate-400 text-sm">All systems operational.</p>
      </div>
    </div>
  );
}
