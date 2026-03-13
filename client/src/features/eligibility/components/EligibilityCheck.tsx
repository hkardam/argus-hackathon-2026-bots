import { useState, useEffect } from 'react';
import { CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import type { GrantProgramme } from '../../grants/types';

interface EligibilityCheckProps {
  selectedGrant: GrantProgramme | null;
}

export default function EligibilityCheck({ selectedGrant }: EligibilityCheckProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const getGrantCode = (name: string) => {
    if (name.includes('CDG')) return 'CDG';
    if (name.includes('EIG')) return 'EIG';
    if (name.includes('ECAG')) return 'ECAG';
    return 'DEFAULT';
  };

  const grantCode = selectedGrant ? getGrantCode(selectedGrant.name) : 'DEFAULT';

  useEffect(() => {
    setFormData({});
    setShowResults(false);
  }, [selectedGrant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    // Create response object
    const response = {
      grantId: selectedGrant?.id,
      grantName: selectedGrant?.name,
      grantCode,
      submissionTime: new Date().toISOString(),
      eligibilityData: formData
    };

    console.log('Eligibility Check Response:', response);

    // Simulate API call for UI feedback
    setTimeout(() => {
      setIsChecking(false);
      setShowResults(true);
    }, 1500);
  };

  const renderCommonFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Funding Amount Requested (INR)</label>
        <input
          type="number"
          name="requestedAmount"
          onChange={handleInputChange}
          className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Project Duration (Months)</label>
        <input
          type="number"
          name="durationMonths"
          onChange={handleInputChange}
          className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Budget Overhead (%)</label>
        <input
          type="number"
          name="overheadPercentage"
          onChange={handleInputChange}
          className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm"
          required
        />
      </div>
    </>
  );

  const renderCDGFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Organisation Type</label>
        <select name="orgType" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required>
          <option value="">Select...</option>
          <option value="NGO">NGO</option>
          <option value="Trust">Trust</option>
          <option value="Section8">Section 8 Company</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Year of Establishment</label>
        <input type="number" name="establishmentYear" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Project District</label>
        <input type="text" name="district" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Project Description (Thematic Alignment)</label>
        <textarea name="description" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" rows={3} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Planned Beneficiary Count</label>
        <input type="number" name="beneficiaryCount" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
    </>
  );

  const renderEIGFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Organisation Type</label>
        <select name="orgType" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required>
          <option value="">Select...</option>
          <option value="NGO">NGO</option>
          <option value="EdTech">EdTech Non-profit</option>
          <option value="Research">Research Institution</option>
          <option value="University">University</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Established Years Ago</label>
        <input type="number" name="establishedYears" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Number of Schools Targeted</label>
        <input type="number" name="schoolsTargeted" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Grade Coverage</label>
        <input type="text" name="gradeCoverage" placeholder="e.g. Grades 5-8" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Education Innovation Alignment Plan</label>
        <textarea name="innovationPlan" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" rows={3} required />
      </div>
    </>
  );

  const renderECAGFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Organisation Type</label>
        <select name="orgType" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required>
          <option value="">Select...</option>
          <option value="NGO">NGO</option>
          <option value="FPO">FPO</option>
          <option value="Panchayat">Panchayat</option>
          <option value="Research">Research Institution</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Project Location</label>
        <input type="text" name="location" placeholder="District name" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" required />
      </div>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Environmental Theme Alignment</label>
        <textarea name="envAlignment" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" rows={3} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-body mb-2">Community Involvement Plan</label>
        <textarea name="communityPlan" onChange={handleInputChange} className="block w-full px-3 py-3 border border-dark-border bg-dark-elevated text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-ring sm:text-sm" rows={3} required />
      </div>
    </>
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-dark rounded-3xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form Section */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-2">Check Your Eligibility</h2>
            <p className="text-dark-muted mb-8">
              {selectedGrant
                ? `Testing eligibility for: ${selectedGrant.name}`
                : 'Select a grant programme to check your eligibility.'}
            </p>

            {selectedGrant && (
              <form onSubmit={handleCheck} className="space-y-6">
                {grantCode === 'CDG' && renderCDGFields()}
                {grantCode === 'EIG' && renderEIGFields()}
                {grantCode === 'ECAG' && renderECAGFields()}
                {grantCode === 'DEFAULT' && renderCommonFields()}

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-dark bg-primary-muted hover:bg-primary-ring focus:outline-none focus:ring-2 focus:ring-primary-ring transition-colors disabled:opacity-70"
                >
                  {isChecking ? 'Analyzing...' : 'Check Eligibility'}
                </button>
              </form>
            )}

            {!selectedGrant && (
              <div className="p-12 text-center border-2 border-dashed border-dark-border rounded-2xl">
                <p className="text-dark-muted">Please select a grant above to proceed.</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-dark-elevated p-8 md:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-dark-border">
            {!showResults && !isChecking && (
              <div className="text-center text-dark-muted flex flex-col items-center">
                <HelpCircle className="h-16 w-16 mb-4 opacity-20" />
                <p>Fill out the form to see your eligibility result.</p>
              </div>
            )}

            {isChecking && (
              <div className="text-center text-dark-muted flex flex-col items-center animate-pulse">
                <div className="h-16 w-16 mb-4 rounded-full border-4 border-primary-ring/30 border-t-primary-ring animate-spin" />
                <p>Evaluating your profile against {selectedGrant?.name}...</p>
              </div>
            )}

            {showResults && !isChecking && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-semibold text-white mb-4">Results for {selectedGrant?.name}</h3>
                <div className="bg-dark/50 rounded-xl p-6 border border-primary-ring/40">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-8 w-8 text-primary-muted shrink-0" />
                    <div>
                      <h4 className="text-lg font-medium text-white">Application Pre-check Passed</h4>
                      <p className="text-sm text-primary-muted mt-2">
                        Based on your inputs, you meet the initial criteria for this grant.
                        A detailed response has been logged to the console.
                      </p>
                      <button className="mt-6 inline-flex items-center px-4 py-2 bg-primary-muted text-dark rounded-lg text-sm font-semibold hover:bg-primary-ring transition-colors">
                        Start Full Application <ArrowRight className="ml-2 h-4 w-4" />
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
