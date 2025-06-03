# GitHub API Auto-Deployment Setup

This guide explains how to set up GitHub API integration for auto-deploying generated components directly to your repository from production (Railway).

## 🔧 Environment Configuration

### Production (Railway)
```env
# GitHub API Integration
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_USERNAME=MRKrog
GITHUB_REPO=ai-experiment

# Deployment Settings
ENABLE_PRODUCTION_DEPLOY=true
ENABLE_AUTO_DEPLOYMENT=false

# MongoDB
MONGODB_URI=your_mongodb_uri

# Other settings...
NODE_ENV=production
```

### Local Development
```env
# GitHub API Integration (optional for local testing)
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_USERNAME=MRKrog  
GITHUB_REPO=ai-experiment

# Local file deployment (recommended for development)
ENABLE_AUTO_DEPLOYMENT=true
ENABLE_PRODUCTION_DEPLOY=false
REACT_PROJECT_PATH=../ai-experiment-site

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-tasks

# Other settings...
NODE_ENV=development
```

## 🔑 GitHub Personal Access Token Setup

1. **Create Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (Full control of private repositories)
   - Copy the generated token

2. **Add to Railway Environment:**
   - Railway Dashboard → Your Project → Variables
   - Add: `GITHUB_TOKEN=ghp_your_token_here`

## 🚀 How It Works

### Production Deployment Flow (Railway → GitHub)
```
1. Task processed on Railway server
2. Component generated with mock data
3. GitHub API creates/updates files directly in repo:
   ├── ai-experiment-site/src/components/generated/ComponentName.tsx
   ├── ai-experiment-site/src/components/generated/index.ts (updated)
   └── ai-experiment-site/src/pages/GenerationPage.jsx (auto-injected)
4. Changes appear in GitHub repository immediately
5. Local development hot-reloads pick up changes
```

### Local Development Flow (Local → Files)
```
1. Task processed locally
2. Component generated with mock data  
3. Files written directly to local project:
   ├── ../ai-experiment-site/src/components/generated/ComponentName.tsx
   ├── ../ai-experiment-site/src/components/generated/index.ts (updated)
   └── ../ai-experiment-site/src/pages/GenerationPage.jsx (auto-injected)
4. Hot reload shows changes immediately
5. Optional: Git commit and push (if ENABLE_PRODUCTION_DEPLOY=true)
```

## 📁 File Structure Created

The GitHub API service automatically manages this structure:

```
ai-experiment-site/src/
├── components/
│   └── generated/
│       ├── index.ts                 # Auto-managed exports
│       ├── HeaderComponent.tsx      # Generated components
│       ├── ButtonComponent.tsx
│       └── CardComponent.tsx
└── pages/
    └── GenerationPage.jsx          # Auto-injected component previews
```

## 🎛️ Deployment Mode Detection

The system automatically chooses the deployment method:

```javascript
const useGitHubApi = process.env.ENABLE_PRODUCTION_DEPLOY === 'true';
const useLocalDeploy = process.env.ENABLE_AUTO_DEPLOYMENT === 'true' && !useGitHubApi;

if (useGitHubApi) {
  // 🌐 Use GitHub API (Production)
} else if (useLocalDeploy) {
  // 💻 Use local file system (Development)
} else {
  // 📴 No deployment
}
```

## 🧪 Testing

### Test GitHub API Integration:
```bash
# Set environment variables in Railway
ENABLE_PRODUCTION_DEPLOY=true
ENABLE_AUTO_DEPLOYMENT=false

# Process a task - should create files in GitHub repo
curl -X POST https://your-railway-app.railway.app/api/tasks/TASK_ID/process
```

### Test Local Development:
```bash
# Set environment variables locally
export ENABLE_AUTO_DEPLOYMENT=true
export ENABLE_PRODUCTION_DEPLOY=false
export REACT_PROJECT_PATH=../ai-experiment-site

# Process a task - should create local files
npm run dev
# Then use the dashboard to process a task
```

## 🔍 Monitoring & Debugging

### Console Output Examples:

**GitHub API Mode:**
```
🔧 Deployment mode: GitHub API
🌐 Starting GitHub API deployment...
✅ Component HeaderComponent.tsx created/updated in GitHub
✅ Exports index updated with 3 components
✅ Component HeaderComponent auto-injected into GenerationPage.jsx
✅ GitHub deployment completed for HeaderComponent.tsx
```

**Local File Mode:**
```
🔧 Deployment mode: Local Files
💻 Starting local file system deployment...
✅ React project structure validated
✅ Component written to: /path/to/HeaderComponent.tsx
✅ Updated exports index with 3 components
✅ Component auto-deployed: HeaderComponent.tsx
```

## ⚠️ Troubleshooting

### Common Issues:

1. **GitHub API Rate Limits:**
   - Free tier: 5,000 requests/hour
   - If exceeded, deployment will fail gracefully

2. **Invalid Token:**
   - Error: "Bad credentials"
   - Solution: Regenerate token with `repo` scope

3. **Repository Not Found:**
   - Check `GITHUB_USERNAME` and `GITHUB_REPO` values
   - Ensure token has access to the repository

4. **File Conflicts:**
   - System automatically resolves naming conflicts
   - Example: `HeaderComponent.tsx` → `HeaderComponent_1.tsx`

## 🎯 Benefits

- ✅ **Works in Production**: Deploy from Railway to GitHub directly
- ✅ **No Local Dependencies**: No need for local React project in production
- ✅ **Real-time Updates**: Changes appear immediately in repository
- ✅ **Hot Reload Compatible**: Local development picks up GitHub changes
- ✅ **Automatic Integration**: Components auto-injected into GenerationPage
- ✅ **Conflict Resolution**: Handles duplicate names gracefully
- ✅ **Dual Mode**: GitHub API for production, local files for development 