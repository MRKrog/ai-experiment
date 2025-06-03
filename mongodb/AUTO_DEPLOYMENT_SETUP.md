# Auto-Deployment Setup Guide

This guide will help you set up automatic deployment of generated components to your React project.

## 🎯 What This Does

When you complete a task:
1. **Component Generated** - AI creates React component code
2. **File Written** - Component automatically written to your React project
3. **Exports Updated** - Auto-updates index.ts with new component export
4. **Hot Reload** - Your dev server immediately shows the new component
5. **Git Deploy** (Optional) - Auto-commits and deploys to production

## 📋 Prerequisites

- MongoDB server running
- React project in `ai-experiment-site/` directory
- Git repository (for production deployment)

## ⚙️ Environment Setup

### 1. Create `.env` file in `mongodb/` directory:

```bash
# Copy this into mongodb/.env

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-experiment

# Auto-Deployment Configuration
REACT_PROJECT_PATH=../ai-experiment-site
ENABLE_AUTO_DEPLOYMENT=true
ENABLE_PRODUCTION_DEPLOY=false

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. For Production Auto-Deploy (Optional):

Set `ENABLE_PRODUCTION_DEPLOY=true` in your `.env` file.

**Requirements:**
- Git repository initialized in React project
- Clean working directory (no uncommitted changes)
- Push access to remote repository

## 🏗️ Directory Structure

After setup, your structure will look like:

```
your-workspace/
├── mongodb/                           ← Node.js server
│   ├── src/
│   │   ├── routes/taskRoutes.js      ← Updated with auto-deployment
│   │   └── services/
│   │       └── fileSystemService.js  ← New deployment service
│   └── .env                          ← Environment variables
└── ai-experiment-site/               ← React project
    └── src/
        └── components/
            └── generated/            ← Auto-created directory
                ├── HeaderComponent.tsx  ← Auto-generated components
                ├── ButtonComponent.tsx  ← Auto-generated components
                └── index.ts            ← Auto-updated exports
```

## 🚀 Usage

### 1. Start Your Servers:

```bash
# Terminal 1: Start MongoDB server
cd mongodb
npm start

# Terminal 2: Start React dev server
cd ai-experiment-site
npm start
```

### 2. Generate Components:

1. Go to `http://localhost:3000`
2. Create a new task
3. Click "Process Task"
4. **Magic happens!** 🎉

### 3. Use Generated Components:

```typescript
// In any React file
import { HeaderComponent } from './components/generated';

function MyPage() {
  return (
    <div>
      <HeaderComponent title="Auto-Generated!" />
    </div>
  );
}
```

## 📊 What You'll See

### Console Output (MongoDB Server):
```
🎯 Processing single task: 1734024567890
✅ React project structure validated
🎭 Using mock component data (no API cost!)
🚀 Starting auto-deployment pipeline...
✅ Generated components directory exists
✅ Component written to: /path/to/ai-experiment-site/src/components/generated/HeaderComponent.tsx
✅ Updated exports index with 1 components
✅ Component auto-deployed: HeaderComponent.tsx
📝 Production deployment disabled in environment
✅ Successfully processed task 1734024567890
```

### React Dev Server:
```
[webpack] Recompiling...
[webpack] Compiled successfully
```

### Browser:
- **Hot reload** - Page refreshes automatically
- **Component available** - Import and use immediately

## 🔧 Troubleshooting

### "React project validation failed"
- Check `REACT_PROJECT_PATH` in `.env`
- Ensure React project has `package.json` with React dependency
- Verify `src/` directory exists

### "Permission denied"
- MongoDB server needs write access to React project
- Run MongoDB server from correct directory
- Check file permissions

### Components not showing up
- Check browser console for import errors
- Verify component exports in `generated/index.ts`
- Restart React dev server

## 🎛️ Configuration Options

### Disable Auto-Deployment:
```bash
ENABLE_AUTO_DEPLOYMENT=false
```

### Enable Production Deployment:
```bash
ENABLE_PRODUCTION_DEPLOY=true
```

### Custom React Project Path:
```bash
REACT_PROJECT_PATH=/path/to/your/react/project
```

## 🏁 Success Indicators

✅ **Local Development:**
- New files appear in `src/components/generated/`
- React dev server hot reloads
- Components immediately importable

✅ **Production Deployment:** (if enabled)
- Git commits automatically created
- Changes pushed to remote repository
- Vercel/Netlify rebuilds and deploys

## 🎉 You're Ready!

Your auto-deployment system is now configured. Generate your first component and watch the magic happen!

---

**Need help?** Check the MongoDB server console for detailed logs and error messages. 