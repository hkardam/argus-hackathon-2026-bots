import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DocumentResponse } from './types'

const API_BASE_URL = '/api/documents'

export const documentApi = {
  fetchDocuments: async (
    userId: string,
    includeReplaced: boolean = false,
  ): Promise<DocumentResponse[]> => {
    const { data } = await axios.get(
      `${API_BASE_URL}?userId=${userId}&includeReplaced=${includeReplaced}`,
    )
    return data
  },

  uploadDocument: async (formData: FormData): Promise<DocumentResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  deleteDocument: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`)
  },
}

export const useDocuments = (
  userId: string,
  includeReplaced: boolean = false,
) => {
  return useQuery({
    queryKey: ['documents', userId, includeReplaced],
    queryFn: () => documentApi.fetchDocuments(userId, includeReplaced),
    enabled: !!userId,
  })
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: () => {
      // We don't have direct access to userId in variables if it's FormData easily without parsing
      // but we can invalidate all documents for now or pass userId to mutation
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
