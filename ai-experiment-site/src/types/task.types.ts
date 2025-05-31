export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
}

export interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export interface TaskSubmissionData {
  _id: string;
  title: string;
  description: string;
  type: string;
  prompt: string;
  status: 'pending';
  metadata: {
    category: string;
    scenario: string;
    component: string;
    isNewComponent: boolean;
  };
}

export interface TaskFormProps {
  onSubmit: (data: TaskSubmissionData) => void;
  initialData?: Partial<TaskSubmissionData>;
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