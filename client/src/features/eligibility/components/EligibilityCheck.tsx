import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

export default function EligibilityCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    // Simulate API call
    setTimeout(() => {
      setIsChecking(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-dark rounded-3xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Form Section */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-2">Check Your Eligibility</h2>
            <p className="text-dark-muted mb-8">Quickly test your eligibility for our grant programmes before starting an application.</p>

            <form onSubmit={handleCheck} className="space-y-6">
              <div>
                <label htmlFor="orgType" className="block text-sm font-medium text-dark-body mb-2">
                  Organisation Type
                </label>
                <select
                  id="orgType"
                  className="block w-full pl-3 pr-10 py-3 text-base border-dark-border bg-dark-elevated text-white focus:outline-none focus:ring-2 focus:ring-primary-ring focus:border-primary-ring sm:text-sm rounded-xl"
                  required
                >
                  <option value="">Select organisation type...</option>
                  <option value="ngo">NGO</option>
                  <option value="trust">Trust</option>
                  <option value="section8">Section 8 Company</option>
                  <option value="edtech">EdTech Nonprofit</option>
                  <option value="research">Research Institution</option>
                  <option value="university">University</option>
                  <option value="fpo">Farmer Producer Organisation</option>
                  <option value="panchayat">Panchayat</option>
                </select>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-dark-body mb-2">
                  Project District
                </label>
                <input
                  type="text"
                  id="district"
                  className="block w-full pl-3 pr-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring focus:border-primary-ring sm:text-sm placeholder-dark-subtle"
                  placeholder="e.g. Pune, Maharashtra"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-dark-body mb-2">
                  Funding Amount Requested (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-dark-subtle sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    className="block w-full pl-8 pr-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring focus:border-primary-ring sm:text-sm placeholder-dark-subtle"
                    placeholder="500000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChecking}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-dark bg-primary-muted hover:bg-primary-ring focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary-ring transition-colors disabled:opacity-70"
              >
                {isChecking ? 'Analyzing...' : 'Check Eligibility'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-dark-elevated p-8 md:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-dark-border">
            {!showResults && !isChecking && (
              <div className="text-center text-dark-muted flex flex-col items-center">
                <HelpCircle className="h-16 w-16 mb-4 opacity-20" />
                <p>Fill out the form to see which grants you might be eligible for.</p>
              </div>
            )}

            {isChecking && (
              <div className="text-center text-dark-muted flex flex-col items-center animate-pulse">
                <div className="h-16 w-16 mb-4 rounded-full border-4 border-primary-ring/30 border-t-primary-ring animate-spin" />
                <p>Evaluating your profile against our programmes...</p>
              </div>
            )}

            {showResults && !isChecking && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-semibold text-white mb-4">Your Eligibility Results</h3>

                <div className="bg-dark/50 rounded-xl p-4 border border-primary-ring/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary-muted shrink-0" />
                    <div>
                      <h4 className="text-base font-medium text-white">Community Development Grant</h4>
                      <p className="text-sm text-primary-muted mt-1 font-medium">Status: Likely Eligible</p>
                      <button className="mt-3 text-sm text-dark-body hover:text-white flex items-center transition-colors">
                        Start Application <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-dark/50 rounded-xl p-4 border border-danger-ring/20">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-6 w-6 text-danger shrink-0" />
                    <div>
                      <h4 className="text-base font-medium text-white">Education Innovation Grant</h4>
                      <p className="text-sm text-danger mt-1 font-medium">Status: Likely Not Eligible</p>
                      <p className="text-xs text-dark-muted mt-1">Reason: Requested funding exceeds programme limit</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark/50 rounded-xl p-4 border border-primary-ring/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary-muted shrink-0" />
                    <div>
                      <h4 className="text-base font-medium text-white">Environment & Climate Action Grant</h4>
                      <p className="text-sm text-primary-muted mt-1 font-medium">Status: Likely Eligible</p>
                      <button className="mt-3 text-sm text-dark-body hover:text-white flex items-center transition-colors">
                        Start Application <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
