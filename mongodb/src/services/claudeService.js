import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const modelAI = 'claude-3-haiku-20240307'; // Keep cheaper model, smart prompt does the work

// Initialize Claude at module level (more efficient)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY.trim()
});


// ===== CLAUDE PROCESSING FUNCTION =====
export async function processTaskWithClaude(task) {
  console.log(`🧠 Generating content with Claude for: ${task.title}`);
  
  try {
    // 1. Build the prompt based on task type and content
    const prompt = buildPromptForTask(task);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    
    // 2. Call Claude API
    console.log('🔄 Calling Claude API...');
    const response = await anthropic.messages.create({
      model: modelAI, // Cheaper model with smart prompting
      max_tokens: 1500, // Reasonable token limit for components
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    console.log('📦 Claude API response received:', {
      hasContent: !!response.content,
      contentLength: response.content?.length,
      hasUsage: !!response.usage
    });
    
    // 3. Extract the generated content
    const rawContent = response.content[0].text;
    console.log(`📝 Raw Claude response: ${rawContent.length} characters`);
    
    // 4. Extract only the React component code from the response
    const extractedCode = extractReactComponentCode(rawContent);
    console.log(`✅ Extracted component code: ${extractedCode.length} characters`);
    
    // 5. Return structured result
    return {
      content: extractedCode,
      rawResponse: rawContent, // Keep the full response for debugging
      model: modelAI,
      tokensUsed: response.usage?.output_tokens || 0,
      inputTokens: response.usage?.input_tokens || 0,
      generatedAt: new Date().toISOString(),
      promptLength: prompt.length
    };
    
  } catch (error) {
    console.error('❌ Claude API error:', error);
    
    // Handle specific Claude API errors
    if (error.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Claude');
    } else if (error.status === 401) {
      throw new Error('Invalid Claude API key');
    } else if (error.status === 400) {
      throw new Error('Invalid request to Claude API');
    } else {
      throw new Error(`Claude generation failed: ${error.message}`);
    }
  }
}

// ===== CODE EXTRACTION FUNCTION =====
function extractReactComponentCode(rawResponse) {
  try {
    // Look for TypeScript/TSX code blocks first
    const tsxMatches = rawResponse.match(/```(?:typescript|tsx|ts)\n([\s\S]*?)```/g);
    if (tsxMatches && tsxMatches.length > 0) {
      // Get the first (usually main) TypeScript code block
      let code = tsxMatches[0]
        .replace(/```(?:typescript|tsx|ts)\n/, '')
        .replace(/```$/, '')
        .trim();
      
      console.log('📦 Found TypeScript code block');
      return cleanupComponentCode(code);
    }
    
    // Fallback: Look for any code blocks
    const codeMatches = rawResponse.match(/```\w*\n([\s\S]*?)```/g);
    if (codeMatches && codeMatches.length > 0) {
      let code = codeMatches[0]
        .replace(/```\w*\n/, '')
        .replace(/```$/, '')
        .trim();
      
      console.log('📦 Found generic code block');
      return cleanupComponentCode(code);
    }
    
    // Last resort: Look for React component patterns in the raw text
    const reactMatches = rawResponse.match(/(?:import\s+React|const\s+\w+.*?:\s*React\.FC|function\s+\w+.*?\{)[\s\S]*?(?:export\s+default\s+\w+|}\s*;?\s*$)/);
    if (reactMatches) {
      console.log('📦 Found React component pattern in raw text');
      return cleanupComponentCode(reactMatches[0]);
    }
    
    // If no code blocks found, return a basic component template
    console.warn('⚠️ No code blocks found, generating basic component');
    return generateBasicComponent(rawResponse);
    
  } catch (error) {
    console.error('❌ Error extracting code:', error);
    return generateBasicComponent(rawResponse);
  }
}

// ===== CODE CLEANUP FUNCTION =====
function cleanupComponentCode(code) {
  // Remove any comments about usage or explanations at the top
  code = code.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  code = code.replace(/^\/\/.*\n/gm, '');
  
  // Ensure proper imports
  if (!code.includes('import React')) {
    code = "import React from 'react';\n\n" + code;
  }
  
  // Ensure proper export
  if (!code.includes('export default') && !code.includes('export {')) {
    // Try to find the component name and add export
    const componentMatch = code.match(/(?:const|function)\s+(\w+)/);
    if (componentMatch) {
      code += `\n\nexport default ${componentMatch[1]};`;
    }
  }
  
  return code.trim();
}

// ===== FALLBACK COMPONENT GENERATOR =====
function generateBasicComponent(description) {
  const componentName = 'GeneratedComponent';
  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

const ${componentName}: React.FC<${componentName}Props> = ({ className = '' }) => {
  return (
    <div className={\`p-4 border rounded-lg \${className}\`}>
      <h3 className="text-lg font-semibold mb-2">Generated Component</h3>
      <p className="text-gray-600">
        ${description.substring(0, 200).replace(/"/g, "'")}...
      </p>
    </div>
  );
};

export default ${componentName};`;
}

// ===== PROMPT BUILDER FUNCTION =====
function buildPromptForTask(task) {
  // For code generation tasks, use a smart React component prompt
  if (task.type === 'code_generation') {
    const componentName = task.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') + 'Component';
    
    return `You are an expert React/TypeScript developer. Your task is to create a React component based on the user's request.

**User Request Analysis:**
Title: "${task.title}"
Description: "${task.description}"
Additional Requirements: "${task.prompt}"

**Chain of Thought - Analyze what the user wants:**
1. Look at the title and description to understand the ACTUAL component they want
2. If they say "Create New [X]", they want an actual [X] component, not a tool for creating [X]
3. Consider the context and description to determine the component's purpose
4. Think about what props, styling, and functionality this component should have

**Examples of Good Interpretation:**
- "Create New Header" + "Navigation bar" → Build an actual header/navigation component
- "Blue Button" + "Call to action" → Build an actual button component with blue styling  
- "User Card" + "Display user info" → Build an actual card that displays user information
- "Contact Form" + "Email form" → Build an actual form component for contact

**Component Requirements:**
- Component name must be exactly: ${componentName}
- Use React functional components with TypeScript
- Include proper TypeScript interfaces for props
- Use Tailwind CSS for styling
- Make it reusable and well-structured
- Include sensible default props where appropriate
- Add hover effects and interactive states where relevant

**Output Format:**
Provide ONLY the complete React component code in a TypeScript code block. No explanations, no usage examples, no additional text - just the clean, production-ready component code.

Now create the component based on your analysis of what the user actually wants:`;
  }

  // Keep existing logic for other task types
  const promptTemplates = {
    text_generation: `You are a skilled content writer. Create engaging, high-quality content based on this request:

**Title:** ${task.title}
**Description:** ${task.description}
**Requirements:** ${task.prompt}

Please provide:
1. Well-structured, engaging content
2. Appropriate tone and style for the context
3. Clear, concise writing that meets the requirements
4. Proper formatting where relevant

Create content that fully addresses the request with creativity and expertise.`,

    image_generation: `You are an expert at describing visual content. Since this is an image generation request but I can only provide text, please create a detailed description:

**Title:** ${task.title}
**Description:** ${task.description}
**Requirements:** ${task.prompt}

Please provide:
1. A detailed visual description of what the image should contain
2. Specific details about composition, colors, style, and mood
3. Technical specifications if relevant (dimensions, format, etc.)
4. Any additional creative suggestions

Create a comprehensive description that could be used by an artist or image generation AI.`
  };

  // Get the appropriate template or use text_generation as default
  const template = promptTemplates[task.type] || promptTemplates.text_generation;
  
  // Add any metadata context if available
  let enhancedPrompt = template;
  
  if (task.metadata && Object.keys(task.metadata).length > 0) {
    enhancedPrompt += `\n\n**Additional Context:**\n`;
    for (const [key, value] of Object.entries(task.metadata)) {
      enhancedPrompt += `- ${key}: ${value}\n`;
    }
  }
  
  // Add user context if available
  if (task.createdBy && task.createdBy !== 'anonymous') {
    enhancedPrompt += `\n**Created by:** ${task.createdBy}`;
  }
  
  return enhancedPrompt;
}