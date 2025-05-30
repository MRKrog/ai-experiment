import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

// Fetch issues from GitHub repository
export const fetchGitHubIssues = async (owner, repo) => {
  try {
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      sort: 'created',
      direction: 'desc'
    });

    // Transform GitHub issues to match our suggestion format
    return data.map(issue => ({
      id: issue.id,
      theme: issue.title,
      description: issue.body,
      priority: getPriorityFromLabels(issue.labels),
      status: getStatusFromState(issue.state, issue.state_reason),
      createdAt: issue.created_at
    }));
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    return [];
  }
};

// Helper function to determine priority from labels
const getPriorityFromLabels = (labels) => {
  const priorityLabels = labels.map(label => label.name.toLowerCase());
  if (priorityLabels.includes('high') || priorityLabels.includes('priority-high')) return 'high';
  if (priorityLabels.includes('medium') || priorityLabels.includes('priority-medium')) return 'medium';
  if (priorityLabels.includes('low') || priorityLabels.includes('priority-low')) return 'low';
  return 'medium'; // default priority
};

// Helper function to determine status from state
const getStatusFromState = (state, stateReason) => {
  if (state === 'closed') {
    return stateReason === 'completed' ? 'approved' : 'rejected';
  }
  return 'pending';
}; 