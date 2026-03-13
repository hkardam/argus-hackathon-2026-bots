import { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Download, MessageSquare, XCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function FinanceExpenditureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/finance/expenditures" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Expenditures
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Verify Expenditure: {id || 'GRT-CDG-2023-045'}</h1>
            <p className="text-slate-500 mt-1">Rural Development Trust • Q2 2024 Report</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              Pending Verification
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'summary' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Financial Summary
              </button>
              <button
                onClick={() => setActiveTab('lineitems')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'lineitems' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Line Item Breakdown
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'documents' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Receipts & Proofs
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <p className="text-sm font-medium text-slate-500">Approved Budget (Q2)</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">₹ 5,00,000</p>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                      <p className="text-sm font-medium text-amber-700">Reported Expenditure</p>
                      <p className="mt-2 text-2xl font-bold text-amber-900">₹ 4,50,000</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                      <p className="text-sm font-medium text-emerald-700">Variance (Under Budget)</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-900">₹ 50,000</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Officer Assessment</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Programmatic progress aligns with reported expenditure.</p>
                        <p className="text-sm text-slate-600 mt-1">The NGO has successfully completed the planned activities for Q2. The underspend is due to cost savings in material procurement. I recommend approving this financial report.</p>
                        <p className="text-xs text-slate-400 mt-2">— Sarah Jenkins, Program Officer</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lineitems' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Budgeted</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actual</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Personnel Costs</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">₹ 2,00,000</td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium text-right">₹ 2,00,000</td>
                        <td className="px-4 py-3 text-sm text-slate-500 text-right">₹ 0</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Equipment & Materials</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">₹ 2,50,000</td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium text-right">₹ 2,10,000</td>
                        <td className="px-4 py-3 text-sm text-emerald-600 text-right">-₹ 40,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-slate-900">Travel & Logistics</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">₹ 50,000</td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium text-right">₹ 40,000</td>
                        <td className="px-4 py-3 text-sm text-emerald-600 text-right">-₹ 10,000</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="px-4 py-3 text-sm text-slate-900">Total</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">₹ 5,00,000</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">₹ 4,50,000</td>
                        <td className="px-4 py-3 text-sm text-emerald-600 text-right">-₹ 50,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Q2_Financial_Report_Signed.pdf</p>
                        <p className="text-xs text-slate-500">1.2 MB • Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Equipment_Invoices_Batch1.zip</p>
                        <p className="text-xs text-slate-500">8.5 MB • Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Verification Decision</h2>
              <p className="text-sm text-slate-500 mt-1">Approve the expenditure or flag it for clarification.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Verification Notes (Internal)</label>
                <textarea 
                  placeholder="Add notes regarding your review of these expenditures..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none min-h-[100px] resize-y"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col gap-3">
              <button 
                onClick={() => {
                  alert('Expenditure verified successfully. This will update the grant utilisation metrics.');
                  navigate('/finance/expenditures');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" /> Verify & Approve
              </button>
              <button 
                onClick={() => {
                  const reason = prompt('Please provide a reason for flagging this expenditure:');
                  if(reason) {
                    alert('Expenditure flagged. The Program Officer and Grantee will be notified.');
                    navigate('/finance/expenditures');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors shadow-sm"
              >
                <AlertTriangle className="h-4 w-4" /> Flag for Clarification
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm mt-2"
              >
                <MessageSquare className="h-4 w-4" /> Message Program Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
