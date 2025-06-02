import express from 'express';
import Task from '../models/Task.js';

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

export default router; 