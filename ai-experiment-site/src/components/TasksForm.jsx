import { useState } from 'react';

// {
//   _id: "1234567890123",
//   title: "Generate React Component",
//   description: "Create a reusable button component",
//   type: "code_generation",
//   prompt: "Create a React button component that supports primary, secondary, and outline variants",
//   status: "pending",
//   metadata: {
//     language: "typescript",
//     framework: "react"
//   }
// }

const CONTENT_SCENARIOS = {
  component_creation: {
    title: 'Create Component',
    options: [
      { value: 'interactive_component', label: 'Interactive Component',
        description: 'Create a new interactive UI component (e.g., dropdown, modal, carousel)',
        defaultPrompt: 'Create a modern, accessible, and reusable interactive component with proper TypeScript types and styling' },
      { value: 'data_component', label: 'Data Display Component',
        description: 'Create a component for displaying data (e.g., table, card, list)',
        defaultPrompt: 'Create a component that displays data in an organized and visually appealing way with sorting and filtering capabilities' },
      { value: 'form_component', label: 'Form Component',
        description: 'Create a form component with validation and state management',
        defaultPrompt: 'Create a form component with proper validation, error handling, and modern styling' }
    ]
  },
  ui_enhancement: {
    title: 'UI Enhancement',
    options: [
      { value: 'color_scheme', label: 'Generate Color Scheme', 
        description: 'Create a new color palette for the application',
        defaultPrompt: 'Generate a modern color scheme with primary, secondary, and accent colors' },
      { value: 'component_styling', label: 'Enhance Component Style',
        description: 'Improve the visual design of a specific component',
        defaultPrompt: 'Create modern styling for the component with animations and transitions' },
      { value: 'layout_improvement', label: 'Layout Improvement',
        description: 'Optimize the layout and spacing of elements',
        defaultPrompt: 'Suggest improvements for the layout with better spacing and alignment' }
    ]
  },
  feature_addition: {
    title: 'Feature Addition',
    options: [
      { value: 'animation', label: 'Interactive Animations',
        description: 'Add engaging micro-interactions and motion effects',
        defaultPrompt: 'Create delightful micro-animations and interactions that enhance user experience' },
      { value: 'smart_search', label: 'Smart Search & Filter',
        description: 'Implement advanced search with auto-complete and filters',
        defaultPrompt: 'Design an intelligent search system with auto-suggestions and dynamic filtering' },
      { value: 'data_visualization', label: 'Data Visualization',
        description: 'Add charts, graphs, or visual data representations',
        defaultPrompt: 'Create interactive data visualizations that are both informative and visually appealing' }
    ]
  },
  code_optimization: {
    title: 'Code Optimization',
    options: [
      { value: 'performance', label: 'Performance Enhancement',
        description: 'Optimize code for better performance',
        defaultPrompt: 'Suggest optimizations for better component performance' },
      { value: 'code_cleanup', label: 'Code Cleanup',
        description: 'Refactor and clean up existing code',
        defaultPrompt: 'Refactor the code for better maintainability and readability' },
      { value: 'best_practices', label: 'Implement Best Practices',
        description: 'Update code to follow React best practices',
        defaultPrompt: 'Update the code to follow modern React patterns and best practices' }
    ]
  }
};

const TasksForm = ({ onSubmit }) => {
  const [task, setTask] = useState({
    category: '',
    scenario: '',
    component: '',
    type: 'code_generation',
    additionalNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOption = Object.values(CONTENT_SCENARIOS)
      .flatMap(category => category.options)
      .find(option => option.value === task.scenario);

    const isNewComponent = task.category === 'component_creation';
    
    onSubmit({
      _id: new Date().getTime().toString(),
      title: isNewComponent 
        ? `Create New ${task.component}`
        : `${selectedOption.label} - ${task.component}`,
      description: selectedOption.description,
      type: task.type,
      prompt: `${selectedOption.defaultPrompt}${isNewComponent ? '' : ` for ${task.component}`}.${task.additionalNotes ? '\nAdditional requirements: ' + task.additionalNotes : ''}`,
      status: 'pending',
      metadata: {
        category: task.category,
        scenario: task.scenario,
        component: task.component,
        isNewComponent
      }
    });
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhancement Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {task.category === 'component_creation' ? 'Component Type' : 'Enhancement Category'}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(CONTENT_SCENARIOS).map(([key, category]) => (
                <button
                  key={key}
                  type="button"
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition-all
                    ${task.category === key
                      ? 'bg-blue-900/50 text-blue-200 ring-2 ring-blue-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  onClick={() => setTask({ ...task, category: key, scenario: '' })}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Scenario */}
          {task.category && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {task.category === 'component_creation' ? 'Component Style' : 'Specific Scenario'}
              </label>
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
            </div>
          )}

          {/* Component Name */}
          {task.scenario && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {task.category === 'component_creation' 
                  ? 'New Component Name'
                  : 'Target Component'}
              </label>
              <input
                type="text"
                placeholder={task.category === 'component_creation'
                  ? "Enter the new component name (e.g., 'MultiSelect', 'DataTable')"
                  : "Enter the component to modify (e.g., 'Navigation Menu', 'Card Component')"}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400
                  focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={task.component}
                onChange={(e) => setTask({ ...task, component: e.target.value })}
                required
              />
            </div>
          )}

          {/* Additional Notes */}
          {task.scenario && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400
                  focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all min-h-[80px] resize-y"
                placeholder={task.category === 'component_creation'
                  ? "Any specific features, props, or styling requirements for the new component?"
                  : "Any specific requirements or preferences?"}
                value={task.additionalNotes}
                onChange={(e) => setTask({ ...task, additionalNotes: e.target.value })}
              ></textarea>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!task.scenario || !task.component}
              className={`w-full rounded-lg px-4 py-3 font-medium transition-colors
                ${(!task.scenario || !task.component)
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
                }`}
            >
              {task.category === 'component_creation' ? 'Create New Component' : 'Create Enhancement Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TasksForm; 