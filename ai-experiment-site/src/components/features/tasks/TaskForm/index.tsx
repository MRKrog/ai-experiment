import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormInput, FormTextarea } from '../../../common/Form';
import { Button } from '../../../common/Button';
import type { 
  TaskFormProps, 
  TaskFormState, 
  ContentScenarios,
  TaskFormData
} from '../../../../types/task.types';

const CONTENT_SCENARIOS: ContentScenarios = {
  component_creation: {
    title: 'Create Component',
    options: [
      {
        value: 'interactive_component',
        label: 'Interactive Component',
        description: 'Create a new interactive UI component (e.g., dropdown, modal, carousel)',
        defaultPrompt: 'Create a modern, accessible, and reusable interactive component with proper TypeScript types and styling'
      },
      {
        value: 'data_component',
        label: 'Data Display Component',
        description: 'Create a component for displaying data (e.g., table, card, list)',
        defaultPrompt: 'Create a component that displays data in an organized and visually appealing way with sorting and filtering capabilities'
      },
      {
        value: 'form_component',
        label: 'Form Component',
        description: 'Create a form component with validation and state management',
        defaultPrompt: 'Create a form component with proper validation, error handling, and modern styling'
      }
    ]
  },
  ui_enhancement: {
    title: 'UI Enhancement',
    options: [
      {
        value: 'color_scheme',
        label: 'Generate Color Scheme',
        description: 'Create a new color palette for the application',
        defaultPrompt: 'Generate a modern color scheme with primary, secondary, and accent colors'
      },
      {
        value: 'component_styling',
        label: 'Enhance Component Style',
        description: 'Improve the visual design of a specific component',
        defaultPrompt: 'Create modern styling for the component with animations and transitions'
      },
      {
        value: 'layout_improvement',
        label: 'Layout Improvement',
        description: 'Optimize the layout and spacing of elements',
        defaultPrompt: 'Suggest improvements for the layout with better spacing and alignment'
      }
    ]
  },
  feature_addition: {
    title: 'Feature Addition',
    options: [
      {
        value: 'animation',
        label: 'Interactive Animations',
        description: 'Add engaging micro-interactions and motion effects',
        defaultPrompt: 'Create delightful micro-animations and interactions that enhance user experience'
      },
      {
        value: 'smart_search',
        label: 'Smart Search & Filter',
        description: 'Implement advanced search with auto-complete and filters',
        defaultPrompt: 'Design an intelligent search system with auto-suggestions and dynamic filtering'
      },
      {
        value: 'data_visualization',
        label: 'Data Visualization',
        description: 'Add charts, graphs, or visual data representations',
        defaultPrompt: 'Create interactive data visualizations that are both informative and visually appealing'
      }
    ]
  },
  code_optimization: {
    title: 'Code Optimization',
    options: [
      {
        value: 'performance',
        label: 'Performance Enhancement',
        description: 'Optimize code for better performance',
        defaultPrompt: 'Suggest optimizations for better component performance'
      },
      {
        value: 'code_cleanup',
        label: 'Code Cleanup',
        description: 'Refactor and clean up existing code',
        defaultPrompt: 'Refactor the code for better maintainability and readability'
      },
      {
        value: 'best_practices',
        label: 'Implement Best Practices',
        description: 'Update code to follow React best practices',
        defaultPrompt: 'Update the code to follow modern React patterns and best practices'
      }
    ]
  }
};

export const TasksForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [task, setTask] = useState<TaskFormState>({
    category: '',
    scenario: '',
    component: '',
    type: 'code_generation',
    additionalNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOption = Object.values(CONTENT_SCENARIOS)
      .flatMap(category => category.options)
      .find(option => option.value === task.scenario);

    if (!selectedOption) return;

    const isNewComponent = task.category === 'component_creation';
    
    const submissionData: TaskFormData = {
      title: isNewComponent 
        ? `Create New ${task.component}`
        : `${selectedOption.label} - ${task.component}`,
      description: selectedOption.description,
      type: task.type,
      status: 'pending',
      theme: task.component,
      priority: 'medium',
      prompt: `${selectedOption.defaultPrompt}${isNewComponent ? '' : ` for ${task.component}`}.${task.additionalNotes ? '\nAdditional requirements: ' + task.additionalNotes : ''}`,
      metadata: {
        category: task.category,
        scenario: task.scenario,
        component: task.component,
        isNewComponent
      }
    };

    onSubmit(submissionData);
    setTask({
      category: '',
      scenario: '',
      component: '',
      type: 'code_generation',
      additionalNotes: ''
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      <div className="p-8">
        <Form onSubmit={handleSubmit}>
          {/* Enhancement Category */}
          <FormGroup>
            <FormLabel className="mb-2">
              {task.category === 'component_creation' ? 'Component Type' : 'Enhancement Category'}
            </FormLabel>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(CONTENT_SCENARIOS).map(([key, category]) => {
                const isDisabled = key !== 'component_creation'; // Only allow Create Component
                return (
                  <Button
                    key={key}
                    type="button"
                    variant={task.category === key ? 'primary' : 'outline'}
                    onClick={() => {
                      if (!isDisabled) {
                        setTask({ ...task, category: key, scenario: '' });
                      }
                    }}
                    disabled={isDisabled}
                    className={`
                      ${task.category === key ? 'bg-blue-600 font-semibold shadow-[0_0_15px_-3px_rgba(59,130,246,0.9)]' : ''}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-gray-700' : ''}
                    `}
                  >
                    {category.title}
                  </Button>
                );
              })}
            </div>
          </FormGroup>

          {/* Specific Scenario */}
          {task.category && (
            <FormGroup>
              <FormLabel className="mb-2">
                {task.category === 'component_creation' ? 'Component Style' : 'Specific Scenario'}
              </FormLabel>
              <div className="grid grid-cols-1 gap-2">
                {CONTENT_SCENARIOS[task.category].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`px-4 py-3 rounded-lg text-left transition-all
                      ${task.scenario === option.value
                        ? 'bg-blue-900/50 text-blue-200 ring-2 ring-blue-500'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    onClick={() => setTask({ ...task, scenario: option.value })}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-sm opacity-70 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </FormGroup>
          )}

          {/* Component Name */}
          {task.scenario && (
            <FormGroup>
              <FormLabel>
                {task.category === 'component_creation' 
                  ? 'New Component Name'
                  : 'Target Component'}
              </FormLabel>
              <FormInput
                type="text"
                placeholder={task.category === 'component_creation'
                  ? "Enter the new component name (e.g., 'MultiSelect', 'DataTable')"
                  : "Enter the component to modify (e.g., 'Navigation Menu', 'Card Component')"}
                value={task.component}
                onChange={(e) => setTask({ ...task, component: e.target.value })}
                required
              />
            </FormGroup>
          )}

          {/* Additional Notes */}
          {task.scenario && (
            <FormGroup>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormTextarea
                rows={1}
                placeholder="Add any specific requirements or notes..."
                value={task.additionalNotes}
                onChange={(e) => setTask({ ...task, additionalNotes: e.target.value })}
              />
            </FormGroup>
          )}

          {/* Submit Button */}
          {task.scenario && (
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Generate Content
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default TasksForm; 