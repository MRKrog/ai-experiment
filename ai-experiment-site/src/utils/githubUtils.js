import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

// Fetch issues from GitHub repository
export const fetchGitHubIssues = async (owner, repo, page = 1, per_page = 100) => {
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
      theme: issue.title,
      description: issue.body,
      priority: getPriorityFromLabels(issue.labels),
      status: getStatusFromState(issue.state, issue.state_reason),
      createdAt: new Date(issue.created_at).toISOString() // Ensure valid date format
    }));
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
};

export const createContentRequest = async (owner, repo, request) => {
  const { data } = await octokit.issues.create({
    owner,
    repo,
    title: request.theme,
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
`,
    labels: ['content-request', request.priority]
  });
  return data;
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