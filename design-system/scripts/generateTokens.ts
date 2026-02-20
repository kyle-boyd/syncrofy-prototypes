#!/usr/bin/env node

/**
 * Script to generate tokens.json from the TypeScript theme files.
 * Keeps the DTCG-format token file in sync with the source-of-truth theme.
 *
 * Run with: npx tsx scripts/generateTokens.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import theme sources (dynamic import to handle TS)
async function loadThemeSources() {
  const palettePath = path.join(rootDir, 'src', 'theme', 'palette.ts');
  const typographyPath = path.join(rootDir, 'src', 'theme', 'typography.ts');
  const themeIndexPath = path.join(rootDir, 'src', 'theme', 'index.ts');

  const paletteContent = fs.readFileSync(palettePath, 'utf-8');
  const typographyContent = fs.readFileSync(typographyPath, 'utf-8');
  const themeContent = fs.readFileSync(themeIndexPath, 'utf-8');

  return { paletteContent, typographyContent, themeContent };
}

interface ColorToken {
  $value: string;
  $type: 'color';
  $description?: string;
}

interface DimensionToken {
  $value: string | number;
  $type: 'dimension' | 'fontWeight' | 'fontFamily' | 'shadow' | 'number' | 'other';
  $description?: string;
}

function extractPalette(content: string): Record<string, any> {
  const colors: Record<string, any> = {};

  const colorGroups = [
    { name: 'primary', description: 'Primary brand color' },
    { name: 'secondary', description: 'Secondary brand color' },
    { name: 'error', description: 'Error/destructive color' },
    { name: 'warning', description: 'Warning color' },
    { name: 'info', description: 'Informational color' },
    { name: 'success', description: 'Success color' },
  ];

  for (const group of colorGroups) {
    const regex = new RegExp(
      `${group.name}:\\s*\\{([^}]+)\\}`,
      's'
    );
    const match = content.match(regex);
    if (match) {
      const groupContent = match[1];
      const colorEntries: Record<string, ColorToken> = {};

      const propRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
      let propMatch;
      while ((propMatch = propRegex.exec(groupContent)) !== null) {
        const [, key, value] = propMatch;
        colorEntries[key] = {
          $value: value,
          $type: 'color',
          ...(key === 'main' ? { $description: group.description } : {}),
        };
      }
      colors[group.name] = colorEntries;
    }
  }

  // Extract grey scale
  const greyMatch = content.match(/grey:\s*\{([^}]+)\}/s);
  if (greyMatch) {
    const greyContent = greyMatch[1];
    const greyEntries: Record<string, ColorToken> = {};
    greyEntries.$description = 'Neutral grey scale' as any;
    const greyRegex = /(\d+):\s*['"]([^'"]+)['"]/g;
    let gm;
    while ((gm = greyRegex.exec(greyContent)) !== null) {
      greyEntries[gm[1]] = { $value: gm[2], $type: 'color' };
    }
    colors.grey = greyEntries;
  }

  // Extract text colors
  const textMatch = content.match(/text:\s*\{([^}]+)\}/s);
  if (textMatch) {
    const textContent = textMatch[1];
    const textEntries: Record<string, any> = { $description: 'Text color tokens' };
    const textRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
    let tm;
    while ((tm = textRegex.exec(textContent)) !== null) {
      textEntries[tm[1]] = { $value: tm[2], $type: 'color' };
    }
    colors.text = textEntries;
  }

  // Extract background colors
  const bgMatch = content.match(/background:\s*\{([^}]+)\}/s);
  if (bgMatch) {
    const bgContent = bgMatch[1];
    const bgEntries: Record<string, any> = { $description: 'Background color tokens' };
    const bgRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
    let bm;
    while ((bm = bgRegex.exec(bgContent)) !== null) {
      bgEntries[bm[1]] = { $value: bm[2], $type: 'color' };
    }
    colors.background = bgEntries;
  }

  // Extract divider
  const dividerMatch = content.match(/divider:\s*['"]([^'"]+)['"]/);
  if (dividerMatch) {
    colors.divider = { $value: dividerMatch[1], $type: 'color', $description: 'Divider/border color' };
  }

  return colors;
}

function extractTypography(content: string): Record<string, any> {
  const typo: Record<string, any> = { $description: 'Typography scale tokens' };

  // Extract base font family
  const fontFamilyMatch = content.match(/fontFamily:\s*['"]([^'"]+)['"]/);
  if (fontFamilyMatch) {
    typo.fontFamily = {
      base: {
        $value: fontFamilyMatch[1],
        $type: 'fontFamily',
        $description: 'Base font family for the entire design system',
      },
    };
  }

  // Extract typography variants
  const variants = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'body1', 'body2', 'body2Medium', 'body2Bold',
    'subtitle1', 'subtitle2', 'overline', 'caption', 'button',
  ];

  for (const variant of variants) {
    const regex = new RegExp(`${variant}:\\s*\\{([^}]+)\\}`, 's');
    const match = content.match(regex);
    if (match) {
      const variantContent = match[1];
      const entry: Record<string, any> = {};

      // fontSize
      const fsMatch = variantContent.match(/fontSize:\s*['"]([^'"]+)['"]/);
      if (fsMatch) entry.fontSize = { $value: fsMatch[1], $type: 'dimension' };

      // fontWeight
      const fwMatch = variantContent.match(/fontWeight:\s*(\d+)/);
      if (fwMatch) entry.fontWeight = { $value: parseInt(fwMatch[1]), $type: 'fontWeight' };

      // lineHeight
      const lhMatch = variantContent.match(/lineHeight:\s*['"]?([^'",\s]+)['"]?/);
      if (lhMatch) {
        const lhVal = lhMatch[1];
        entry.lineHeight = {
          $value: lhVal.includes('px') ? lhVal : parseFloat(lhVal),
          $type: lhVal.includes('px') ? 'dimension' : 'number',
        };
      }

      // letterSpacing
      const lsMatch = variantContent.match(/letterSpacing:\s*['"]([^'"]+)['"]/);
      if (lsMatch) entry.letterSpacing = { $value: lsMatch[1], $type: 'dimension' };

      // fontFamily
      const ffMatch = variantContent.match(/fontFamily:\s*['"]([^'"]+)['"]/);
      if (ffMatch) entry.fontFamily = { $value: ffMatch[1], $type: 'fontFamily' };

      // textTransform
      const ttMatch = variantContent.match(/textTransform:\s*['"]([^'"]+)['"]/);
      if (ttMatch) entry.textTransform = { $value: ttMatch[1], $type: 'other' };

      typo[variant] = entry;
    }
  }

  return typo;
}

function extractShadows(content: string): Record<string, any> {
  const shadows: Record<string, any> = { $description: 'Elevation shadow tokens from Figma' };

  // Match shadow array entries
  const shadowArrayMatch = content.match(/const shadows\s*=\s*\[([\s\S]*?)\];/);
  if (shadowArrayMatch) {
    const shadowEntries = shadowArrayMatch[1];
    const shadowRegex = /'([^']*)'(?:,?\s*\/\/\s*(.*))?/g;
    let sm;
    let index = 0;
    while ((sm = shadowRegex.exec(shadowEntries)) !== null) {
      const value = sm[1];
      const comment = sm[2]?.trim() || '';
      const key = index === 0 ? 'none' : `elevation${index}`;
      shadows[key] = {
        $value: value,
        $type: 'shadow',
        ...(comment ? { $description: comment } : {}),
      };
      index++;
    }
  }

  return shadows;
}

async function main() {
  console.log('Generating design tokens from theme files...\n');

  const { paletteContent, typographyContent, themeContent } = await loadThemeSources();

  const tokens: Record<string, any> = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $description: 'Syncrofy Design System tokens in DTCG format',
  };

  // Extract color tokens
  tokens.color = { $description: 'Color palette tokens', ...extractPalette(paletteContent) };

  // Extract typography tokens
  tokens.typography = extractTypography(typographyContent);

  // Spacing (derived from theme spacing: 8)
  tokens.spacing = {
    $description: 'Spacing scale based on 8px base unit',
    base: { $value: '8px', $type: 'dimension', $description: 'Base spacing unit' },
    '0': { $value: '0px', $type: 'dimension' },
    '1': { $value: '8px', $type: 'dimension' },
    '2': { $value: '16px', $type: 'dimension' },
    '3': { $value: '24px', $type: 'dimension' },
    '4': { $value: '32px', $type: 'dimension' },
    '5': { $value: '40px', $type: 'dimension' },
    '6': { $value: '48px', $type: 'dimension' },
    '8': { $value: '64px', $type: 'dimension' },
    '10': { $value: '80px', $type: 'dimension' },
    '12': { $value: '96px', $type: 'dimension' },
  };

  // Border radius
  tokens.borderRadius = {
    $description: 'Border radius tokens',
    default: { $value: '8px', $type: 'dimension', $description: 'Default border radius' },
    small: { $value: '6px', $type: 'dimension', $description: 'Used for chips and small elements' },
    medium: { $value: '8px', $type: 'dimension', $description: 'Used for buttons, inputs, cards' },
    large: { $value: '12px', $type: 'dimension', $description: 'Used for dialogs and cards' },
    full: { $value: '100px', $type: 'dimension', $description: 'Used for avatars and circular elements' },
  };

  // Shadows
  tokens.shadows = extractShadows(themeContent);

  // Component-specific overrides
  tokens.componentOverrides = {
    $description: 'Component-specific design token overrides',
    button: {
      borderRadius: { $value: '8px', $type: 'dimension' },
      padding: {
        small: { $value: '6px 16px', $type: 'dimension' },
        medium: { $value: '10px 24px', $type: 'dimension' },
        large: { $value: '12px 32px', $type: 'dimension' },
      },
      fontSize: {
        small: { $value: '0.8125rem', $type: 'dimension' },
        medium: { $value: '0.9375rem', $type: 'dimension' },
        large: { $value: '1.05rem', $type: 'dimension' },
      },
    },
    input: {
      borderRadius: { $value: '8px', $type: 'dimension' },
      padding: { $value: '10px 14px', $type: 'dimension' },
      fontSize: { $value: '14px', $type: 'dimension' },
      lineHeight: { $value: '20px', $type: 'dimension' },
      borderWidth: { $value: '1px', $type: 'dimension' },
      focusBorderWidth: { $value: '1.5px', $type: 'dimension' },
    },
    card: {
      borderRadius: { $value: '12px', $type: 'dimension' },
      shadow: {
        $value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        $type: 'shadow',
      },
    },
    chip: { borderRadius: { $value: '6px', $type: 'dimension' } },
    dialog: { borderRadius: { $value: '12px', $type: 'dimension' } },
    avatar: { borderRadius: { $value: '100px', $type: 'dimension' } },
  };

  // Write output
  const outputPath = path.join(rootDir, 'src', 'tokens', 'tokens.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2) + '\n', 'utf-8');

  console.log(`Tokens written to ${path.relative(rootDir, outputPath)}`);
  console.log('Done!');
}

main().catch(console.error);
