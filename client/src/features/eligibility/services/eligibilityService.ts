import axiosInstance from '../../../api/axiosInstance';
import type { ApiResponse } from '../../grants/types';
import type { EligibilityAiRequest, EligibilityAiResponse } from '../types';

export const eligibilityService = {
  check: async (request: EligibilityAiRequest): Promise<EligibilityAiResponse> => {
    const response = await axiosInstance.post<ApiResponse<EligibilityAiResponse>>('/programmes/check-eligibility', request);
    return response.data.data;
  },
};
