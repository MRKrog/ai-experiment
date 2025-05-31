# AI Task Generation API

A RESTful API for managing AI generation tasks.

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

## API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks (with pagination)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Query Parameters
- `status`: Filter by status (pending, in_progress, completed, failed)
- `type`: Filter by type (image_generation, code_generation, text_generation)
- `page`: Page number for pagination
- `limit`: Number of items per page
- `createdBy`: Filter by creator ID

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Deployment to Railway

### Prerequisites
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

### Deploy
1. Initialize Railway project:
```bash
railway init
```

2. Link your repository:
```bash
railway link
```

3. Add environment variables:
```bash
railway vars set MONGODB_URI=your_mongodb_uri
railway vars set NODE_ENV=production
```

4. Deploy your API:
```bash
railway up
```

Your API will be deployed with:
- Automatic HTTPS
- Custom domain support
- Zero-downtime deployments
- Automatic restarts on failure
- Health check monitoring
- Real-time logs

### Monitor
- View logs: `railway logs`
- Check status: `railway status`
- Open dashboard: `railway open`

## Alternative Deployment

If not using Railway, you can deploy manually:

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
``` 