import express from 'express';
import Task from '../models/Task.js';
import { processTaskWithClaude } from '../services/claudeService.js';
import { getMockComponent, createMockGeneratedContent } from '../services/mockComponentData.js';
import { FileSystemService } from '../services/fileSystemService.js';

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
    // 1. Validate React project (on first run)
    if (process.env.ENABLE_AUTO_DEPLOYMENT === 'true') {
      try {
        await FileSystemService.validateReactProject();
      } catch (validationError) {
        console.warn('⚠️ React project validation failed:', validationError.message);
        console.warn('⚠️ Auto-deployment will be skipped');
      }
    }

    // 2. Get the specific task
    const task = await Task.findById(taskId);
    // console.log('task', task)
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // 3. Check if task is processable
    // if (task.status !== 'pending') {
    //   return res.status(400).json({
    //     success: false,
    //     error: `Task is already ${task.status}. Only pending tasks can be processed.`,
    //     currentStatus: task.status
    //   });
    // }
    
    console.log(`Processing task: ${task.title}`);
    
    // 4. Update status to in_progress
    await Task.findByIdAndUpdate(taskId, { 
      status: 'in_progress',
      metadata: { 
        ...task.metadata, 
        startedAt: new Date().toISOString() 
      }
    });
    console.log('task updated')

    try {
      // 5. Generate content with Claude
      // const generatedContent = await processTaskWithClaude(task);
      // console.log('generatedContent', generatedContent)
      
      // 5. Use mock component instead of expensive Claude API call
      console.log('🎭 Using mock component data (no API cost!)');
      const mockComponent = getMockComponent('headerComponent');
      const generatedContent = createMockGeneratedContent('headerComponent');
      
      // Add the actual component content to the response
      generatedContent.content = mockComponent.content;
      
      console.log('generatedContent from mock:', {
        tokensUsed: generatedContent.tokensUsed,
        contentLength: generatedContent.content.length
      });
      
      // 6. Save to GitHub
      // await saveRequestToGitHub(task, generatedContent);
      
      // 7. Update task with results
      const updatedTask = await Task.findByIdAndUpdate(taskId, {
        status: 'completed',
        result: generatedContent,
        generatedContent: {
          type: 'component',
          // filename: `${task.title.replace(/\s+/g, '')}Component.tsx`,
          // content: generatedContent.content,
          // description: `Generated content for ${task.title}`
          filename: mockComponent.filename,
          content: mockComponent.content,
          description: mockComponent.description
        },
        metadata: {
          ...task.metadata,
          completedAt: new Date().toISOString(),
          model: 'claude-3-5-sonnet-20241022',
          tokensUsed: generatedContent.tokensUsed || 0
        }
      }, { new: true });
      
      // 8. 🚀 AUTO-DEPLOY: Write component to React project
      let deploymentResult = null;
      if (process.env.ENABLE_AUTO_DEPLOYMENT === 'true') {
        try {
          console.log('🚀 Starting auto-deployment pipeline...');
          
          // Resolve any naming conflicts
          const finalFilename = await FileSystemService.resolveComponentName(
            updatedTask.generatedContent.filename
          );
          
          // Write the component file
          const filePath = await FileSystemService.writeComponentFile(
            finalFilename, 
            updatedTask.generatedContent.content
          );
          
          // Update exports index
          const componentCount = await FileSystemService.updateExportsIndex();
          
          console.log(`✅ Component auto-deployed: ${finalFilename}`);
          
          // 🎯 NEW: Auto-inject component into GenerationPage.jsx
          const injectionSuccess = await FileSystemService.injectComponentIntoGenerationPage(
            finalFilename,
            updatedTask
          );
          
          // Deploy to production (if enabled)
          const productionDeployment = await FileSystemService.deployToProduction({
            title: task.title,
            filename: finalFilename
          });
          
          // Update task with deployment info
          deploymentResult = {
            deployed: true,
            localPath: filePath,
            finalFilename: finalFilename,
            componentCount: componentCount,
            injectedIntoPage: injectionSuccess,
            deployedAt: new Date().toISOString(),
            productionDeployment: productionDeployment
          };
          
          await Task.findByIdAndUpdate(taskId, {
            'metadata.deployment': deploymentResult
          });
          
        } catch (deployError) {
          console.error('❌ Auto-deployment failed:', deployError);
          
          deploymentResult = {
            deployed: false,
            error: deployError.message,
            attemptedAt: new Date().toISOString()
          };
          
          await Task.findByIdAndUpdate(taskId, {
            'metadata.deployment': deploymentResult
          });
        }
      }
      
      // 9. Update request index in GitHub
      // await updateRequestIndex([{
      //   taskId: task._id,
      //   title: task.title,
      //   type: task.type,
      //   status: 'completed'
      // }]);
      
      console.log(`✅ Successfully processed task ${taskId}`);
      
      res.json({
        success: true,
        message: `Task "${task.title}" processed successfully`,
        task: updatedTask,
        result: generatedContent,
        githubPath: `content/requests/req_${taskId}.json`,
        deployment: deploymentResult
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

export default router; 