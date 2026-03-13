import axios from 'axios';
import type { OrganisationProfile } from '../types';

const BASE_URL = 'http://localhost:8086/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function fetchOrgProfile(): Promise<OrganisationProfile | null> {
  const response = await axios.get<ApiResponse<OrganisationProfile[]>>(
    `${BASE_URL}/organisations/me`,
    { headers: getAuthHeaders() },
  );
  const list = response.data.data;
  if (!list || list.length === 0) return null;
  return list[0];
}

export async function createOrgProfile(
  data: Omit<OrganisationProfile, 'id' | 'completionPercentage'>,
): Promise<OrganisationProfile> {
  const response = await axios.post<ApiResponse<OrganisationProfile>>(
    `${BASE_URL}/organisations`,
    data,
    { headers: getAuthHeaders() },
  );
  return response.data.data;
}

export async function updateOrgProfile(
  id: string,
  data: Omit<OrganisationProfile, 'id' | 'completionPercentage'>,
): Promise<OrganisationProfile> {
  const response = await axios.put<ApiResponse<OrganisationProfile>>(
    `${BASE_URL}/organisations/${id}`,
    data,
    { headers: getAuthHeaders() },
  );
  return response.data.data;
}
