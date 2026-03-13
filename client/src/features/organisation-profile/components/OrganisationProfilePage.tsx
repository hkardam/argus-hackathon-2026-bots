import { useEffect, useState } from 'react';
import { CheckCircle, Edit2, Save, X } from 'lucide-react';
import {
  EMPTY_PROFILE,
  INDIAN_STATES,
  ORGANISATION_TYPE_LABELS,
  type OrganisationProfile,
  type OrganisationType,
} from '../types';
import {
  createOrgProfile,
  fetchOrgProfile,
  updateOrgProfile,
} from '../api/organisationApi';

type FieldErrors = Partial<Record<keyof OrganisationProfile, string>>;

function validate(data: OrganisationProfile): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name?.trim()) errors.name = 'Organisation name is required.';
  if (!data.registrationNumber?.trim())
    errors.registrationNumber = 'Registration number is required.';
  if (!data.organisationType) errors.organisationType = 'Organisation type is required.';
  if (data.yearEstablished === '' || data.yearEstablished === null)
    errors.yearEstablished = 'Year of establishment is required.';
  else if (Number(data.yearEstablished) > new Date().getFullYear())
    errors.yearEstablished = 'Year of establishment cannot be in the future.';
  if (!data.state?.trim()) errors.state = 'State of registration is required.';
  if (!data.contactPerson?.trim()) errors.contactPerson = 'Contact person name is required.';
  if (!data.contactEmail?.trim()) errors.contactEmail = 'Contact email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))
    errors.contactEmail = 'Must be a valid email address.';
  if (data.contactPhone && !/^\+?[0-9]{7,15}$/.test(data.contactPhone.trim()))
    errors.contactPhone = 'Must be a valid phone number.';
  if (data.annualBudget === '' || data.annualBudget === null)
    errors.annualBudget = 'Annual operating budget is required.';
  else if (Number(data.annualBudget) <= 0)
    errors.annualBudget = 'Annual budget must be a positive number.';
  return errors;
}

function normalize(data: any): OrganisationProfile {
  return {
    ...data,
    name: data.name ?? '',
    registrationNumber: data.registrationNumber ?? '',
    organisationType: data.organisationType ?? '',
    yearEstablished: data.yearEstablished ?? '',
    state: data.state ?? '',
    contactPerson: data.contactPerson ?? '',
    contactEmail: data.contactEmail ?? '',
    contactPhone: data.contactPhone ?? '',
    annualBudget: data.annualBudget ?? '',
  };
}

