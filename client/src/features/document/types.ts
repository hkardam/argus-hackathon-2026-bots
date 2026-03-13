export type DocumentStatus = 'ACTIVE' | 'REPLACED'

export type DocumentCategory =
  | 'REGISTRATION'
  | 'AUDITED_FINANCIALS'
  | 'CERTIFICATE_80G'
  | 'FCRA_CERTIFICATE'
  | 'OTHER'

export interface DocumentResponse {
  id: string
  userId: string
  category: DocumentCategory
  documentName: string
  filePath: string
  contentType: string
  fileSize: number
  status: DocumentStatus
  uploadedAt: string
}

export interface DocumentUploadRequest {
  file: File
  userId: string
  category: DocumentCategory
  documentName: string
}
