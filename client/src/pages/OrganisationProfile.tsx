import React, { useState } from 'react';
import { Save, Building, Mail, IndianRupee, AlertCircle, CheckCircle2, FileText, MapPin, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrganisationProfile() {
  const [completion, setCompletion] = useState(60);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    legalName: 'Green Future Foundation',
    regNumber: 'TRUST/2020/445',
    orgType: 'Trust',
    year: '2018',
    state: 'Gujarat',
    mission: 'To promote sustainable environmental practices and climate resilience in rural communities.',
    website: 'https://greenfuture.org',
    address: '123 Eco Park Road, Navrangpura',
    city: 'Ahmedabad',
    pincode: '380009',
    contactName: 'Anita Sharma',
    contactEmail: 'contact@greenfuture.org',
    contactPhone: '9876543210',
    budget: '2500000',
    panNumber: 'ABCDE1234F',
    fcraNumber: '',
    reg12A: '12A-2020-89',
    reg80G: '80G-2020-45'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setCompletion(100);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/applicant" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Organisation Profile</h1>
          <p className="text-slate-500 mt-1">Provide organisation information used across all grant applications.</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-sm font-medium text-slate-700">Profile Completion</p>
            {completion < 100 ? (
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Complete your organisation profile before submitting applications.
              </p>
            ) : (
              <p className="text-xs text-emerald-600 mt-1 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Your profile is complete and ready for applications.
              </p>
            )}
          </div>
          <span className="text-2xl font-bold text-emerald-600">{completion}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completion}%` }}></div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800">Profile saved successfully! Your information has been updated.</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Organisation Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Building className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Organisation Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Legal Name *</label>
              <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement *</label>
              <textarea name="mission" value={formData.mission} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number *</label>
              <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Type *</label>
              <select name="orgType" value={formData.orgType} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                <option value="NGO">NGO</option>
                <option value="Trust">Trust</option>
                <option value="Section 8 Company">Section 8 Company</option>
                <option value="EdTech Nonprofit">EdTech Nonprofit</option>
                <option value="Research Institution">Research Institution</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year of Establishment *</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-slate-400" />
                </div>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Address & Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Address & Contact</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2 border-t border-slate-100 pt-6 mt-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" /> Primary Contact Person
              </h3>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person Name *</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email *</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone *</label>
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Section 3: Compliance & Financial */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Compliance & Financial</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number *</label>
              <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">FCRA Registration Number</label>
              <input type="text" name="fcraNumber" value={formData.fcraNumber} onChange={handleChange} placeholder="If applicable" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">12A Registration Number *</label>
              <input type="text" name="reg12A" value={formData.reg12A} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">80G Registration Number *</label>
              <input type="text" name="reg80G" value={formData.reg80G} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2 border-t border-slate-100 pt-6 mt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Operating Budget (INR) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-4 w-4 text-slate-500" />
                </div>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              <p className="text-xs text-slate-500 mt-2">This field is used to help reviewers understand organisation capacity.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/applicant" className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70">
            {isSaving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
