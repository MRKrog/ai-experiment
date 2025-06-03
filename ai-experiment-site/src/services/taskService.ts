import type { Task, TaskFormData } from '../types/task.types';

const API_BASE_URL = 'https://ai-experiment-production.up.railway.app/api';
// const API_BASE_URL = 'http://localhost:3000/api';

export class TaskService {
  // Get all tasks
  static async getAllTasks(): Promise<{ tasks: Task[] }> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }
    
    return response.json();
  }

  // Get a task by ID
  static async getTaskById(taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);

    if (!response.ok) {
      throw new Error('Failed to load task');
    }
    
    return response.json();
  }

  // Create a new task
  static async createTask(formData: TaskFormData): Promise<Task> {
    // Map TaskFormData to Task structure
    const taskData: Omit<Task, '_id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      prompt: formData.prompt,
      metadata: formData.metadata
    };

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...taskData,
        createdAt: new Date().toISOString(),
        createdBy: 'user' // Required by API
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create task');
    }

    return response.json();
  }

  // Delete a task
  static async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  // Update a task status
  static async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }

    return response.json();
  }

  // Process a task
  static async processTask(taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to process task');
    }

    return response.json();
  }

  // Update a task with generated content
  static async updateTaskWithGeneratedContent(
    taskId: string, 
    generatedContent: Task[]
  ): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'completed',
        generatedContent,
        completedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update task with generated content');
    }

    return response.json();
  }

  // Mark a task as failed
  static async markTaskAsFailed(taskId: string, error: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'failed',
        error
      })
    });

    if (!response.ok) {
      throw new Error('Failed to mark task as failed');
    }

    return response.json();
  }
} 