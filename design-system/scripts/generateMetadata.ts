/**
 * Script to generate component metadata JSON files
 * Run with: npx tsx scripts/generateMetadata.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ComponentMetadata } from '../src/utils/componentMetadata';
import { parseComponentFile, extractComponentDescription, extractMUIComponent } from '../src/utils/componentParser';
import { getMUIReplacement } from '../src/utils/componentMetadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

interface ComponentInfo {
  name: string;
  category: 'atom' | 'molecule' | 'organism';
  path: string;
}

/**
 * Find all component directories
 */
function findComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  const categories: ('atoms' | 'molecules' | 'organisms')[] = ['atoms', 'molecules', 'organisms'];
  
  categories.forEach(category => {
    const categoryPath = path.join(rootDir, 'src', 'components', category);
    if (!fs.existsSync(categoryPath)) return;
    
    const dirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    dirs.forEach(componentName => {
      const componentPath = path.join(categoryPath, componentName, `${componentName}.tsx`);
      if (fs.existsSync(componentPath)) {
        components.push({
          name: componentName,
          category: category === 'atoms' ? 'atom' : category === 'molecules' ? 'molecule' : 'organism',
          path: componentPath,
        });
      }
    });
  });
  
  return components;
}

/**
 * Generate metadata for a component
 */
function generateComponentMetadata(component: ComponentInfo): ComponentMetadata {
  const tsxPath = component.path;
  const content = fs.readFileSync(tsxPath, 'utf-8');
  
  // Parse basic info
  const parsed = parseComponentFile(tsxPath, component.name, component.category);
  const description = extractComponentDescription(content) || parsed.description || '';
  const muiComponent = extractMUIComponent(content) || parsed.muiComponent;
  
  // Read stories file if it exists
  const storiesPath = tsxPath.replace('.tsx', '.stories.tsx');
  let examples: ComponentMetadata['examples'] = [];
  if (fs.existsSync(storiesPath)) {
    const storiesContent = fs.readFileSync(storiesPath, 'utf-8');
    // Extract story examples (simplified - in production, parse more thoroughly)
    const storyMatches = storiesContent.matchAll(/export\s+const\s+(\w+):\s*Story\s*=\s*\{([^}]+)\}/g);
    for (const match of storyMatches) {
      const storyName = match[1];
      const storyBody = match[2];
      // Try to extract args
      const argsMatch = storyBody.match(/args:\s*\{([^}]+)\}/);
      if (argsMatch) {
        examples.push({
          title: storyName,
          description: `Example: ${storyName}`,
          code: `// ${storyName} example\n<${component.name} {...args} />`,
        });
      }
    }
  }
  
  // Create migration example if MUI component exists
  const migrationExamples = muiComponent ? [{
    mui: `import { ${muiComponent} } from '@mui/material';\n<${muiComponent} />`,
    designSystem: `import { ${component.name} } from '@/components';\n<${component.name} />`,
    description: `Replace MUI ${muiComponent} with ${component.name}`,
  }] : undefined;
  
  return {
    name: component.name,
    displayName: component.name,
    category: component.category,
    description,
    muiComponent,
    muiPackage: muiComponent ? '@mui/material' : undefined,
    props: parsed.props || [],
    examples: examples.length > 0 ? examples : [{
      title: 'Basic Usage',
      description: `Basic usage of ${component.name}`,
      code: `import { ${component.name} } from '@/components';\n\n<${component.name} />`,
    }],
    migrationExamples,
    importPath: parsed.importPath || `@/components/${component.category === 'atom' ? 'atoms' : component.category === 'molecule' ? 'molecules' : 'organisms'}/${component.name}`,
    exportPath: parsed.exportPath || '@/components',
  };
}

/**
 * Main function
 */
function main() {
  console.log('Generating component metadata files...');
  
  const components = findComponents();
  console.log(`Found ${components.length} components`);
  
  components.forEach(component => {
    try {
      const metadata = generateComponentMetadata(component);
      const outputPath = path.join(
        path.dirname(component.path),
        `${component.name}.meta.json`
      );
      
      fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf-8');
      console.log(`✓ Generated metadata for ${component.name}`);
    } catch (error) {
      console.error(`✗ Error generating metadata for ${component.name}:`, error);
    }
  });
  
  console.log('\nDone!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateComponentMetadata, findComponents };



