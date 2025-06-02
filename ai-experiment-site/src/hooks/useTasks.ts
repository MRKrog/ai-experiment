import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from '../types/task.types';
import { TaskService } from '../services/taskService';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (formData: TaskFormData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all tasks
  const refreshTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAllTasks();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (formData: TaskFormData) => {
    try {
      setLoading(true);
      await TaskService.createTask(formData);
      // Refresh all tasks to ensure consistency with server
      await refreshTasks();
      setError(null);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
      throw err; // Re-throw to allow component to handle if needed
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      // Refresh all tasks to ensure consistency with server
      await refreshTasks();
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await TaskService.updateTaskStatus(taskId, status);
      // Refresh all tasks to ensure consistency with server
      await refreshTasks();
      setError(null);
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
      throw err;
    }
  };

  // Load tasks on mount
  useEffect(() => {
    refreshTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    updateTaskStatus,
    refreshTasks
  };
}; 