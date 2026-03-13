import { Search, Filter, Download, Activity, Shield, FileText, User, Settings } from 'lucide-react';

export default function AdminAuditLogs() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4 text-rose-500" />;
      case 'user': return <User className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileText className="h-4 w-4 text-amber-500" />;
      case 'system': return <Settings className="h-4 w-4 text-slate-500" />;
      default: return <Activity className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'security': return 'bg-rose-100';
      case 'user': return 'bg-blue-100';
      case 'document': return 'bg-amber-100';
      case 'system': return 'bg-slate-100';
      default: return 'bg-emerald-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Audit Log</h1>
          <p className="text-slate-500 mt-1">Track system events, user actions, and security alerts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, users, or IP addresses..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option value="all">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter Events
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User / Actor</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  Oct 24, 2023 14:32:01
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getBg('document')}`}>
                      {getIcon('document')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">Application Approved</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500">Program Officer</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">192.168.1.45</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  Approved application APP-2024-089 for Green Future Foundation.
                </td>
              </tr>
              
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  Oct 24, 2023 13:15:44
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getBg('security')}`}>
                      {getIcon('security')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">Failed Login Attempt</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">Unknown User</p>
                  <p className="text-xs text-slate-500">admin@grantflow.org</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-rose-500">203.0.113.42</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  Invalid password provided for admin account.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  Oct 24, 2023 11:05:12
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getBg('user')}`}>
                      {getIcon('user')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">User Role Updated</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">System Admin</p>
                  <p className="text-xs text-slate-500">Platform Admin</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">10.0.0.5</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  Changed role for Dr. Robert Chen from 'Applicant' to 'Reviewer'.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  Oct 24, 2023 09:30:00
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getBg('system')}`}>
                      {getIcon('system')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">System Backup Completed</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">System Process</p>
                  <p className="text-xs text-slate-500">Automated Task</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">localhost</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  Daily database snapshot created successfully (Size: 4.2GB).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
          <p>Showing 1 to 4 of 8,432 events</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
