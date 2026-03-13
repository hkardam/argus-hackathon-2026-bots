import { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Download, Building, DollarSign, Upload } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function FinanceDisbursementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/finance/disbursements" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disbursements
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Process Disbursement: {id || 'GRT-CDG-2024-012'}</h1>
            <p className="text-slate-500 mt-1">Green Future Foundation • Inception Tranche</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              Pending Transfer
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
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'details' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Disbursement Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'documents' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Supporting Documents
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Amount to Disburse</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">₹ 9,00,000</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Tranche</p>
                        <p className="mt-1 text-slate-900 font-medium">Inception Tranche (50%)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Trigger Condition</p>
                        <p className="mt-1 text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Grant Agreement Signed
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Program Officer Approval</p>
                        <p className="mt-1 text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Approved by Sarah Jenkins
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Bank Details (Verified)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Account Name</p>
                        <p className="mt-1 text-slate-900 font-medium">Green Future Foundation</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Bank Name</p>
                        <p className="mt-1 text-slate-900">State Bank of India</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Account Number</p>
                        <p className="mt-1 text-slate-900 font-mono">XXXX-XXXX-4589</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">IFSC Code</p>
                        <p className="mt-1 text-slate-900 font-mono">SBIN0001234</p>
                      </div>
                    </div>
                  </div>
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
                        <p className="font-medium text-slate-900 text-sm">Signed_Grant_Agreement.pdf</p>
                        <p className="text-xs text-slate-500">Verified by Program Officer</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Bank_Mandate_Form.pdf</p>
                        <p className="text-xs text-slate-500">Verified during onboarding</p>
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
              <h2 className="text-lg font-bold text-slate-900">Process Transfer</h2>
              <p className="text-sm text-slate-500 mt-1">Record the transaction details once the transfer is complete.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Transaction Reference Number (UTR)</label>
                <input 
                  type="text" 
                  placeholder="e.g., SBIN1234567890"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date of Transfer</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Upload Transfer Receipt (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload receipt</p>
                  <p className="text-xs text-slate-500 mt-1">PDF or Image (Max 5MB)</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Internal Notes</label>
                <textarea 
                  placeholder="Any notes regarding this transfer..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none min-h-[80px] resize-y"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col gap-3">
              <button 
                onClick={() => {
                  alert('Disbursement marked as completed. The grantee will be notified.');
                  navigate('/finance/disbursements');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm Disbursement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
