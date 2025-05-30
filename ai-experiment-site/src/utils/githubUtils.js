import { Octokit } from '@octokit/rest';

// Debug log the token (but not the full value for security)
const token = import.meta.env.VITE_GITHUB_TOKEN;
console.log('Token exists:', !!token);
console.log('Token starts with:', token?.substring(0, 4));

const octokit = new Octokit({
  auth: token
});

console.log('octokit', octokit);
// console.log('import.meta.env.VITE_GITHUB_TOKEN', import.meta.env.VITE_GITHUB_TOKEN);

// Fetch issues from GitHub repository
export const fetchGitHubIssues = async (owner, repo) => {
  try {
    console.log('Fetching issues for:', { owner, repo });
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      sort: 'created',
      direction: 'desc'
    });

    console.log('Fetched issues count:', data.length);
    return data.map(issue => ({
      id: issue.id,
      theme: issue.title,
      description: issue.body,
      priority: getPriorityFromLabels(issue.labels),
      status: getStatusFromState(issue.state, issue.state_reason),
      createdAt: issue.created_at
    }));
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
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