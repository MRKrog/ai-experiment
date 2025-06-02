import React from 'react';
import type { TaskFormData } from '../../../../types/task.types';
import { TasksForm } from '../../tasks/TaskForm';

interface TaskFormAdapterProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
}

export const TaskFormAdapter: React.FC<TaskFormAdapterProps> = ({
  onSubmit,
  initialData,
  isLoading
}) => {
  return (
    <TasksForm
      onSubmit={onSubmit}
      initialData={initialData}
      isLoading={isLoading}
    />
  );
}; 