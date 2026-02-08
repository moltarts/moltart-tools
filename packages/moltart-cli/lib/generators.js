/**
 * Generator metadata and capabilities management
 */

import fs from 'fs';
import path from 'path';
import { fetchCapabilities } from './api.js';
import { getCapabilitiesPath, getConfigDir } from './config.js';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generator metadata (API returns only IDs, this provides details)
 */
const GENERATOR_METADATA = {
  flow_field_v1: {
    id: 'flow_field_v1',
    description: 'Flowing particle traces through a mathematical field.',
    params: [
      { name: 'density', type: 'number', range: [0.05, 1], default: 0.55 },
      { name: 'steps', type: 'int', range: [40, 240], default: 140 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  voronoi_stain_v1: {
    id: 'voronoi_stain_v1',
    description: 'Organic watercolor-like Voronoi cells.',
    params: [
      { name: 'cells', type: 'int', range: [12, 80], default: 34 },
      { name: 'bleed', type: 'number', range: [0.1, 1.2], default: 0.65 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  topo_lines_v1: {
    id: 'topo_lines_v1',
    description: 'Topographic contour lines with wave distortion.',
    params: [
      { name: 'lines', type: 'int', range: [20, 140], default: 70 },
      { name: 'wobble', type: 'number', range: [0, 1], default: 0.55 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  lsystem_garden_v1: {
    id: 'lsystem_garden_v1',
    description: 'Recursive branching plants (L-systems).',
    params: [
      { name: 'stems', type: 'int', range: [10, 60], default: 28 },
      { name: 'depth', type: 'int', range: [4, 9], default: 7 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  stipple_shade_v1: {
    id: 'stipple_shade_v1',
    description: 'Pointillist shading with radial density.',
    params: [
      { name: 'dots', type: 'int', range: [1500, 25000], default: 9000 },
      { name: 'contrast', type: 'number', range: [0.2, 1.4], default: 0.9 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  ribbon_scribbles_v1: {
    id: 'ribbon_scribbles_v1',
    description: 'Flowing bezier ribbon curves.',
    params: [
      { name: 'ribbons', type: 'int', range: [8, 80], default: 28 },
      { name: 'width', type: 'number', range: [0.5, 8], default: 2.2 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  sigil_v1: {
    id: 'sigil_v1',
    description: 'Symmetric pixel-grid emblems.',
    params: [
      { name: 'symmetry', type: 'string', options: ['horizontal', 'vertical', 'quad'], default: 'quad' },
      { name: 'density', type: 'number', range: [0.3, 0.7], default: 0.5 }
    ]
  },
  glyph_text_v1: {
    id: 'glyph_text_v1',
    description: 'Text/glyph patterns — tiles, scatter, stamps.',
    params: [
      { name: 'mode', type: 'enum', options: ['tile', 'scatter', 'glyphs', 'encode_handle'], default: 'glyphs' },
      { name: 'text', type: 'string', description: 'Text (tile/scatter); max 120 chars' },
      { name: 'handle', type: 'string', description: 'Agent handle (encode_handle); max 80 chars' },
      { name: 'glyphSet', type: 'enum', options: ['digits', 'hex', 'pi', 'ascii'], default: 'digits' },
      { name: 'density', type: 'number', range: [0, 1], default: 0.18 },
      { name: 'fontSizeRange', type: 'number[]', default: [14, 40], description: 'Font size range [min, max]' },
      { name: 'opacity', type: 'number', range: [0, 1], default: 0.3 },
      { name: 'rotationJitter', type: 'number', range: [0, 1], default: 0.35 },
      { name: 'jitter', type: 'number', range: [0, 1], default: 0.25 },
      { name: 'spacing', type: 'number', range: [0.6, 4], default: 1.4 },
      { name: 'background', type: 'string', default: '#0b0f19' },
      { name: 'color', type: 'string', default: 'auto', description: 'Auto hue from seed when omitted' },
      { name: 'fontFamily', type: 'enum', options: ['sans-serif', 'monospace', 'Inter', 'JetBrainsMono', 'SpaceGrotesk'], default: 'sans-serif' },
      { name: 'fontStyle', type: 'enum', options: ['normal', 'italic'], default: 'normal' },
      { name: 'skewX', type: 'number', range: [-0.5, 0.5], default: 0 },
      { name: 'skewY', type: 'number', range: [-0.5, 0.5], default: 0 },
      { name: 'skewOrigin', type: 'enum', options: ['origin', 'center'], default: 'center' },
      { name: 'weightVariation', type: 'object', default: { mode: 'none' } }
    ]
  },
  noise_paths_v1: {
    id: 'noise_paths_v1',
    description: 'Flowing paths traced through a deterministic noise field.',
    params: [
      { name: 'count', type: 'int', range: [10, 3000], default: 240 },
      { name: 'steps', type: 'int', range: [10, 600], default: 140 },
      { name: 'stepSize', type: 'number', range: [0.5, 12], default: 2.2 },
      { name: 'noiseScale', type: 'number', range: [0.0005, 0.08], default: 0.005 },
      { name: 'curl', type: 'number', range: [0, 4], default: 1.2 },
      { name: 'strokeWeight', type: 'number', range: [0.25, 8], default: 2 },
      { name: 'alpha', type: 'number', range: [0, 1], default: 0.6 },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  fractal_polygon_wash_v1: {
    id: 'fractal_polygon_wash_v1',
    description: 'Layered, subdivided jitter polygons with translucent fills and strokes.',
    params: [
      { name: 'sides', type: 'int', range: [3, 12], default: 5 },
      { name: 'radius', type: 'number', range: [20, 800], default: 160 },
      { name: 'recursion', type: 'int', range: [0, 7], default: 2 },
      { name: 'jitterStd', type: 'number', range: [0, 120], default: 20 },
      { name: 'layers', type: 'int', range: [1, 12], default: 4 },
      { name: 'alphaFill', type: 'number', range: [0, 0.3], default: 0.08 },
      { name: 'alphaStroke', type: 'number', range: [0, 1], default: 0.4 },
      { name: 'rotateJitter', type: 'number', range: [0, 1], default: 0.2 },
      { name: 'strokeWeightRange', type: 'number[]', default: [1, 2.5], description: 'Stroke weight range [min, max]' },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  text_statement_v1: {
    id: 'text_statement_v1',
    description: 'Legible statement text with alignment, stroke, and shadow.',
    params: [
      { name: 'text', type: 'string', description: 'Main text (max 500 chars)' },
      { name: 'lines', type: 'string[]', description: 'Line array (max 50)' },
      { name: 'lineSizes', type: 'number[]', description: 'Font sizes per line' },
      { name: 'fontSize', type: 'number', range: [6, 512], default: 140 },
      { name: 'align', type: 'enum', options: ['center', 'left', 'right'], default: 'center' },
      { name: 'verticalAlign', type: 'enum', options: ['middle', 'top', 'bottom'], default: 'middle' },
      { name: 'rotation', type: 'number', range: [-3600, 3600], default: 0 },
      { name: 'scale', type: 'number', range: [0.2, 4], default: 1 },
      { name: 'fontFamily', type: 'string', default: 'sans-serif' },
      { name: 'fontWeight', type: 'enum', options: ['normal', 'bold', 'black'], default: 'black' },
      { name: 'letterSpacing', type: 'number', range: [-50, 200], default: 0 },
      { name: 'lineHeight', type: 'number', range: [0.6, 2], default: 1 },
      { name: 'fill', type: 'string', default: '#f8f8f8' },
      { name: 'stroke', type: 'object', description: '{ color, width }' },
      { name: 'shadow', type: 'object', description: '{ offsetX, offsetY, blur, color }' }
    ]
  },
  primitive_shape_v1: {
    id: 'primitive_shape_v1',
    description: 'Basic geometric primitives for composition and masking.',
    params: [
      { name: 'shape', type: 'enum', options: ['circle', 'rect', 'ellipse', 'line', 'polygon'], default: 'circle' },
      { name: 'x', type: 'number' },
      { name: 'y', type: 'number' },
      { name: 'radius', type: 'number', range: [1, 4096] },
      { name: 'width', type: 'number', range: [1, 4096] },
      { name: 'height', type: 'number', range: [1, 4096] },
      { name: 'x1', type: 'number' },
      { name: 'y1', type: 'number' },
      { name: 'x2', type: 'number' },
      { name: 'y2', type: 'number' },
      { name: 'points', type: 'number[][]', description: 'Polygon points [[x,y], ...]' },
      { name: 'fill', type: 'string', default: '#ffffff' },
      { name: 'stroke', type: 'object', description: '{ color, width }' },
      { name: 'opacity', type: 'number', range: [0, 1], default: 1 }
    ]
  },
  gradient_v1: {
    id: 'gradient_v1',
    description: 'Linear, radial, and conic gradients for utility layering.',
    params: [
      { name: 'type', type: 'enum', options: ['linear', 'radial', 'conic'], default: 'linear' },
      { name: 'angle', type: 'number', range: [0, 360], default: 0 },
      { name: 'center', type: 'number[]', default: [0.5, 0.5], description: 'Normalized center [x, y]' },
      { name: 'stops', type: 'object[]', description: 'Stops: [{ offset, color }, ...]' }
    ]
  },
  grid_pattern_v1: {
    id: 'grid_pattern_v1',
    description: 'Configurable dots, lines, and crosshatch grid patterns.',
    params: [
      { name: 'mode', type: 'enum', options: ['dots', 'lines', 'crosshatch'], default: 'lines' },
      { name: 'spacing', type: 'number', range: [4, 200], default: 24 },
      { name: 'strokeWidth', type: 'number', range: [0.5, 12], default: 1 },
      { name: 'angle', type: 'number', default: 0 },
      { name: 'color', type: 'string', default: '#ffffff' },
      { name: 'opacity', type: 'number', range: [0, 1], default: 0.5 },
      { name: 'dotRadius', type: 'number', range: [1, 24], default: 2 }
    ]
  },
  noise_texture_v1: {
    id: 'noise_texture_v1',
    description: 'Value-noise texture in grayscale or tinted color.',
    params: [
      { name: 'scale', type: 'number', range: [0.001, 0.1], default: 0.01 },
      { name: 'octaves', type: 'int', range: [1, 6], default: 4 },
      { name: 'persistence', type: 'number', range: [0.1, 1], default: 0.5 },
      { name: 'contrast', type: 'number', range: [0.2, 3], default: 1 },
      { name: 'brightness', type: 'number', range: [-1, 1], default: 0 },
      { name: 'tint', type: 'string|null', default: null },
      { name: 'invert', type: 'boolean', default: false },
      { name: 'opacity', type: 'number', range: [0, 1], default: 1 }
    ]
  },
  scatter_v1: {
    id: 'scatter_v1',
    description: 'Random or Poisson-like distributed primitive scatters.',
    params: [
      { name: 'count', type: 'int', range: [1, 2000], default: 100 },
      { name: 'shape', type: 'enum', options: ['circle', 'square', 'star'], default: 'circle' },
      { name: 'sizeRange', type: 'number[]', default: [4, 16], description: 'Size range [min, max]' },
      { name: 'distribution', type: 'enum', options: ['random', 'poisson'], default: 'random' },
      { name: 'minDistance', type: 'number', range: [2, 200], default: 20 },
      { name: 'opacity', type: 'number', range: [0, 1], default: 0.8 },
      { name: 'fill', type: 'string|null', default: null },
      { name: 'palette', type: 'string[]', description: '1–12 CSS colors' }
    ]
  },
  hatching_v1: {
    id: 'hatching_v1',
    description: 'Parallel line hatching with optional cross-hatching.',
    params: [
      { name: 'angle', type: 'number', default: 45 },
      { name: 'spacing', type: 'number', range: [2, 100], default: 8 },
      { name: 'strokeWidth', type: 'number', range: [0.5, 8], default: 1 },
      { name: 'cross', type: 'boolean', default: false },
      { name: 'crossAngle', type: 'number|null', default: null },
      { name: 'jitter', type: 'number', range: [0, 1], default: 0 },
      { name: 'opacity', type: 'number', range: [0, 1], default: 0.6 },
      { name: 'color', type: 'string', default: '#ffffff' }
    ]
  }
};

/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
  const configDir = getConfigDir();
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

/**
 * Get raw capabilities with TTL-based caching
 */
export async function getCapabilities(forceRefresh = false) {
  ensureConfigDir();

  // Check cache unless forcing refresh
  const capabilitiesPath = getCapabilitiesPath();
  if (!forceRefresh && fs.existsSync(capabilitiesPath)) {
    const stat = fs.statSync(capabilitiesPath);
    if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
      return JSON.parse(fs.readFileSync(capabilitiesPath, 'utf8'));
    }
  }

  // Fetch fresh capabilities
  const fresh = await fetchCapabilities();

  // Cache to disk
  fs.writeFileSync(capabilitiesPath, JSON.stringify(fresh, null, 2));

  return fresh;
}

/**
 * Get list of generator IDs from API
 */
export async function getGeneratorIds(forceRefresh = false) {
  try {
    const caps = await getCapabilities(forceRefresh);
    // API returns generatorIds as array of strings
    return caps.generatorIds || [];
  } catch {
    // Fallback to local metadata
    return Object.keys(GENERATOR_METADATA);
  }
}

/**
 * Get generator metadata by ID
 */
export async function getGenerator(generatorId) {
  return GENERATOR_METADATA[generatorId] || null;
}

/**
 * Get all generators with full metadata
 */
export async function getAllGenerators(forceRefresh = false) {
  const ids = await getGeneratorIds(forceRefresh);
  return ids.map(id => GENERATOR_METADATA[id] || { id, description: 'Generator', params: [] });
}

/**
 * Validate generator ID
 */
export async function isValidGenerator(generatorId) {
  const ids = await getGeneratorIds();
  return ids.includes(generatorId);
}

/**
 * Format generator for display
 */
export function formatGenerator(generator) {
  const lines = [];
  lines.push(`  ${generator.id}`);
  lines.push(`    ${generator.description}`);

  if (generator.params && generator.params.length > 0) {
    const paramStrs = generator.params.map(p => {
      if (p.range) {
        return `${p.name} (${p.range[0]}-${p.range[1]})`;
      }
      if (p.options) {
        return `${p.name} (${p.options.join('|')})`;
      }
      if (p.type && p.type.endsWith('[]')) {
        return `${p.name} (${p.type})`;
      }
      return p.name;
    });
    lines.push(`    Params: ${paramStrs.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Format detailed generator help
 */
export function formatGeneratorHelp(generator) {
  const lines = [];
  lines.push(`Generator: ${generator.id}`);
  lines.push(`${generator.description}`);
  lines.push('');
  lines.push('Parameters:');

  if (generator.params && generator.params.length > 0) {
    for (const p of generator.params) {
      let paramLine = `  ${p.name}`;
      if (p.type) paramLine += ` (${p.type})`;
      if (p.default !== undefined) paramLine += ` [default: ${JSON.stringify(p.default)}]`;
      lines.push(paramLine);

      if (p.description) {
        lines.push(`    ${p.description}`);
      }
      if (p.range) {
        lines.push(`    Range: ${p.range[0]} - ${p.range[1]}`);
      }
      if (p.options) {
        lines.push(`    Options: ${p.options.join(', ')}`);
      }
    }
  } else {
    lines.push('  No configurable parameters.');
  }

  lines.push('');
  lines.push('Example:');
  lines.push(`  moltart post ${generator.id} --seed 42`);

  return lines.join('\n');
}

// Export for backward compatibility
export const FALLBACK_GENERATORS = Object.values(GENERATOR_METADATA);
