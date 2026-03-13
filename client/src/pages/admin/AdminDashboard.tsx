import { Users, Shield, Activity, Settings, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Active Staff', value: '42', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'System Events (24h)', value: '8.4k', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Platform Administration</h1>
          <p className="text-slate-500 mt-1">Manage users, roles, and view system audit logs.</p>
        </div>
        <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
          <Settings className="h-4 w-4" /> System Settings
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Quick Actions & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">User Management</h2>
            </div>
            <Link to="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Pending Approvals</p>
                  <p className="text-xs text-slate-500 mt-0.5">New staff accounts awaiting activation</p>
                </div>
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">3</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Role Changes</p>
                  <p className="text-xs text-slate-500 mt-0.5">Recent role modifications (7 days)</p>
                </div>
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">12</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <Link to="/admin/users" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                Manage Users & Roles
              </Link>
            </div>
          </div>
        </div>

        {/* Audit Log Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            </div>
            <Link to="/admin/audit" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View Log <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className="p-1.5 rounded-md bg-amber-100 text-amber-600 shrink-0 mt-0.5">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Application Approved</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sarah Jenkins approved APP-2024-089</p>
                  <p className="text-xs text-slate-400 mt-1">10 mins ago</p>
                </div>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className="p-1.5 rounded-md bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Failed Login Attempt</p>
                  <p className="text-xs text-slate-500 mt-0.5">Multiple failed attempts for admin@grantflow.org</p>
                  <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">User Role Updated</p>
                  <p className="text-xs text-slate-500 mt-0.5">System Admin changed role for Dr. Robert Chen</p>
                  <p className="text-xs text-slate-400 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
