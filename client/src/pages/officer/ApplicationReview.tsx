import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, FileText, Download, MessageSquare, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ApplicationReview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/officer/applications" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applications
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">APP-CDG-2024-089</h1>
            <p className="text-slate-500 mt-1">Green Future Foundation • Community Development Grant</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              Needs Screening
            </span>
          </div>
        </div>
      </div>

      {/* AI Screening Summary */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-xl shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">AI Screening Flag: Thematic Alignment</h3>
            <p className="text-amber-800 mt-1">
              The AI screening process flagged this application because the proposed project (Village Water Infrastructure) 
              has a low confidence score (65%) for alignment with the core themes of the Community Development Grant. 
              Manual review is required to determine eligibility.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Application Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('org')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'org' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Organisation Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Project Title</p>
                    <p className="mt-1 text-slate-900">Village Water Infrastructure</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="mt-1 text-slate-900">Pune, Maharashtra</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Duration</p>
                    <p className="mt-1 text-slate-900">12 Months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Target Beneficiaries</p>
                    <p className="mt-1 text-slate-900">1,500 individuals</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Proposal Details</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Problem Statement</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
                      The target villages currently lack access to clean and reliable drinking water. Women and children spend an average of 3 hours daily fetching water from distant, often contaminated sources. This leads to high incidences of waterborne diseases and impacts school attendance.
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Proposed Solution</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
                      We propose to install 5 solar-powered water purification and distribution systems across the 3 villages. This will provide a sustainable, clean water source within 500 meters of all households. We will also establish community water committees to ensure long-term maintenance.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Summary</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700">Personnel Costs</td>
                        <td className="px-4 py-3 text-right text-slate-900">₹ 4,50,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700">Equipment & Materials</td>
                        <td className="px-4 py-3 text-right text-slate-900">₹ 12,00,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700">Travel & Logistics</td>
                        <td className="px-4 py-3 text-right text-slate-900">₹ 1,50,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700">Overheads</td>
                        <td className="px-4 py-3 text-right text-slate-900">₹ 2,00,000</td>
                      </tr>
                      <tr className="bg-slate-100 font-semibold">
                        <td className="px-4 py-3 text-slate-900">Total Budget</td>
                        <td className="px-4 py-3 text-right text-slate-900">₹ 20,00,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Project Budget Breakdown.pdf</p>
                    <p className="text-xs text-slate-500">2.4 MB • Uploaded 2 days ago</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Registration Certificate.pdf</p>
                    <p className="text-xs text-slate-500">1.1 MB • From Vault</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'org' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500">Organisation Name</p>
                  <p className="mt-1 text-slate-900">Green Future Foundation</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Registration Number</p>
                  <p className="mt-1 text-slate-900">TRUST/2020/445</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Type</p>
                  <p className="mt-1 text-slate-900">Trust</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Established</p>
                  <p className="mt-1 text-slate-900">2018</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-slate-500">Mission</p>
                  <p className="mt-1 text-slate-900">To promote sustainable environmental practices and climate resilience in rural communities.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/officer/messages" className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
            <MessageSquare className="h-4 w-4 mr-2 text-slate-500" />
            Message Applicant
          </Link>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => {
              alert('Application marked as ineligible.');
              navigate('/officer/applications');
            }}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-rose-200 shadow-sm text-sm font-medium rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors w-full sm:w-auto"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Mark Ineligible
          </button>
          <button 
            onClick={() => {
              alert('Application approved for review assignment.');
              navigate('/officer/applications');
            }}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve for Review
          </button>
        </div>
      </div>
    </div>
  );
}
