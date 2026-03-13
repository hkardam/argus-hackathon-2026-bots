export interface EligibilityAiRequest {
  programmeId: string;
  applicantId?: string | null;
  data: Record<string, any>;
}

export interface EligibilityAiResponse {
  eligible: 'Yes' | 'No';
  feedback: string;
}
