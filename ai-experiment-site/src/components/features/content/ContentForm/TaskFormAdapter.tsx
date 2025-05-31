import React from 'react';
import type { ContentFormData } from '../../../../types/suggestion.types';
import { TasksForm } from '../../tasks/TaskForm';
import type { TaskSubmissionData } from '../../../../types/task.types';
import type { SuggestionStatus } from '../../../../types/shared.types';

interface TaskFormAdapterProps {
  onSubmit: (data: ContentFormData) => void;
  initialData?: Partial<ContentFormData>;
  isLoading?: boolean;
}

export const TaskFormAdapter: React.FC<TaskFormAdapterProps> = ({
  onSubmit,
  initialData,
  isLoading
}) => {
  const handleSubmit = (taskData: TaskSubmissionData) => {
    const contentData: ContentFormData = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status as SuggestionStatus,
      type: taskData.type as 'code_generation' | 'image_generation' | 'text_generation',
      theme: taskData.metadata?.component || '',
      priority: 'medium',
      prompt: taskData.prompt,
      metadata: taskData.metadata
    };
    onSubmit(contentData);
  };

  const adaptedInitialData: Partial<TaskSubmissionData> | undefined = initialData ? {
    title: initialData.title,
    description: initialData.description,
    status: 'pending',
    type: 'code_generation',
    prompt: initialData.prompt,
    metadata: initialData.metadata
  } : undefined;

  return (
    <TasksForm
      onSubmit={handleSubmit}
      initialData={adaptedInitialData}
      isLoading={isLoading}
    />
  );
}; 