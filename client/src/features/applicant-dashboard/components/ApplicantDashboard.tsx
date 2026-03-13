import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Upload,
  Building,
  PlusCircle,
  User,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ApplicantDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome, Anita Sharma
        </h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <Building className="h-4 w-4" />
          Organisation: Green Future Foundation
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Apply for Grant
        </Link>
        <Link
          to="/dashboard/documents"
          className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2 text-slate-500" />
          Upload Documents
        </Link>
        <Link
          to="/dashboard/profile"
          className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <Building className="h-4 w-4 mr-2 text-slate-500" />
          Complete Organisation Profile
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Applications Submitted</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Under Review</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
            </div>
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Currently in review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved Grants
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Active grants</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Reports Due</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
            </div>
            <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-medium mt-4">
            Action required
          </p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Applications
          </h2>
          <Link
            to="/dashboard/applications"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Application ID</th>
                <th className="px-6 py-3 font-medium">Programme</th>
                <th className="px-6 py-3 font-medium">Project Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  APP-204
                </td>
                <td className="px-6 py-4 text-slate-600">
                  Community Development Grant
                </td>
                <td className="px-6 py-4 text-slate-900">
                  Village Water Infrastructure
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Under Review
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">2 days ago</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="text-slate-600 hover:text-slate-900 font-medium">
                      Messages
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  APP-101
                </td>
                <td className="px-6 py-4 text-slate-600">
                  Environment & Climate Action
                </td>
                <td className="px-6 py-4 text-slate-900">
                  Coastal Mangrove Restoration
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Approved
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">Jan 15, 2026</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                      View
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="text-slate-600 hover:text-slate-900 font-medium">
                      Messages
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Messages & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Messages
            </h2>
            <Link
              to="/dashboard/messages"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              All Messages
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Program Officer
                    </p>
                    <span className="text-xs text-slate-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Clarification requested on beneficiary count for APP-204.
                    Please provide the breakdown by age group.
                  </p>
                  <button className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
                    Reply to Message <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Action Required: Reports
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Village Water Project
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  6-Month Progress Report
                </p>
                <p className="text-xs font-medium text-rose-600 mt-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Due: Aug 15, 2026
                </p>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
