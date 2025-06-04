import { Octokit } from '@octokit/rest';

export class GitHubApiService {
  
  static getOctokit() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    return new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  static getRepoInfo() {
    return {
      owner: process.env.GITHUB_USERNAME || 'MRKrog',
      repo: process.env.GITHUB_REPO || 'ai-experiment'
    };
  }

  // Create or update a component file in GitHub
  static async createComponentFile(filename, content) {
    try {
      const octokit = this.getOctokit();
      const { owner, repo } = this.getRepoInfo();
      const path = `ai-experiment-site/src/components/generated/${filename}`;
      
      // Check if file already exists
      let sha = null;
      try {
        const existingFile = await octokit.rest.repos.getContent({
          owner,
          repo,
          path
        });
        sha = existingFile.data.sha;
        console.log(`⚠️ File ${filename} already exists, updating...`);
      } catch (error) {
        if (error.status !== 404) throw error;
        console.log(`✅ Creating new file ${filename}`);
      }

      // Create or update the file
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Auto-deploy component: ${filename}`,
        content: Buffer.from(content).toString('base64'),
        sha // Include SHA if updating existing file
      });

      console.log(`✅ Component ${filename} created/updated in GitHub`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to create component file in GitHub:', error);
      throw error;
    }
  }

  // Update the exports index file
  static async updateExportsIndex(componentFiles) {
    try {
      const octokit = this.getOctokit();
      const { owner, repo } = this.getRepoInfo();
      const path = 'ai-experiment-site/src/components/generated/index.ts';
      
      // Generate exports content
      const exports = componentFiles.map(file => {
        const componentName = file.replace('.tsx', '');
        return `export { default as ${componentName} } from './${componentName}';`;
      }).join('\n');
      
      const indexContent = `// Auto-generated exports for generated components
// Generated on: ${new Date().toISOString()}
// Total components: ${componentFiles.length}

${exports}

// Usage example:
// import { HeaderComponent, ButtonComponent } from './components/generated';
`;

      // Check if index file exists
      let sha = null;
      try {
        const existingFile = await octokit.rest.repos.getContent({
          owner,
          repo,
          path
        });
        sha = existingFile.data.sha;
      } catch (error) {
        if (error.status !== 404) throw error;
      }

      // Create or update index file
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Auto-update exports index (${componentFiles.length} components)`,
        content: Buffer.from(indexContent).toString('base64'),
        sha
      });

