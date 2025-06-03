import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

export class FileSystemService {
  
  static getReactProjectPath() {
    return path.resolve(process.env.REACT_PROJECT_PATH || '../ai-experiment-site');
  }
  
  static getGeneratedComponentsPath() {
    return path.join(this.getReactProjectPath(), 'src', 'components', 'generated');
  }

  static getGenerationPagePath() {
    return path.join(this.getReactProjectPath(), 'src', 'pages', 'GenerationPage.jsx');
  }
  
  // Create the generated components directory if it doesn't exist
  static async ensureGeneratedDir() {
    const generatedPath = this.getGeneratedComponentsPath();
    try {
      await fs.access(generatedPath);
      console.log('✅ Generated components directory exists');
    } catch {
      await fs.mkdir(generatedPath, { recursive: true });
      console.log('✅ Created generated components directory');
    }
  }
  
  // Write component file to React project
  static async writeComponentFile(filename, content) {
    await this.ensureGeneratedDir();
    
    const filePath = path.join(this.getGeneratedComponentsPath(), filename);
    await fs.writeFile(filePath, content, 'utf8');
    
    console.log(`✅ Component written to: ${filePath}`);
    return filePath;
  }
  
  // Update the exports index file
  static async updateExportsIndex() {
    const generatedPath = this.getGeneratedComponentsPath();
    
    try {
      // Read all .tsx files in generated directory
      const files = await fs.readdir(generatedPath);
      const componentFiles = files.filter(file => file.endsWith('.tsx'));
      
      // Generate exports
      const exports = componentFiles.map(file => {
        const componentName = file.replace('.tsx', '');
        return `export { ${componentName} } from './${componentName}';`;
      }).join('\n');
      
      const indexContent = `// Auto-generated exports for generated components
// Generated on: ${new Date().toISOString()}
// Total components: ${componentFiles.length}

${exports}

// Usage example:
// import { HeaderComponent, ButtonComponent } from './components/generated';
`;
      
      const indexPath = path.join(generatedPath, 'index.ts');
      await fs.writeFile(indexPath, indexContent, 'utf8');
      
      console.log(`✅ Updated exports index with ${componentFiles.length} components`);
      return componentFiles.length;
    } catch (error) {
      console.error('❌ Failed to update exports index:', error);
      throw error;
    }
  }

  // NEW: Auto-inject component into GenerationPage.jsx
  static async injectComponentIntoGenerationPage(componentName, task) {
    try {
      const generationPagePath = this.getGenerationPagePath();
      
      // Read current GenerationPage.jsx
      const currentContent = await fs.readFile(generationPagePath, 'utf8');
      
      // Extract component name from filename
      const componentFileName = componentName.replace('.tsx', '');
      
      // Check if component is already imported
      if (currentContent.includes(`import { ${componentFileName} }`)) {
        console.log(`⚠️ Component ${componentFileName} already imported, skipping injection`);
        return;
      }
      
      // 1. Add import statement
      let updatedContent = currentContent;
      
      // Find existing generated imports or add new ones
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
      // Find the comment where we should inject components
      const injectionPoint = '        {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}';
      
      if (!updatedContent.includes(injectionPoint)) {
        // If injection point doesn't exist, add it after the live preview section
        const livePreviewEnd = '</div>\n         )}';
        if (updatedContent.includes(livePreviewEnd)) {
          updatedContent = updatedContent.replace(
            livePreviewEnd,
            `${livePreviewEnd}\n\n        {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}`
          );
        }
      }
      
      // Create component JSX with sample props
      const sampleProps = this.generateSampleProps(componentFileName, task);
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
      
      // 3. Write updated file
      await fs.writeFile(generationPagePath, updatedContent, 'utf8');
      
      console.log(`✅ Component ${componentFileName} auto-injected into GenerationPage.jsx`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to inject component into GenerationPage:', error);
      return false;
    }
  }

  // Generate sample props for different component types
  static generateSampleProps(componentName, task) {
    const name = componentName.toLowerCase();
    
    if (name.includes('header')) {
      return ` 
        title="Auto-Generated Header!" 
        subtitle="${task.description}"`;
    } else if (name.includes('button')) {
      return ` 
        variant="primary"
        size="md">
        Click Me!
      </${componentName}`;
    } else if (name.includes('card')) {
      return ` 
        title="${task.title}"
        shadow="md">
        <p>This is auto-generated content!</p>
      </${componentName}`;
    } else {
      return ` title="${task.title}"`;
    }
  }
  
  // Check if component already exists
  static async componentExists(filename) {
    const filePath = path.join(this.getGeneratedComponentsPath(), filename);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  // Handle naming conflicts
  static async resolveComponentName(originalFilename) {
    let filename = originalFilename;
    let counter = 1;
    
    while (await this.componentExists(filename)) {
      const baseName = originalFilename.replace('.tsx', '');
      filename = `${baseName}_${counter}.tsx`;
      counter++;
      console.log(`⚠️ Naming conflict resolved: ${originalFilename} → ${filename}`);
    }
    
    return filename;
  }
  
  // Auto-commit and push to git (for production deployment)
  static async deployToProduction(componentInfo) {
    if (process.env.ENABLE_PRODUCTION_DEPLOY !== 'true') {
      console.log('📝 Production deployment disabled in environment');
      return;
    }
    
    const reactProjectPath = this.getReactProjectPath();
    
    try {
      console.log('🚀 Starting production deployment...');
      
      // Check git status
      const status = execSync('git status --porcelain', { 
        cwd: reactProjectPath, 
        encoding: 'utf8' 
      });
      
      if (!status.trim()) {
        console.log('📝 No changes to commit');
        return;
      }
      
      // Add files (including GenerationPage.jsx)
      execSync('git add src/components/generated/ src/pages/GenerationPage.jsx', { cwd: reactProjectPath });
      console.log('✅ Files staged for commit');
      
      // Commit
      const commitMessage = `Auto-deploy: ${componentInfo.title} (${componentInfo.filename})`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: reactProjectPath });
      console.log('✅ Changes committed');
      
      // Push
      execSync('git push origin main', { cwd: reactProjectPath });
      console.log('✅ Changes pushed to remote');
      
      console.log('🚀 Production deployment completed!');
      
      return {
        deployed: true,
        commitMessage,
        deployedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Production deployment failed:', error.message);
      
      // Return error info instead of throwing
      return {
        deployed: false,
        error: error.message,
        attemptedAt: new Date().toISOString()
      };
    }
  }
  
  // Validate React project structure
  static async validateReactProject() {
    const reactPath = this.getReactProjectPath();
    
    try {
      // Check if it's a React project
      const packageJsonPath = path.join(reactPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      const isReactProject = packageJson.dependencies?.react || packageJson.devDependencies?.react;
      
      if (!isReactProject) {
        throw new Error('Target directory is not a React project');
      }
      
      // Check src directory exists
      const srcPath = path.join(reactPath, 'src');
      await fs.access(srcPath);
      
      console.log('✅ React project structure validated');
      return true;
      
    } catch (error) {
      console.error('❌ React project validation failed:', error.message);
      throw new Error(`Invalid React project at ${reactPath}: ${error.message}`);
    }
  }
} 