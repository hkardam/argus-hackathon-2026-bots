import { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, UserPlus, Mail, Edit, Trash2, X } from 'lucide-react';

export default function AdminUsers() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage platform access, roles, and user accounts.</p>
        </div>
        <button 
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option value="all">All Roles</option>
              <option value="applicant">Applicant</option>
              <option value="officer">Program Officer</option>
              <option value="reviewer">Reviewer</option>
              <option value="finance">Finance Officer</option>
              <option value="admin">Platform Admin</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      SJ
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Sarah Jenkins</p>
                      <p className="text-xs text-slate-500">sarah.j@grantflow.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Program Officer
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">2 mins ago</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Send Password Reset">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Deactivate User">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      GF
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Green Future Foundation</p>
                      <p className="text-xs text-slate-500">contact@greenfuture.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Applicant
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">1 day ago</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Send Password Reset">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Deactivate User">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      DR
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Dr. Robert Chen</p>
                      <p className="text-xs text-slate-500">r.chen@university.edu</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Reviewer
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-300"></span> Inactive
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">2 months ago</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Send Password Reset">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Activate User">
                      <Shield className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
          <p>Showing 1 to 3 of 1,248 users</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add New User</h2>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none">
                  <option value="">Select a role...</option>
                  <option value="applicant">Applicant</option>
                  <option value="officer">Program Officer</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="finance">Finance Officer</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