      console.log(`✅ Exports index updated with ${componentFiles.length} components`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update exports index in GitHub:', error);
      throw error;
    }
  }

  // Get list of existing component files
  static async getExistingComponents() {
    try {
      const octokit = this.getOctokit();
      const { owner, repo } = this.getRepoInfo();
      const path = 'ai-experiment-site/src/components/generated';
      
      try {
        const response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path
        });
        
        if (Array.isArray(response.data)) {
          return response.data
            .filter(file => file.name.endsWith('.tsx'))
            .map(file => file.name);
        }
        return [];
      } catch (error) {
        if (error.status === 404) {
          console.log('Generated components directory does not exist yet');
          return [];
        }
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Failed to get existing components:', error);
      return [];
    }
  }

  // Auto-inject component into GenerationPage.jsx
  static async injectComponentIntoGenerationPage(componentName, task) {
    try {
      const octokit = this.getOctokit();
      const { owner, repo } = this.getRepoInfo();
      const path = 'ai-experiment-site/src/pages/GenerationPage.jsx';
      
      // Get current GenerationPage content
      const currentFile = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
      });
      
      const currentContent = Buffer.from(currentFile.data.content, 'base64').toString('utf8');
      const componentFileName = componentName.replace('.tsx', '');
      
      // Check if component is already imported
      if (currentContent.includes(`import { ${componentFileName} }`)) {
        console.log(`⚠️ Component ${componentFileName} already imported, skipping injection`);
        return false;
      }
      
      // Get the component content for prop analysis
      let componentContent = '';
      try {
        const componentFile = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: `ai-experiment-site/src/components/generated/${componentName}`
        });
        componentContent = Buffer.from(componentFile.data.content, 'base64').toString('utf8');
      } catch (error) {
        console.warn('Could not get component content for prop analysis:', error.message);
      }
      
      let updatedContent = currentContent;
      
      // 1. Add import statement
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"`]\.\.\/components\/generated['"`];/;
      const importMatch = currentContent.match(importRegex);
      
      if (importMatch) {
        // Add to existing import
        const existingImports = importMatch[1].trim();
        const newImports = existingImports ? `${existingImports}, ${componentFileName}` : componentFileName;
        updatedContent = updatedContent.replace(
          importRegex,
          `import { ${newImports} } from '../components/generated';`
        );
      } else {
        // Add new import after existing imports
        const lastImportIndex = updatedContent.lastIndexOf("import ");
        const nextLineIndex = updatedContent.indexOf('\n', lastImportIndex);
        const importStatement = `import { ${componentFileName} } from '../components/generated';\n`;
        updatedContent = updatedContent.slice(0, nextLineIndex + 1) + importStatement + updatedContent.slice(nextLineIndex + 1);
      }
      
      // 2. Add component usage in JSX
      const injectionPoint = '          {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}';
      
      if (!updatedContent.includes(injectionPoint)) {
        console.log('⚠️ Injection point not found in GenerationPage.jsx');
        return false;
      }
      
      // Create component JSX with sample props
      const sampleProps = this.generateSampleProps(componentFileName, task, componentContent);
      const componentJSX = `
          {/* Auto-injected: ${task.title} */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">🎉 ${task.title}</h3>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="bg-white rounded-lg p-6 mb-4">
                <${componentFileName}${sampleProps} />
              </div>
              <p className="text-gray-400 text-sm">
                ↗️ Auto-generated: ${task.description}
              </p>
            </div>
          </div>`;
      
      // Inject the component
      updatedContent = updatedContent.replace(
        injectionPoint,
        `${injectionPoint}${componentJSX}\n`
      );
      
      // 3. Update file in GitHub
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Auto-inject component: ${task.title} (${componentFileName})`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: currentFile.data.sha
      });
      
      console.log(`✅ Component ${componentFileName} auto-injected into GenerationPage.jsx`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to inject component into GenerationPage:', error);
      return false;
    }
  }

  // Generate sample props for different component types
  static generateSampleProps(componentName, task, componentContent = '') {
    // Try to analyze the actual component content to determine props
    if (componentContent) {
      const propsAnalysis = this.analyzeComponentProps(componentContent);
      if (propsAnalysis) {
        return propsAnalysis;
      }
    }
    
    // Fallback to name-based detection
    const name = componentName.toLowerCase();
    
    if (name.includes('dropdown')) {
      return ` 
        title="Sample Dropdown">
        <div className="p-2">
          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 1</div>
          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 2</div>
          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Option 3</div>
        </div>
      </${componentName}`;
    } else if (name.includes('header')) {
      return ` 
        title="Auto-Generated Header!" 
        subtitle="${task.description}"`;
    } else if (name.includes('card')) {
      return ` 
        title="${task.title}"
        shadow="md">
        <p>This is auto-generated content!</p>
      </${componentName}`;
    } else {
      // Generic fallback - just use component as self-closing tag
      return ' ';
    }
  }

  // Analyze component content to determine what props it expects
  static analyzeComponentProps(componentContent) {
    try {
      // Look for interface definitions
      const interfaceMatch = componentContent.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
      if (interfaceMatch) {
        const propsDefinition = interfaceMatch[1];
        
        // Parse individual props
        const propLines = propsDefinition.split('\n').map(line => line.trim()).filter(line => line);
        const props = {};
        
        propLines.forEach(line => {
          // Match patterns like: label: string; or onClick?: () => void;
          const propMatch = line.match(/(\w+)\??:\s*([^;]+)/);
          if (propMatch) {
            const [, propName, propType] = propMatch;
            
            if (propType.includes('string')) {
              props[propName] = propName === 'label' ? 'Sample Button' : 'Sample Value';
            } else if (propType.includes('number')) {
              props[propName] = 1;
            } else if (propType.includes('boolean')) {
              props[propName] = true;
            } else if (propType.includes('() => void')) {
              props[propName] = '() => alert("Clicked!")';
            }
          }
        });
        
        // Generate JSX props
        if (Object.keys(props).length > 0) {
          const propStrings = Object.entries(props).map(([key, value]) => {
            if (typeof value === 'string' && !value.startsWith('()')) {
              return `${key}="${value}"`;
            } else {
              return `${key}={${value}}`;
            }
          });
          return ` ${propStrings.join(' ')}`;
        }
      }
      
      // If no interface found or no props, return empty (self-closing tag)
      return ' ';
      
    } catch (error) {
      console.error('Error analyzing component props:', error);
      return ' ';
    }
  }

  // Handle naming conflicts
  static async resolveComponentName(originalFilename) {
    const existingComponents = await this.getExistingComponents();
    
    let filename = originalFilename;
    let counter = 1;
    
    while (existingComponents.includes(filename)) {
      const baseName = originalFilename.replace('.tsx', '');
      filename = `${baseName}_${counter}.tsx`;
      counter++;
      console.log(`⚠️ Naming conflict resolved: ${originalFilename} → ${filename}`);
    }
    
    return filename;
  }

  // Main deployment function
  static async deployComponentToGitHub(componentData, task) {
    try {
      console.log('🚀 Starting GitHub deployment pipeline...');
      
      // 1. Resolve naming conflicts
      const finalFilename = await this.resolveComponentName(componentData.filename);
      
      // 2. Create component file
      await this.createComponentFile(finalFilename, componentData.content);
      
      // 3. Get all components and update exports
      const allComponents = await this.getExistingComponents();
      // Add the new component if it's not already in the list
      if (!allComponents.includes(finalFilename)) {
        allComponents.push(finalFilename);
      }
      await this.updateExportsIndex(allComponents);
      
      // 4. Inject component into GenerationPage
      const injectionSuccess = await this.injectComponentIntoGenerationPage(finalFilename, task);
      
      console.log(`✅ GitHub deployment completed for ${finalFilename}`);
      
      return {
        deployed: true,
        finalFilename,
        componentCount: allComponents.length,
        injectedIntoPage: injectionSuccess,
        deployedAt: new Date().toISOString(),
        deploymentType: 'github-api'
      };
      
    } catch (error) {
      console.error('❌ GitHub deployment failed:', error);
      return {
        deployed: false,
        error: error.message,
        attemptedAt: new Date().toISOString(),
        deploymentType: 'github-api'
      };
    }
  }
}