#!/usr/bin/env node

/**
 * Script to generate metadata files for all components
 * Run with: npx tsx scripts/generateAllMetadata.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ComponentMetadata } from '../src/utils/componentMetadata.js';
import { findComponents, generateComponentMetadata } from './generateMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Load existing metadata or create new
 */
function loadOrCreateMetadata(componentName: string, category: string): Partial<ComponentMetadata> {
  const categoryPath = category === 'atom' ? 'atoms' : category === 'molecule' ? 'molecules' : 'organisms';
  const metaPath = path.join(rootDir, 'src', 'components', categoryPath, componentName, `${componentName}.meta.json`);
  
  if (fs.existsSync(metaPath)) {
    try {
      const content = fs.readFileSync(metaPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Error loading existing metadata for ${componentName}, creating new`);
    }
  }
  
  return {};
}

/**
 * Main function
 */
async function main() {
  console.log('Generating component metadata files...\n');
  
  const components = findComponents();
  console.log(`Found ${components.length} components\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const component of components) {
    try {
      // Load existing metadata to preserve custom fields
      const existing = loadOrCreateMetadata(component.name, component.category);
      
      // Generate new metadata
      const metadata = generateComponentMetadata(component);
      
      // Merge with existing (preserve custom fields like usageGuidelines, accessibility)
      const merged: ComponentMetadata = {
        ...metadata,
        ...existing,
        // Override with new generated fields
        name: metadata.name,
        displayName: metadata.displayName,
        category: metadata.category,
        description: existing.description || metadata.description,
        muiComponent: metadata.muiComponent || existing.muiComponent,
        muiPackage: metadata.muiPackage || existing.muiPackage,
        props: metadata.props.length > 0 ? metadata.props : existing.props || [],
        examples: metadata.examples.length > 0 ? metadata.examples : existing.examples || [],
        migrationExamples: metadata.migrationExamples || existing.migrationExamples,
        importPath: metadata.importPath,
        exportPath: metadata.exportPath,
        // Preserve custom fields
        relatedComponents: existing.relatedComponents || metadata.relatedComponents,
        accessibility: existing.accessibility || metadata.accessibility,
        usageGuidelines: existing.usageGuidelines || metadata.usageGuidelines,
      };
      
      const outputPath = path.join(
        path.dirname(component.path),
        `${component.name}.meta.json`
      );
      
      fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
      console.log(`✓ ${component.name} (${component.category})`);
      successCount++;
    } catch (error) {
      console.error(`✗ ${component.name}: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
    }
  }
  
  console.log(`\n✅ Generated ${successCount} metadata files`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} errors`);
  }
  console.log('\nDone!');
}

main().catch(console.error);



