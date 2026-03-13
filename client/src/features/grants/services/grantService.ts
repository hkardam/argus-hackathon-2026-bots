import axiosInstance from '../../../api/axiosInstance';
import type { ApiResponse, GrantProgramme } from '../types';

export const grantService = {
  getAll: async (): Promise<GrantProgramme[]> => {
    const response = await axiosInstance.get<ApiResponse<GrantProgramme[]>>('/programmes');
    return response.data.data;
  },

  getById: async (id: string): Promise<GrantProgramme> => {
    const response = await axiosInstance.get<ApiResponse<GrantProgramme>>(`/programmes/${id}`);
    return response.data.data;
  },
};
