import type { SuggestionStatus, Priority } from './shared.types';

export interface BaseSuggestion {
  _id: string;
  title: string;
  description: string;
  status: SuggestionStatus;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  createdAt: string | Date;
  theme: string;
  priority: Priority;
}

export interface TableSuggestion extends BaseSuggestion {
  // Additional fields specific to table display
  metadata?: {
    category?: string;
    scenario?: string;
    component?: string;
  };
}

export interface DialogSuggestion extends BaseSuggestion {
  // Additional fields specific to dialog display
  prompt?: string;
  metadata?: {
    category: string;
    scenario: string;
    component: string;
    isNewComponent: boolean;
  };
}

export interface GitHubIssueResponse {
  id: number;
  title: string;
  description: string | null | undefined;
  priority: string;
  status: string;
  createdAt: string;
  theme: string;
  type: 'code_generation' | 'image_generation' | 'text_generation';
}

export interface ContentFormData {
  title: string;
  description: string;
  status: SuggestionStatus;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  theme: string;
  priority: Priority;
  prompt?: string;
  metadata?: {
    category: string;
    scenario: string;
    component: string;
    isNewComponent: boolean;
  };
}

export const mapGitHubIssueToSuggestion = (issue: GitHubIssueResponse): DialogSuggestion => ({
  _id: issue.id.toString(),
  title: issue.title,
  description: issue.description || '',
  status: issue.status as SuggestionStatus,
  type: issue.type,
  createdAt: issue.createdAt,
  theme: issue.theme,
  priority: issue.priority as Priority
}); 