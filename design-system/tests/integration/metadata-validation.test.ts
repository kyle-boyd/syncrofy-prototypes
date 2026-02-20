/**
 * Integration tests to validate component metadata files, token JSON,
 * and the component registry for the MCP server.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const TOKENS_PATH = path.join(ROOT_DIR, 'src', 'tokens', 'tokens.json');
const REGISTRY_PATH = path.join(ROOT_DIR, 'src', 'tokens', 'components-registry.json');
const METADATA_SCHEMA_PATH = path.join(ROOT_DIR, 'src', 'tokens', 'component-metadata.schema.json');

// ---------- Token validation ----------

describe('Design Tokens (tokens.json)', () => {
  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(TOKENS_PATH)).toBe(true);
    const raw = fs.readFileSync(TOKENS_PATH, 'utf-8');
    const tokens = JSON.parse(raw);
    expect(tokens).toBeDefined();
  });

  it('should contain all required top-level categories', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    expect(tokens.color).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.borderRadius).toBeDefined();
    expect(tokens.shadows).toBeDefined();
  });

  it('should have correct primary color', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    expect(tokens.color.primary.main.$value).toBe('#266079');
    expect(tokens.color.primary.main.$type).toBe('color');
  });

  it('should have correct font family', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    expect(tokens.typography.fontFamily.base.$value).toBe('Geist, sans-serif');
  });

  it('should have spacing base unit of 8px', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    expect(tokens.spacing.base.$value).toBe('8px');
  });

  it('should have DTCG $type annotations on token values', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    expect(tokens.color.primary.main.$type).toBe('color');
    expect(tokens.typography.h1.fontSize.$type).toBe('dimension');
    expect(tokens.spacing.base.$type).toBe('dimension');
  });

  it('tokens should stay in sync with theme source files', () => {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    const paletteContent = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'theme', 'palette.ts'),
      'utf-8'
    );

    // Verify primary.main matches
    const primaryMatch = paletteContent.match(/main:\s*['"]([^'"]+)['"]/);
    expect(primaryMatch).toBeTruthy();
    expect(tokens.color.primary.main.$value).toBe(primaryMatch![1]);
  });
});

// ---------- Component Registry validation ----------

describe('Component Registry (components-registry.json)', () => {
  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(REGISTRY_PATH)).toBe(true);
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(raw);
    expect(registry).toBeDefined();
  });

  it('should have required structure', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    expect(registry.components).toBeInstanceOf(Array);
    expect(registry.totalComponents).toBeGreaterThan(0);
    expect(registry.categories).toBeDefined();
  });

  it('should list at least 30 components', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    expect(registry.components.length).toBeGreaterThanOrEqual(30);
    expect(registry.totalComponents).toBe(registry.components.length);
  });

  it('each component should have required fields', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    for (const component of registry.components) {
      expect(component.name).toBeTruthy();
      expect(component.displayName).toBeTruthy();
      expect(component.category).toMatch(/^(atom|molecule|organism)$/);
      expect(component.path).toBeTruthy();
      expect(component.metadataFile).toBeTruthy();
      expect(component.status).toBeTruthy();
    }
  });

  it('category counts should match component list', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    const atoms = registry.components.filter((c: any) => c.category === 'atom').length;
    const molecules = registry.components.filter((c: any) => c.category === 'molecule').length;
    const organisms = registry.components.filter((c: any) => c.category === 'organism').length;

    expect(registry.categories.atoms).toBe(atoms);
    expect(registry.categories.molecules).toBe(molecules);
    expect(registry.categories.organisms).toBe(organisms);
  });
});

// ---------- Component Metadata file validation ----------

describe('Component Metadata (.meta.json files)', () => {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  it('every registered component should have a .meta.json file', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      expect(
        fs.existsSync(metaPath),
        `Missing metadata for ${component.name}: ${metaPath}`
      ).toBe(true);
    }
  });

  it('every .meta.json file should be valid JSON', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const raw = fs.readFileSync(metaPath, 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });

  it('every .meta.json should have required fields', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      expect(meta.name, `${component.name}: missing name`).toBeTruthy();
      expect(meta.displayName, `${component.name}: missing displayName`).toBeTruthy();
      expect(meta.category, `${component.name}: missing category`).toMatch(
        /^(atom|molecule|organism)$/
      );
      expect(meta.description, `${component.name}: missing description`).toBeTruthy();
      expect(meta.props, `${component.name}: missing props`).toBeInstanceOf(Array);
      expect(meta.examples, `${component.name}: missing examples`).toBeInstanceOf(Array);
      expect(meta.importPath, `${component.name}: missing importPath`).toBeTruthy();
      expect(meta.exportPath, `${component.name}: missing exportPath`).toBeTruthy();
    }
  });

  it('props should have required fields', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      for (const prop of meta.props) {
        expect(prop.name, `${component.name}: prop missing name`).toBeTruthy();
        expect(prop.type, `${component.name}.${prop.name}: prop missing type`).toBeTruthy();
        expect(
          typeof prop.required,
          `${component.name}.${prop.name}: prop missing required`
        ).toBe('boolean');
        expect(
          prop.description,
          `${component.name}.${prop.name}: prop missing description`
        ).toBeTruthy();
      }
    }
  });

  it('examples should have required fields', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      for (const example of meta.examples) {
        expect(example.title, `${component.name}: example missing title`).toBeTruthy();
        expect(
          example.description,
          `${component.name}: example missing description`
        ).toBeTruthy();
        expect(example.code, `${component.name}: example missing code`).toBeTruthy();
      }
    }
  });

  it('component names in registry should match metadata names', () => {
    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      expect(meta.name).toBe(component.name);
    }
  });

  it('MUI-mapped components should have migrationExamples', () => {
    for (const component of registry.components) {
      if (!component.muiComponent) continue;
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      if (meta.muiComponent) {
        expect(
          meta.migrationExamples,
          `${component.name}: MUI-mapped component should have migrationExamples`
        ).toBeInstanceOf(Array);
        expect(meta.migrationExamples.length).toBeGreaterThan(0);
      }
    }
  });

  it('every .meta.json should validate against component-metadata.schema.json', () => {
    expect(fs.existsSync(METADATA_SCHEMA_PATH)).toBe(true);
    const schema = JSON.parse(fs.readFileSync(METADATA_SCHEMA_PATH, 'utf-8'));
    // Avoid meta-schema lookup for draft/2020-12; validate data only
    const ajv = new Ajv({ strict: false, validateSchema: false });
    const validate = ajv.compile(schema);

    for (const component of registry.components) {
      const metaPath = path.join(ROOT_DIR, component.path, component.metadataFile);
      if (!fs.existsSync(metaPath)) continue;
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const valid = validate(meta);
      expect(
        valid,
        `${component.name}: ${ajv.errorsText(validate.errors)}`
      ).toBe(true);
    }
  });
});

// ---------- Theme source file checks ----------

describe('Theme source files exist', () => {
  const themeFiles = [
    'src/theme/index.ts',
    'src/theme/palette.ts',
    'src/theme/typography.ts',
    'src/theme/components.ts',
  ];

  for (const file of themeFiles) {
    it(`${file} should exist`, () => {
      expect(fs.existsSync(path.join(ROOT_DIR, file))).toBe(true);
    });
  }
});
