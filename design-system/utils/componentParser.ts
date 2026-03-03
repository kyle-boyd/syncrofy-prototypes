/**
 * Component parser utilities for extracting metadata from TSX component files.
 * Uses regex-based parsing to extract prop interfaces, JSDoc descriptions,
 * and MUI component mappings without requiring the TypeScript compiler API.
 */

import * as fs from 'fs';
import { ComponentProp } from './componentMetadata';

export interface ParsedComponent {
  name: string;
  category: 'atom' | 'molecule' | 'organism';
  description: string;
  props: ComponentProp[];
  muiComponent?: string;
  importPath: string;
  exportPath: string;
}

/**
 * Parse a component TSX file and extract metadata
 */
export function parseComponentFile(
  filePath: string,
  componentName: string,
  category: 'atom' | 'molecule' | 'organism'
): ParsedComponent {
  const content = fs.readFileSync(filePath, 'utf-8');

  const description = extractComponentDescription(content) || '';
  const muiComponent = extractMUIComponent(content) || undefined;
  const props = extractProps(content, componentName);
  const categoryPlural =
    category === 'atom' ? 'atoms' : category === 'molecule' ? 'molecules' : 'organisms';

  return {
    name: componentName,
    category,
    description,
    props,
    muiComponent,
    importPath: `@/components/${categoryPlural}/${componentName}`,
    exportPath: '@/components',
  };
}

/**
 * Extract the main component description from a JSDoc comment
 * above the component declaration or the Props interface.
 */
export function extractComponentDescription(content: string): string | null {
  // Match JSDoc comment immediately before `export const ComponentName` or `export function ComponentName`
  const componentDocMatch = content.match(
    /\/\*\*\s*\n([\s\S]*?)\*\/\s*\nexport\s+(?:const|function)\s+\w+/
  );
  if (componentDocMatch) {
    return cleanJSDoc(componentDocMatch[1]);
  }

  // Match JSDoc above the Props interface
  const propsDocMatch = content.match(
    /\/\*\*\s*\n([\s\S]*?)\*\/\s*\nexport\s+interface\s+\w+Props/
  );
  if (propsDocMatch) {
    return cleanJSDoc(propsDocMatch[1]);
  }

  return null;
}

/**
 * Extract the MUI component name that this component wraps
 */
export function extractMUIComponent(content: string): string | null {
  // Match: import MuiComponentName from '@mui/material/ComponentName'
  const defaultImportMatch = content.match(
    /import\s+Mui(\w+).*?from\s+['"]@mui\/material\/(\w+)['"]/
  );
  if (defaultImportMatch) {
    return defaultImportMatch[2];
  }

  // Match: import { ComponentName as MuiComponentName } from '@mui/material'
  const namedImportMatch = content.match(
    /import\s+\{[^}]*?(\w+)\s+as\s+Mui\w+[^}]*?\}\s+from\s+['"]@mui\/material['"]/
  );
  if (namedImportMatch) {
    return namedImportMatch[1];
  }

  // Match: import { Table as MuiTable } or similar destructured pattern
  const destructuredMatch = content.match(
    /import\s+\{\s*(\w+)\s+as\s+Mui\w+/
  );
  if (destructuredMatch) {
    return destructuredMatch[1];
  }

  // Match direct usage of MUI components: <MuiButton, <MuiSwitch, etc.
  const usageMatch = content.match(/<Mui(\w+)/);
  if (usageMatch) {
    return usageMatch[1];
  }

  return null;
}

/**
 * Extract props from the component's Props interface definition.
 * Handles JSDoc comments above each prop and type annotations.
 */
function extractProps(content: string, componentName: string): ComponentProp[] {
  const props: ComponentProp[] = [];

  // Find the Props interface for this component
  const interfaceRegex = new RegExp(
    `export\\s+interface\\s+${componentName}Props[^{]*\\{([\\s\\S]*?)^\\}`,
    'm'
  );
  const interfaceMatch = content.match(interfaceRegex);
  if (!interfaceMatch) return props;

  const interfaceBody = interfaceMatch[1];

  // Match each prop: optional JSDoc + prop declaration
  const propRegex =
    /(?:\/\*\*\s*\n([\s\S]*?)\*\/\s*\n\s*)?(\w+)(\??):\s*([^;]+);/g;

  let match;
  while ((match = propRegex.exec(interfaceBody)) !== null) {
    const jsDoc = match[1] ? cleanJSDoc(match[1]) : '';
    const name = match[2];
    const isOptional = match[3] === '?';
    let rawType = match[4].trim();

    // Skip inherited BaseComponentProps fields
    if (name === 'className' || name === 'data-testid') continue;

    // Clean up multi-line types
    rawType = rawType.replace(/\s+/g, ' ').trim();

    // Extract default value from JSDoc @default tag
    let defaultValue: any = undefined;
    const defaultMatch = jsDoc.match(/@default\s+(\S+)/);
    if (defaultMatch) {
      defaultValue = parseDefaultValue(defaultMatch[1]);
    }

    // Also check component destructuring for defaults
    if (defaultValue === undefined) {
      defaultValue = extractDefaultFromDestructuring(content, name);
    }

    props.push({
      name,
      type: rawType,
      required: !isOptional,
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      description: jsDoc.replace(/@default\s+\S+/, '').trim(),
    });
  }

  return props;
}

/**
 * Extract default values from component parameter destructuring.
 * e.g., `{ size = 'medium', loading = true, ...props }` -> { size: 'medium', loading: true }
 */
function extractDefaultFromDestructuring(content: string, propName: string): any {
  // Match destructuring in component definition
  const destructRegex = new RegExp(
    `${propName}\\s*=\\s*(['"]([^'"]*)['""]|true|false|\\d+(?:\\.\\d+)?|null|undefined)`,
    'g'
  );
  const match = destructRegex.exec(content);
  if (match) {
    return parseDefaultValue(match[1]);
  }
  return undefined;
}

/**
 * Parse a string representation of a default value
 */
function parseDefaultValue(raw: string): any {
  const trimmed = raw.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (trimmed === 'undefined') return undefined;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return parseFloat(trimmed);
  // Strip surrounding quotes
  const strMatch = trimmed.match(/^['"](.*)['"]$/);
  if (strMatch) return strMatch[1];
  return trimmed;
}

/**
 * Clean JSDoc content: remove leading asterisks and whitespace
 */
function cleanJSDoc(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0)
    .join(' ')
    .trim();
}
