import { Octokit } from '@octokit/rest';
import type { GitHubIssueResponse, DialogSuggestion } from '../types/suggestion.types';

declare global {
  interface ImportMeta {
    env: {
      VITE_GITHUB_TOKEN: string;
      VITE_GITHUB_OWNER: string;
      VITE_GITHUB_REPO: string;
    }
  }
}

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

// Fetch issues from GitHub repository
export const fetchGitHubIssues = async (owner: string, repo: string, page = 1, per_page = 100) => {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      sort: 'created',
      direction: 'desc',
      per_page,
      page
    });

    // Transform the GitHub data into our expected format
    return data.map(issue => ({
      id: issue.number,
      title: issue.title,
      theme: issue.title,
      description: issue.body,
      priority: getPriorityFromLabels(issue.labels),
      status: getStatusFromState(issue.state, issue.state_reason),
      type: 'code_generation' as const,
      createdAt: new Date(issue.created_at).toISOString()
    }));
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
};

export const createContentRequest = async (owner: string, repo: string, request: DialogSuggestion) => {
  const { data } = await octokit.issues.create({
    owner,
    repo,
    title: request.theme,
    labels: ['content-request', request.priority],
    body: `### Content Request
${request.description}

### Priority
${request.priority}

### Status
- [x] Request Submitted
- [ ] Processing
- [ ] Content Generated

### Generated Content
_Content will appear here once generated_
`
  });
  return data;
};

export const deleteContentRequest = async (owner: string, repo: string, issueNumber: string) => {
  try {
    // First get the issue's node ID using REST API
    const { data: issue } = await octokit.issues.get({
      owner,
      repo,
      issue_number: parseInt(issueNumber, 10)
    });

    // Then use GraphQL to delete the issue
    await octokit.graphql(`
      mutation DeleteIssue($issueId: ID!) {
        deleteIssue(input: {issueId: $issueId}) {
          clientMutationId
        }
      }
    `, {
      issueId: issue.node_id
    });

    return true;
  } catch (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
};

// Helper function to determine priority from labels
const getPriorityFromLabels = (labels: any[]): 'high' | 'medium' | 'low' => {
  const priorityLabels = labels.map(label => label.name.toLowerCase());
  if (priorityLabels.includes('high') || priorityLabels.includes('priority-high')) return 'high';
  if (priorityLabels.includes('medium') || priorityLabels.includes('priority-medium')) return 'medium';
  if (priorityLabels.includes('low') || priorityLabels.includes('priority-low')) return 'low';
  return 'medium'; // default priority
};

// Helper function to determine status from state
const getStatusFromState = (state: string, stateReason: string | null | undefined): 'pending' | 'approved' | 'rejected' => {
  if (state === 'closed') {
    return stateReason === 'completed' ? 'approved' : 'rejected';
  }
  return 'pending';
}; 