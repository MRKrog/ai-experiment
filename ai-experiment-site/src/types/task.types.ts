export interface Task {
  _id: string;
  title: string;
  description: string;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  status: 'pending' | 'in_progress' | 'staged' | 'deployed' | 'failed';
  priority?: 'low' | 'medium' | 'high';
  prompt: string;
  createdAt: string | Date;
  metadata?: {
    category?: string;
    scenario?: string;
    component?: string;
    isNewComponent?: boolean;
  };
  generatedContent?: {
    type: string;
    filename?: string;
    content?: string;
    description?: string;
  };
}

// Task Form Data
export interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  type: Task['type'];
  theme: string;
  priority: Task['priority'];
  prompt: string;
  metadata: {
    category: string;
    scenario: string;
    component: string;
    isNewComponent: boolean;
  };
}

// Legacy Task interface - keeping for compatibility
export interface LegacyTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
}

export interface ContentScenarioOption {
  value: string;
  label: string;
  description: string;
  defaultPrompt: string;
}

export interface ContentScenarioCategory {
  title: string;
  options: ContentScenarioOption[];
}

export interface ContentScenarios {
  [key: string]: ContentScenarioCategory;
}

export interface TaskFormState {
  category: string;
  scenario: string;
  component: string;
  type: 'code_generation';
  additionalNotes: string;
}

// Interface for creating new tasks
export interface TaskCreationData {
  title: string;
  description: string;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  priority?: 'low' | 'medium' | 'high';
  prompt: string;
  metadata?: {
    category?: string;
    scenario?: string;
    component?: string;
    isNewComponent?: boolean;
  };
} 