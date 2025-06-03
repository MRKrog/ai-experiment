import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const modelAI = 'claude-3-haiku-20240307';

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
      // model: 'claude-3-5-sonnet-20241022', // better model
      // max_tokens: 2000, // Adjust based on your needs
      model: modelAI, // ~90% cheaper
      max_tokens: 1000, // Half the cost
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
    const generatedContent = response.content[0].text;
    console.log(`✅ Claude generated ${generatedContent.length} characters`);
    
    // 4. Return structured result
    return {
      content: generatedContent,
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

// ===== PROMPT BUILDER FUNCTION =====
function buildPromptForTask(task) {
  // Different prompt templates based on task type
  const promptTemplates = {
    
    code_generation: `You are an expert software developer. Create high-quality code based on this request:

**Title:** ${task.title}
**Description:** ${task.description}
**Requirements:** ${task.prompt}

Please provide:
1. Clean, well-commented code
2. Proper imports and exports if applicable
3. Following best practices for the technology stack
4. Include any necessary dependencies or setup instructions

Generate production-ready code that solves the specified requirements.`,

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