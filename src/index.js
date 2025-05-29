// 🤖 AI GITHUB ACTIVITY SYSTEM - SIMPLE STARTER
// src/index.js

import 'dotenv/config';
import { Octokit } from "@octokit/rest";
import Anthropic from '@anthropic-ai/sdk';

// Initialize APIs
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Configuration
const CONFIG = {
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO
};

// 🧠 Generate AI Content
async function generateContent() {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  console.log(`🧠 Generating ${dayOfWeek} content...`);
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Create a brief, inspiring ${dayOfWeek} message for developers. Make it motivational and tech-related. Keep it under 100 words.`
      }]
    });
    
    return {
      content: response.content[0].text,
      date: today.toISOString().split('T')[0],
      dayOfWeek: dayOfWeek,
      timestamp: today.toISOString()
    };
    
  } catch (error) {
    console.error('❌ AI generation failed:', error.message);
    throw error;
  }
}

// 📝 Commit to GitHub
async function commitToGitHub(contentData) {
  console.log('📝 Committing to GitHub...');
  
  try {
    // Create content file
    const filePath = `content/${contentData.date}.json`;
    const fileContent = JSON.stringify(contentData, null, 2);
    const contentBase64 = Buffer.from(fileContent).toString('base64');
    
    // Try to get the current file (if it exists)
    let sha;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        path: filePath,
      });
      sha = data.sha;
    } catch (e) {
      // File doesn't exist yet, which is fine
      console.log(`Creating new file: ${filePath}`);
    }
    
    // Create or update the file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      path: filePath,
      message: `🤖 AI-generated content for ${contentData.date}`,
      content: contentBase64,
      ...(sha && { sha }), // Only include sha if we have it
    });
    
    console.log(`✅ Successfully committed: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error('❌ GitHub commit failed:', error.message);
    throw error;
  }
}

// 🚀 Main Function
async function run() {
  console.log('🚀 AI GitHub Activity System Starting...\n');
  
  try {
    // Step 1: Generate content
    const content = await generateContent();
    console.log(`✨ Generated: "${content.content.substring(0, 50)}..."\n`);
    
    // Step 2: Commit to GitHub
    await commitToGitHub(content);
    
    console.log('\n🎉 Success! Check your GitHub repo for the new commit!');
    console.log(`📊 Content created for ${content.dayOfWeek}, ${content.date}`);
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    console.log('\n🔧 Check your .env file and make sure:');
    console.log('   - ANTHROPIC_API_KEY is correct');
    console.log('   - GITHUB_TOKEN has repo permissions');
    console.log('   - GITHUB_OWNER and GITHUB_REPO are correct');
    console.log('   - The repository exists on GitHub');
  }
}

// Run if called directly
if (import.meta.url === new URL(import.meta.url).href) {
  run();
}

export { run, generateContent, commitToGitHub };