import type { Task } from '../types/task.types';

export class AIGenerationService {
  static generateMockContent(task: Task): Task['generatedContent'] {
    const { metadata, type } = task;
    
    if (type === 'code_generation') {
      if (metadata?.scenario === 'animation') {
        return {
          type: 'component',
          filename: `${metadata.component?.replace(/\s+/g, '')}Animations.tsx`,
          content: `import React from 'react';
import { motion } from 'framer-motion';

interface ${metadata.component?.replace(/\s+/g, '')}Props {
  children: React.ReactNode;
  className?: string;
}

export const ${metadata.component?.replace(/\s+/g, '')}Animations: React.FC<${metadata.component?.replace(/\s+/g, '')}Props> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={\`\${className}\`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ${metadata.component?.replace(/\s+/g, '')}Animations;`,
          description: `Interactive animations for ${metadata.component} with smooth hover and tap effects`
        };
      }
      
      return {
        type: 'component',
        filename: `${metadata?.component?.replace(/\s+/g, '') || 'Generated'}Component.tsx`,
        content: `import React from 'react';

interface ${metadata?.component?.replace(/\s+/g, '') || 'Generated'}Props {
  title?: string;
  className?: string;
}

export const ${metadata?.component?.replace(/\s+/g, '') || 'Generated'}Component: React.FC<${metadata?.component?.replace(/\s+/g, '') || 'Generated'}Props> = ({ 
  title = "Generated Component",
  className = '' 
}) => {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600">
        This is a generated component for ${metadata?.category || 'general'} purposes.
      </p>
    </div>
  );
};

export default ${metadata?.component?.replace(/\s+/g, '') || 'Generated'}Component;`,
        description: `Generated React component for ${metadata?.component || 'general use'}`
      };
    }
    
    return {
      type: 'text',
      content: `Generated content for ${task.title}`,
      description: task.description
    };
  }

  static async simulateAIProcessing(task: Task, delayMs: number = 3000): Promise<Task['generatedContent']> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const generatedContent = this.generateMockContent(task);
        resolve(generatedContent);
      }, delayMs);
    });
  }
} 