import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Save, Upload, AlertCircle, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationWizard() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const totalSteps = 6;
  const steps = [
    "Organisation",
    "Project",
    "Team",
    "Budget",
    "Documents",
    "Review & Submit"
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit data here
    navigate('/applicant/applications');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Application Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 mb-2">
          <span>Community Development Grant (CDG)</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-500">New Application</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Application Wizard</h1>
        <p className="text-slate-500 mt-1">Application ID: APP-DRAFT-892 • Status: Draft</p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
          
          {steps.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            
            return (
              <div key={label} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  isActive ? 'border-emerald-600 bg-emerald-600 text-white' : 
                  isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 
                  'border-slate-200 bg-white text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-emerald-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          
          {/* STEP 1: Organisation */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Organisation Details</h2>
                <p className="text-sm text-slate-500">Pre-filled from your profile.</p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Legal Name</label>
                  <input type="text" disabled value="Green Future Foundation" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                  <input type="text" disabled value="TRUST/2020/445" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Type</label>
                  <input type="text" disabled value="Trust" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project District & State *</label>
                  <input type="text" required placeholder="e.g. Pune, Maharashtra" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person Name *</label>
                  <input type="text" required defaultValue="Anita Sharma" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Project */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Project Proposal</h2>
                <p className="text-sm text-slate-500">Describe what you plan to do.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
                  <input type="text" required placeholder="A clear, concise title" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Problem Statement *</label>
                  <textarea required rows={4} placeholder="What specific problem are you addressing?" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Solution *</label>
                  <textarea required rows={4} placeholder="How will your project solve this problem?" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Beneficiaries (Number) *</label>
                    <input type="number" required min="1" placeholder="e.g. 500" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Duration (Months) *</label>
                    <input type="number" required min="6" max="18" placeholder="6 - 18 months" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Team */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Implementation Team</h2>
                <p className="text-sm text-slate-500">Who will execute this project?</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Lead Name *</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lead Qualification *</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team Expertise Description *</label>
                  <textarea required rows={4} placeholder="Describe the relevant experience of your team..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Budget Details</h2>
                  <p className="text-sm text-slate-500">All amounts in INR.</p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold">
                  Total: ₹0
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Personnel Costs *</label>
                    <input type="number" required placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Equipment & Materials *</label>
                    <input type="number" required placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Travel & Logistics *</label>
                    <input type="number" required placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Overheads (Max 15%) *</label>
                    <input type="number" required placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget Justification *</label>
                  <textarea required rows={4} placeholder="Briefly justify the major costs..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Documents */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Required Documents</h2>
                <p className="text-sm text-slate-500">Upload or attach from vault.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Registration Certificate</p>
                      <p className="text-xs text-slate-500">Auto-attached from Vault</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Attached</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Audited Financial Statements</p>
                      <p className="text-xs text-slate-500">Auto-attached from Vault</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Attached</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-300 border-dashed rounded-xl bg-white">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Project Budget Breakdown *</p>
                      <p className="text-xs text-slate-500">Detailed line-item budget (PDF/Excel)</p>
                    </div>
                  </div>
                  <button type="button" className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Review & Submit</h2>
                <p className="text-sm text-slate-500">Please review your application and sign the declaration.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800">By submitting this application, it will undergo an automated AI eligibility screening before reaching a Program Officer.</p>
                </div>
                
                <div className="space-y-4 border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900">Declaration</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Authorised Signatory Name *</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <label className="flex items-start gap-3 mt-4 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <span className="text-sm text-slate-700">I confirm that the information provided is accurate and I am authorised to submit this application on behalf of the organisation.</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => alert('Draft saved successfully.')}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2 text-slate-500" /> Save Draft
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              {step === totalSteps ? 'Submit Application' : 'Next Step'}
              {step !== totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
