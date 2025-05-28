# AI GitHub Activity Generator 🤖

An automated system that generates daily inspirational tech-related messages using Claude AI and commits them to your GitHub repository. Perfect for maintaining an active GitHub profile with meaningful, AI-generated content.

## Features ✨

- Daily AI-generated tech inspiration using Claude 3.5 Sonnet
- Automatic GitHub commits with formatted JSON content
- Easy setup with environment variables
- Modern ES Module architecture

## Prerequisites 📋

- Node.js (v14 or higher)
- GitHub account
- Anthropic API key (for Claude AI)
- GitHub personal access token

## Setup 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-github-activity.git
   cd ai-github-activity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GITHUB_TOKEN=your_github_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repository_name
   ```

## Usage 💻

Run the script manually:
```bash
node src/index.js
```

The script will:
1. Generate an inspirational tech-related message using Claude AI
2. Create a JSON file with the message and metadata
3. Commit the file to your specified GitHub repository

## File Structure 📁

- `src/index.js` - Main application logic
- `content/` - Generated content files (created automatically)
- `.env` - Environment variables (you need to create this)

## Environment Variables 🔑

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude AI
- `GITHUB_TOKEN`: GitHub personal access token with repo permissions
- `GITHUB_OWNER`: Your GitHub username
- `GITHUB_REPO`: Target repository name

## Contributing 🤝

Feel free to submit issues and enhancement requests! 