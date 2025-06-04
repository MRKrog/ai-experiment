import express from 'express';
import Task from '../models/Task.js';
import { processTaskWithClaude } from '../services/claudeService.js';
import { getMockComponent, createMockGeneratedContent } from '../services/mockComponentData.js';
import { FileSystemService } from '../services/fileSystemService.js';
import { GitHubApiService } from '../services/githubApiService.js';

const router = express.Router();

// Get all tasks with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      status,
      type,
      page = 1,
      limit = 100,
      createdBy
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (createdBy) query.createdBy = createdBy;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalTasks: total
    });
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    next(error);
  }
});

// Create a new task
router.post('/', async (req, res, next) => {
  
  try {
    const task = await Task.create({
      ...req.body,
      _id: new Date().getTime().toString()
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    next(error);
  }
});

// Get task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(`Error in GET /api/tasks/${req.params.id}:`, error);
    next(error);
  }
});

// Update task status and result
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(`Error in PUT /api/tasks/${req.params.id}:`, error);
    next(error);
  }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /api/tasks/${req.params.id}:`, error);
    next(error);
  }
});

// Get tasks by status
router.get('/status/:status', async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: req.params.status })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get tasks by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const tasks = await Task.find({ type: req.params.type })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Process a specific task by ID
router.post('/:id/process', async (req, res, next) => {
  const taskId = req.params.id;
  console.log(`🎯 Processing single task: ${taskId}`);
  
  try {
    // Get the specific task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    console.log(`Processing task: ${task.title}`);
    
    // 4. Update status to in_progress
    await Task.findByIdAndUpdate(taskId, { 
      status: 'in_progress',
      metadata: { 
        ...task.metadata, 
        startedAt: new Date().toISOString() 
      }
    });

    try {
      // 5a. OPTION 1: Generate content with Claude API (Real AI - Costs tokens)
      console.log('🤖 Generating component with Claude API...');
      const generatedContent = await processTaskWithClaude(task);
      
      console.log('generatedContent from Claude:', {
        tokensUsed: generatedContent.tokensUsed,
        contentLength: generatedContent.content?.length || 0
      });
      
      // 7a. Update task with Claude-generated results
      const updatedTask = await Task.findByIdAndUpdate(taskId, {
        status: 'staged',
        result: generatedContent,
        generatedContent: {
          type: 'component',
          filename: `${task.title.replace(/\s+/g, '')}Component.tsx`,
          content: generatedContent.content,
          description: `Generated component for ${task.title}`
        },
        metadata: {
          ...task.metadata,
          completedAt: new Date().toISOString(),
          model: generatedContent.model || 'claude-3-5-sonnet-20241022',
          tokensUsed: generatedContent.tokensUsed || 0
        }
      }, { new: true });
      
      // 8. 🚀 STAGE DEPLOYMENT: Put component in repository during staging
      console.log('📁 Staging component to repository...');
      
      try {
        const deploymentResult = await GitHubApiService.deployComponentToGitHub(
          updatedTask.generatedContent,
          updatedTask
        );
        
        // Update task with staging deployment info
        await Task.findByIdAndUpdate(taskId, {
          'metadata.staged': {
            deployed: true,
            ...deploymentResult,
            stagedAt: new Date().toISOString()
          }
        });
        
        console.log(`✅ Component successfully staged to repository: ${deploymentResult.finalFilename}`);
        
      } catch (stagingError) {
        console.error('❌ Failed to stage component to repository:', stagingError);
        
        // Still mark as staged even if GitHub deployment fails
        await Task.findByIdAndUpdate(taskId, {
          'metadata.staged': {
            deployed: false,
            error: stagingError.message,
            attemptedAt: new Date().toISOString()
          }
        });
      }
      
      // 9. 📋 STAGING COMPLETE: Component ready for deployment
      console.log(`✅ Successfully processed task ${taskId} (component staged in repository)`);
      
      res.json({
        success: true,
        message: `Task "${task.title}" processed successfully. Component staged in repository.`,
        task: updatedTask,
        result: generatedContent,
        deployment: { 
          deployed: updatedTask.metadata?.staged?.deployed || false, 
          reason: updatedTask.metadata?.staged?.error || 'Component staged - use Deploy button to go live',
          deploymentType: 'staged' 
        }
      });
      
    } catch (processingError) {
      console.error(`❌ Failed to process task ${taskId}:`, processingError);
      
      // Mark task as failed
      await Task.findByIdAndUpdate(taskId, {
        status: 'failed',
        error: processingError.message,
        metadata: {
          ...task.metadata,
          failedAt: new Date().toISOString()
        }
      });
      
      res.status(500).json({
        success: false,
        error: `Processing failed: ${processingError.message}`,
        taskId: taskId
      });
    }
    
  } catch (error) {
    console.error(`💥 Single task processing error:`, error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Manual deployment trigger endpoint
router.post('/deploy', async (req, res, next) => {
  try {
    console.log('🚀 Manual deployment triggered');
    
    // 1. Check if there are any staged components
    const stagedTasks = await Task.find({ 
      status: 'staged',
      'metadata.staged.deployed': true
    });
    
    console.log(`📦 Found ${stagedTasks.length} staged components ready for deployment`);
    
    if (stagedTasks.length === 0) {
      return res.json({
        success: false,
        message: 'No staged components found. Components must be processed first.',
        tasksUpdated: 0
      });
    }
    
    // 2. Trigger GitHub workflow to build and deploy website
    console.log('🌐 Triggering GitHub Pages deployment...');
    const workflowResult = await GitHubApiService.triggerDeployment();
    
    if (workflowResult) {
      // 3. Update all staged tasks to deploying status (not deployed yet!)
      const updateResult = await Task.updateMany(
        { 
          status: 'staged',
          'metadata.staged.deployed': true
        },
        { 
          status: 'deploying',
          'metadata.deployingAt': new Date().toISOString()
        }
      );
      
      console.log(`✅ Updated ${updateResult.modifiedCount} tasks to deploying status`);
      
      res.json({
        success: true,
        message: `Successfully triggered deployment of ${stagedTasks.length} components`,
        triggeredAt: new Date().toISOString(),
        tasksUpdated: updateResult.modifiedCount,
        componentsDeployed: stagedTasks.map(task => ({
          title: task.title,
          filename: task.generatedContent?.filename
        })),
        note: 'Components are now deploying. Status will update to "live" when deployment completes.'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to trigger GitHub Pages deployment'
      });
    }
    
  } catch (error) {
    console.error('💥 Manual deployment error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// GitHub webhook endpoint for deployment status
router.post('/webhook/github', async (req, res, next) => {
  try {
    console.log('🔔 GitHub webhook received:', req.body.action);
    
    // Verify it's a workflow_run event
    if (req.body.action === 'completed' && req.body.workflow_run) {
      const workflowRun = req.body.workflow_run;
      
      // Check if it's our deploy workflow
      if (workflowRun.name === 'Deploy Website') {
        console.log(`📋 Workflow completed with status: ${workflowRun.conclusion}`);
        
        if (workflowRun.conclusion === 'success') {
          // Update all deploying tasks to live status
          const updateResult = await Task.updateMany(
            { status: 'deploying' },
            { 
              status: 'live',
              'metadata.liveAt': new Date().toISOString(),
              'metadata.deploymentUrl': `https://mrkrog.github.io/ai-experiment/content/`
            }
          );
          
          console.log(`✅ Updated ${updateResult.modifiedCount} tasks to live status`);
          
        } else {
          // Mark as deploy failed
          await Task.updateMany(
            { status: 'deploying' },
            { 
              status: 'deploy_failed',
              'metadata.deployFailedAt': new Date().toISOString(),
              'metadata.deployError': `Workflow failed: ${workflowRun.conclusion}`
            }
          );
          
          console.log(`❌ Marked tasks as deploy_failed due to workflow failure`);
        }
      }
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('💥 GitHub webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Migration endpoint - convert old "deployed" tasks to "live"
router.post('/migrate-status', async (req, res, next) => {
  try {
    console.log('🔄 Migrating old "deployed" tasks to "live" status...');
    
    const updateResult = await Task.updateMany(
      { status: 'deployed' },
      { 
        status: 'live',
        'metadata.migratedAt': new Date().toISOString()
      }
    );
    
    console.log(`✅ Migrated ${updateResult.modifiedCount} tasks from "deployed" to "live"`);
    
    res.json({
      success: true,
      message: `Successfully migrated ${updateResult.modifiedCount} tasks`,
      migratedCount: updateResult.modifiedCount
    });
    
  } catch (error) {
    console.error('💥 Migration error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router; 