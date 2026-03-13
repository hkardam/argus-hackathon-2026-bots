import { Search, Filter, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const applications = [
    { id: 'APP-204', programme: 'Community Development Grant', project: 'Village Water Infrastructure', status: 'Under Review', date: 'May 14, 2026', statusColor: 'bg-amber-100 text-amber-800' },
    { id: 'APP-101', programme: 'Environment & Climate Action', project: 'Coastal Mangrove Restoration', status: 'Approved', date: 'Jan 15, 2026', statusColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'APP-089', programme: 'Education Innovation Grant', project: 'Digital Literacy for Girls', status: 'Rejected', date: 'Nov 02, 2025', statusColor: 'bg-rose-100 text-rose-800' },
    { id: 'APP-255', programme: 'Community Development Grant', project: 'Rural Health Clinic Upgrade', status: 'Draft', date: 'May 18, 2026', statusColor: 'bg-slate-100 text-slate-800' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 mt-1">Track and manage all your grant applications.</p>
        </div>
        <Link to="/applicant/applications/new" className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Apply for a Grant
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-700">
            <option>All Programmes</option>
            <option>Community Development</option>
            <option>Education Innovation</option>
            <option>Environment & Climate</option>
          </select>
          <select className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-700">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Under Review</option>
            <option>Approved</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Application ID</th>
                <th className="px-6 py-4 font-medium">Programme</th>
                <th className="px-6 py-4 font-medium">Project Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{app.id}</td>
                  <td className="px-6 py-4 text-slate-600">{app.programme}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{app.project}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        {app.status === 'Draft' ? 'Edit Draft' : 'View'}
                      </button>
                      {app.status !== 'Draft' && (
                        <>
                          <span className="text-slate-300">|</span>
                          <Link to="/applicant/messages" className="text-slate-600 hover:text-slate-900 font-medium">Messages</Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
