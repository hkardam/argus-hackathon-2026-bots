import { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Download, BrainCircuit, Star, Save, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ReviewSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('application');
  
  // Mock scoring state
  const [scores, setScores] = useState({
    communityNeed: 0,
    projectDesign: 0,
    budgetRealism: 0,
    sustainability: 0
  });
  const [comments, setComments] = useState('');

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const totalScore = Object.values(scores).reduce((a: number, b: number) => a + b, 0);
  const maxScore = Object.keys(scores).length * 10;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/reviewer/reviews" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Assigned Reviews
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{id || 'APP-CDG-2024-089'}</h1>
            <p className="text-slate-500 mt-1">Green Future Foundation • Community Development Grant</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              Review Pending
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Application Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights Panel */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-300 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <BrainCircuit className="h-32 w-32 text-purple-400" />
            </div>
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Review Package</h2>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div>
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-sm leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  Installing solar-powered water pumps in 5 drought-prone villages. Targets 2,500 beneficiaries. Budget: INR 18,00,000.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Risk Flags
                </h3>
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                  <p className="text-xs text-amber-200 font-medium">Medium Risk: Budget Anomaly</p>
                  <p className="text-xs text-amber-400/80 mt-1">Equipment costs constitute 75% of total budget.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('application')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'application' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Application Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'documents' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Documents
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'application' && (
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
                        <p className="mt-1 text-slate-900">2,500 individuals</p>
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
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Project Budget Breakdown.pdf</p>
                        <p className="text-xs text-slate-500">2.4 MB</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scoring Rubric */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Scoring Rubric</h2>
              <p className="text-sm text-slate-500 mt-1">Rate each category from 1 to 10.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Scoring Categories */}
              {[
                { id: 'communityNeed', label: 'Community Need', aiScore: 8 },
                { id: 'projectDesign', label: 'Project Design', aiScore: 7 },
                { id: 'budgetRealism', label: 'Budget Realism', aiScore: 4 },
                { id: 'sustainability', label: 'Sustainability', aiScore: 6 }
              ].map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">{category.label}</label>
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-md">
                      AI Suggests: {category.aiScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={scores[category.id as keyof typeof scores]}
                      onChange={(e) => handleScoreChange(category.id as keyof typeof scores, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <span className="text-sm font-bold text-slate-900 w-6 text-right">
                      {scores[category.id as keyof typeof scores]}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-900">Total Score</span>
                  <span className="text-xl font-bold text-purple-600">{totalScore} <span className="text-sm text-slate-500 font-normal">/ {maxScore}</span></span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Reviewer Comments</label>
                  <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide justification for your scores and any overall feedback..."
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[120px] resize-y"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col gap-3">
              <button 
                onClick={() => alert('Draft saved successfully.')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Draft
              </button>
              <button 
                onClick={() => {
                  alert('Review submitted successfully.');
                  navigate('/reviewer/reviews');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" /> Submit Final Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
