/**
 * Shared utilities for loading and querying design system data.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ComponentMetadata {
  name: string;
  displayName: string;
  category: 'atom' | 'molecule' | 'organism';
  description: string;
  muiComponent?: string;
  muiPackage?: string;
  props: ComponentProp[];
  examples: ComponentExample[];
  migrationExamples?: MigrationExample[];
  relatedComponents?: string[];
  accessibility?: {
    ariaAttributes?: string[];
    keyboardNavigation?: string;
    screenReaderNotes?: string;
  };
  usageGuidelines?: {
    whenToUse: string[];
    whenNotToUse: string[];
    bestPractices: string[];
    commonPatterns: string[];
  };
  importPath: string;
  exportPath: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
}

export interface MigrationExample {
  mui: string;
  designSystem: string;
  description: string;
}

export interface ComponentRegistryEntry {
  name: string;
  displayName: string;
  category: string;
  path: string;
  metadataFile: string;
  muiComponent: string | null;
  status: string;
}

export interface ComponentRegistry {
  $description: string;
  version: string;
  totalComponents: number;
  categories: Record<string, number>;
  components: ComponentRegistryEntry[];
}

/**
 * Resolve the root path of the design system project
 */
function getProjectRoot(): string {
  return path.resolve(__dirname, '..', '..');
}

/**
 * Load the design tokens JSON
 */
export function loadTokens(): Record<string, any> {
  const tokensPath = path.join(getProjectRoot(), 'src', 'tokens', 'tokens.json');
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`Tokens file not found: ${tokensPath}`);
  }
  return JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
}

/**
 * Load the component registry
 */
export function loadRegistry(): ComponentRegistry {
  const registryPath = path.join(getProjectRoot(), 'src', 'tokens', 'components-registry.json');
  if (!fs.existsSync(registryPath)) {
    throw new Error(`Component registry not found: ${registryPath}`);
  }
  return JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

/**
 * Load metadata for a single component by name
 */
export function loadComponentMetadata(componentName: string): ComponentMetadata | null {
  const registry = loadRegistry();
  const entry = registry.components.find(
    (c) => c.name.toLowerCase() === componentName.toLowerCase()
  );
  if (!entry) return null;

  const metaPath = path.join(getProjectRoot(), entry.path, entry.metadataFile);
  if (!fs.existsSync(metaPath)) return null;

  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
}

/**
 * Load all component metadata files
 */
export function loadAllComponentMetadata(): ComponentMetadata[] {
  const registry = loadRegistry();
  const metadata: ComponentMetadata[] = [];

  for (const entry of registry.components) {
    const metaPath = path.join(getProjectRoot(), entry.path, entry.metadataFile);
    if (fs.existsSync(metaPath)) {
      try {
        metadata.push(JSON.parse(fs.readFileSync(metaPath, 'utf-8')));
      } catch {
        // skip invalid files
      }
    }
  }

  return metadata;
}

/**
 * Load components by category
 */
export function loadComponentsByCategory(
  category: 'atom' | 'molecule' | 'organism'
): ComponentMetadata[] {
  return loadAllComponentMetadata().filter((c) => c.category === category);
}

/**
 * Search components by name, description, or use case
 */
export function searchComponents(
  query: string,
  category?: string
): ComponentMetadata[] {
  const all = loadAllComponentMetadata();
  const q = query.toLowerCase();

  return all.filter((c) => {
    if (category && c.category !== category) return false;

    const matchesName = c.name.toLowerCase().includes(q);
    const matchesDisplay = c.displayName.toLowerCase().includes(q);
    const matchesDesc = c.description.toLowerCase().includes(q);
    const matchesMui = c.muiComponent?.toLowerCase().includes(q) || false;
    const matchesProps = c.props.some(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    const matchesUsage =
      c.usageGuidelines?.whenToUse?.some((u) =>
        u.toLowerCase().includes(q)
      ) || false;

    return (
      matchesName ||
      matchesDisplay ||
      matchesDesc ||
      matchesMui ||
      matchesProps ||
      matchesUsage
    );
  });
}

/**
 * MUI component to design system component mapping
 */
export function getMuiMapping(): Record<string, { component: string; category: string }> {
  const registry = loadRegistry();
  const mapping: Record<string, { component: string; category: string }> = {};

  for (const entry of registry.components) {
    if (entry.muiComponent) {
      mapping[entry.muiComponent] = {
        component: entry.name,
        category: entry.category,
      };
    }
  }

  return mapping;
}
