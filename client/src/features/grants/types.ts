export type GrantType = 'RESEARCH' | 'INNOVATION' | 'COMMUNITY' | 'INFRASTRUCTURE';
export type WorkflowStage = 'SUBMISSION' | 'SCREENING' | 'REVIEW' | 'DECISION' | 'AWARDED' | 'DISBURSEMENT' | 'COMPLIANCE';

export interface GrantProgramme {
  id: string;
  name: string;
  description: string;
  grantType: GrantType;
  totalBudget: number;
  maxAwardAmount: number;
  applicationOpenDate: string;
  applicationCloseDate: string;
  currentStage: WorkflowStage;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