export default function OrganisationProfilePage() {
  const [profile, setProfile] = useState<OrganisationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OrganisationProfile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchOrgProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          setFormData(normalize(data));
          // If completion is less than 100, stay in edit mode
          if ((data.completionPercentage ?? 0) < 100) {
            setIsEditing(true);
          }
        } else {
          setIsEditing(true);
        }
      })
      .catch(() => setIsEditing(true))
      .finally(() => setLoading(false));
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrganisationProfile]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSave(isDraft = false) {
    if (!isDraft) {
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    } else {
      if (!formData.name.trim()) {
        setErrors({ name: 'Organisation name is required.' });
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        registrationNumber: formData.registrationNumber || null,
        organisationType: (formData.organisationType as OrganisationType) || null,
        yearEstablished: formData.yearEstablished !== '' ? Number(formData.yearEstablished) : null,
        state: formData.state || null,
        contactPerson: formData.contactPerson || null,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        annualBudget: formData.annualBudget !== '' ? Number(formData.annualBudget) : null,
      } as any;

      let saved: OrganisationProfile;
      if (profile?.id) {
        saved = await updateOrgProfile(profile.id, payload);
      } else {
        saved = await createOrgProfile(payload);
      }

      setProfile(saved);
      setFormData(normalize(saved));
      // Stay in edit mode if not 100% complete
      if ((saved.completionPercentage ?? 0) < 100) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
      setErrors({});
      showToast(isDraft ? 'Draft saved successfully.' : 'Organisation profile updated successfully.');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr?.response?.status === 409) {
        setErrors({ registrationNumber: 'This registration number already exists.' });
      } else {
        showToast('Failed to save profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit() {
    setFormData(profile!);
    setErrors({});
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData(normalize(profile!));
    setErrors({});
    setIsEditing(false);
  }

  const completion = profile?.completionPercentage ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Organisation Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Provide organisation information used across all grant applications.
        </p>
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Profile Completion</span>
          <span
            className={`text-sm font-bold ${completion === 100 ? 'text-emerald-600' : 'text-amber-600'}`}
          >
            {completion}%
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completion === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 100 && (
          <p className="text-xs text-amber-600 mt-2">
            Complete your organisation profile before submitting applications.
          </p>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {/* Section 1 — Organisation Details */}
        <div className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Organisation Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Organisation Legal Name" required error={errors.name}>
              <Input
                name="name"
                value={formData.name}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="e.g. Green Future Foundation"
              />
            </Field>
            <Field label="Registration Number" required error={errors.registrationNumber}>
              <Input
                name="registrationNumber"
                value={formData.registrationNumber}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="e.g. U85300MH2010NPL123456"
              />
            </Field>
            <Field label="Organisation Type" required error={errors.organisationType}>
              <select
                name="organisationType"
                value={formData.organisationType}
                disabled={!isEditing}
                onChange={handleChange}
                className={selectClass(!!errors.organisationType, !isEditing)}
              >
                <option value="">Select type</option>
                {(Object.keys(ORGANISATION_TYPE_LABELS) as OrganisationType[]).map((key) => (
                  <option key={key} value={key}>
                    {ORGANISATION_TYPE_LABELS[key]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Year of Establishment" required error={errors.yearEstablished}>
              <Input
                name="yearEstablished"
                type="number"
                value={formData.yearEstablished}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder={`e.g. ${new Date().getFullYear() - 5}`}
                min={1800}
                max={new Date().getFullYear()}
              />
            </Field>
            <Field
              label="State of Registration"
              required
              error={errors.state}
              className="sm:col-span-2"
            >
              <select
                name="state"
                value={formData.state}
                disabled={!isEditing}
                onChange={handleChange}
                className={selectClass(!!errors.state, !isEditing)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Section 2 — Contact Information */}
        <div className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Contact Person Name"
              required
              error={errors.contactPerson}
              className="sm:col-span-2"
            >
              <Input
                name="contactPerson"
                value={formData.contactPerson}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="e.g. Anita Sharma"
              />
            </Field>
            <Field label="Contact Email" required error={errors.contactEmail}>
              <Input
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="e.g. contact@org.in"
              />
            </Field>
            <Field label="Contact Phone" error={errors.contactPhone}>
              <Input
                name="contactPhone"
                value={formData.contactPhone}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="e.g. +919876543210"
              />
            </Field>
          </div>
        </div>

        {/* Section 3 — Financial Information */}
        <div className="p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Annual Operating Budget (INR)"
              required
              error={errors.annualBudget}
              className="sm:col-span-2"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  ₹
                </span>
                <input
                  name="annualBudget"
                  type="number"
                  value={formData.annualBudget}
                  disabled={!isEditing}
                  onChange={handleChange}
                  placeholder="e.g. 1000000"
                  min={1}
                  className={`${inputClass(!!errors.annualBudget, !isEditing)} pl-7`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex items-center justify-end gap-3">
          {isEditing || completion < 100 ? (
            <>
              {profile && completion === 100 && (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
              <button
                onClick={() => handleSave(true)}
                disabled={saving || !formData.name?.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save as Draft'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving || Object.keys(validate(formData)).length > 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function Field({
  label,
  required,
  error,
  children,
  className = '',
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean, disabled: boolean) {
  return [
    'w-full px-3 py-2 rounded-xl border text-sm transition-colors outline-none',
    hasError
      ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
    disabled ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white',
  ].join(' ');
}

function selectClass(hasError: boolean, disabled: boolean) {
  return [
    inputClass(hasError, disabled),
    'appearance-none cursor-pointer',
    disabled ? 'cursor-default' : '',
  ].join(' ');
}

function Input({
  name,
  value,
  disabled,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
}: {
  name: string;
  value: string | number;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={inputClass(false, disabled)}
    />
  );
}
