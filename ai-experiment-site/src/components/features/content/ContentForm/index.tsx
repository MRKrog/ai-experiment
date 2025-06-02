import React from 'react';
import type { TaskFormData } from '../../../../types/task.types';
import { TaskFormAdapter } from './TaskFormAdapter';

interface ContentFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({ 
  onSubmit, 
  initialData, 
  isLoading 
}) => {
  return (
    <section className="w-full">
      <h2 className="text-2xl mb-4">Generate New Content</h2>
      <div>
        <TaskFormAdapter 
          onSubmit={onSubmit} 
          initialData={initialData}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default ContentForm; 