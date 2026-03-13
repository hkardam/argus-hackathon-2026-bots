export type OrganisationType =
  | 'NGO'
  | 'TRUST'
  | 'SECTION_8_COMPANY'
  | 'EDTECH_NONPROFIT'
  | 'RESEARCH_INSTITUTION'
  | 'UNIVERSITY'
  | 'FARMER_PRODUCER_ORGANISATION'
  | 'PANCHAYAT';

export const ORGANISATION_TYPE_LABELS: Record<OrganisationType, string> = {
  NGO: 'NGO',
  TRUST: 'Trust',
  SECTION_8_COMPANY: 'Section 8 Company',
  EDTECH_NONPROFIT: 'EdTech Nonprofit',
  RESEARCH_INSTITUTION: 'Research Institution',
  UNIVERSITY: 'University',
  FARMER_PRODUCER_ORGANISATION: 'Farmer Producer Organisation',
  PANCHAYAT: 'Panchayat',
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export interface OrganisationProfile {
  id?: string;
  name: string;
  registrationNumber: string;
  organisationType: OrganisationType | '';
  yearEstablished: number | '';
  state: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  annualBudget: number | '';
  completionPercentage?: number;
}

export const EMPTY_PROFILE: OrganisationProfile = {
  name: '',
  registrationNumber: '',
  organisationType: '',
  yearEstablished: '',
  state: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  annualBudget: '',
};
