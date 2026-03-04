export type JobStatus =
  | 'wishlist'
  | 'applied'
  | 'phone-screen'
  | 'technical-test'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export type Priority = 'high' | 'medium' | 'low';
export type SortField = 'appliedDate' | 'company' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface Job {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  status: JobStatus;
  priority: Priority;
  appliedDate: string;
  deadline?: string;
  notes?: string;
  cvUsed?: string;
  jobUrl?: string;
}
