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
  "flow_field_v1": {
    "id": "flow_field_v1",
    "description": "Flowing particle traces that follow a mathematical field.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "density",
        "type": "number",
        "range": [
          0.05,
          1
        ],
        "default": 0.55
      },
      {
        "name": "steps",
        "type": "int",
        "range": [
          40,
          240
        ],
        "default": 140
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 1
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.85
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.85
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 220
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 310
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 80
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 55
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 73
      }
    ]
  },
  "noise_paths_v1": {
    "id": "noise_paths_v1",
    "description": "Flowing paths traced through a deterministic noise field.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "count",
        "type": "int",
        "range": [
          10,
          3000
        ],
        "default": 240
      },
      {
        "name": "steps",
        "type": "int",
        "range": [
          10,
          600
        ],
        "default": 140
      },
      {
        "name": "stepSize",
        "type": "number",
        "range": [
          0.5,
          12
        ],
        "default": 2.2
      },
      {
        "name": "noiseScale",
        "type": "number",
        "range": [
          0.0005,
          0.08
        ],
        "default": 0.005
      },
      {
        "name": "curl",
        "type": "number",
        "range": [
          0,
          4
        ],
        "default": 1.2
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 2
      },
      {
        "name": "strokeWeight",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 2
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.6
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.6
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "colorMode",
        "options": [
          "palette",
          "ramp",
          "bloom"
        ],
        "type": "enum",
        "default": "palette"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          360
        ]
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          360
        ]
      },
      {
        "name": "hueStart",
        "type": "number",
        "range": [
          0,
          360
        ],
        "default": 180
      },
      {
        "name": "hueEnd",
        "type": "number",
        "range": [
          0,
          360
        ],
        "default": 220
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 80
      },
      {
        "name": "lightness",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 60
      },
      {
        "name": "bloomCenter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.6
      },
      {
        "name": "bloomWidth",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.1
      },
      {
        "name": "bloomHueOffset",
        "type": "number",
        "range": [
          -360,
          360
        ],
        "default": 180
      },
      {
        "name": "bloomStrength",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      }
    ]
  },
  "topo_lines_v1": {
    "id": "topo_lines_v1",
    "description": "Topographic contour lines with wave distortion.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "lines",
        "type": "int",
        "range": [
          20,
          140
        ],
        "default": 70
      },
      {
        "name": "wobble",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.55
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 1
      },
      {
        "name": "lineWidth",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 1
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.9
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.9
      },
      {
        "name": "margin",
        "type": "number",
        "range": [
          0,
          0.2
        ],
        "default": 0.06
      },
      {
        "name": "step",
        "type": "number",
        "range": [
          2,
          20
        ],
        "default": 6
      },
      {
        "name": "spacing",
        "type": "any",
        "default": null
      },
      {
        "name": "wobbleScale",
        "type": "number",
        "range": [
          0,
          3
        ],
        "default": 1
      },
      {
        "name": "offsetJitter",
        "type": "number",
        "range": [
          0,
          0.5
        ],
        "default": 0
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 200
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 320
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 75
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 52
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 62
      }
    ]
  },
  "voronoi_stain_v1": {
    "id": "voronoi_stain_v1",
    "description": "Organic watercolor-like blobs based on Voronoi cells.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "cells",
        "type": "int",
        "range": [
          3,
          120
        ],
        "default": 34
      },
      {
        "name": "bleed",
        "type": "number",
        "range": [
          0.1,
          1.2
        ],
        "default": 0.65
      },
      {
        "name": "layers",
        "type": "int",
        "range": [
          1,
          60
        ],
        "default": 22
      },
      {
        "name": "washAlpha",
        "type": "number",
        "range": [
          0,
          0.3
        ],
        "default": 0.08
      },
      {
        "name": "radiusMin",
        "type": "number",
        "range": [
          0.02,
          0.4
        ],
        "default": 0.12
      },
      {
        "name": "radiusMax",
        "type": "number",
        "range": [
          0.05,
          0.8
        ],
        "default": 0.44
      },
      {
        "name": "layerScaleMin",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.25
      },
      {
        "name": "layerScaleMax",
        "type": "number",
        "range": [
          0.2,
          2
        ],
        "default": 1.125
      },
      {
        "name": "jitter",
        "type": "number",
        "range": [
          0,
          40
        ],
        "default": 10
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 180
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 380
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 82
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 48
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 66
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "outlineAlpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.12
      },
      {
        "name": "outlineGlobalAlpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.45
      },
      {
        "name": "outlineRadiusMin",
        "type": "number",
        "range": [
          0,
          0.2
        ],
        "default": 0.02
      },
      {
        "name": "outlineRadiusMax",
        "type": "number",
        "range": [
          0,
          0.3
        ],
        "default": 0.05
      },
      {
        "name": "outlineColor",
        "type": "string",
        "default": "rgba(231,236,255,0.12)"
      }
    ]
  },
  "lsystem_garden_v1": {
    "id": "lsystem_garden_v1",
    "description": "Recursive branching plants inspired by L-systems.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "stems",
        "type": "int",
        "range": [
          10,
          60
        ],
        "default": 28
      },
      {
        "name": "depth",
        "type": "int",
        "range": [
          4,
          9
        ],
        "default": 7
      },
      {
        "name": "bandTop",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.82
      },
      {
        "name": "bandBottom",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.98
      },
      {
        "name": "xSpread",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.7
      },
      {
        "name": "xCenter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.5
      },
      {
        "name": "lengthMin",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.08
      },
      {
        "name": "lengthMax",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.19
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.25,
          8
        ]
      },
      {
        "name": "strokeWidthMin",
        "type": "number",
        "range": [
          0.25,
          6
        ],
        "default": 1
      },
      {
        "name": "strokeWidthMax",
        "type": "number",
        "range": [
          0.25,
          8
        ],
        "default": 3.4
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.85
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.85
      },
      {
        "name": "angleJitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.5
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 90
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 180
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 60
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 42
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 58
      }
    ]
  },
  "stipple_shade_v1": {
    "id": "stipple_shade_v1",
    "description": "Pointillist shading with radial density falloff.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "dots",
        "type": "int",
        "range": [
          1500,
          25000
        ],
        "default": 9000
      },
      {
        "name": "contrast",
        "type": "number",
        "range": [
          0.2,
          1.4
        ],
        "default": 0.9
      },
      {
        "name": "dotRadius",
        "type": "number",
        "range": [
          0.5,
          24
        ]
      },
      {
        "name": "dotRadiusRange",
        "type": "array"
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 210
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 340
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 70
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 52
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 64
      }
    ]
  },
  "ribbon_scribbles_v1": {
    "id": "ribbon_scribbles_v1",
    "description": "Flowing ribbon curves with bezier paths.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "ribbons",
        "type": "int",
        "range": [
          8,
          80
        ],
        "default": 28
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.5,
          8
        ],
        "default": 2.2
      },
      {
        "name": "width",
        "type": "number",
        "range": [
          0.5,
          8
        ],
        "default": 2.2
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.9
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.9
      },
      {
        "name": "translateJitter",
        "type": "number",
        "range": [
          0,
          0.5
        ],
        "default": 0
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 200
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 360
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 80
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 55
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 65
      }
    ]
  },
  "fractal_polygon_wash_v1": {
    "id": "fractal_polygon_wash_v1",
    "description": "Layered, subdivided jitter polygons with translucent fills and strokes.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "sides",
        "type": "int",
        "range": [
          3,
          12
        ],
        "default": 5
      },
      {
        "name": "radius",
        "type": "number",
        "range": [
          20,
          800
        ],
        "default": 160
      },
      {
        "name": "recursion",
        "type": "int",
        "range": [
          0,
          7
        ],
        "default": 2
      },
      {
        "name": "jitterStd",
        "type": "number",
        "range": [
          0,
          120
        ],
        "default": 20
      },
      {
        "name": "layers",
        "type": "int",
        "range": [
          1,
          12
        ],
        "default": 4
      },
      {
        "name": "alphaFill",
        "type": "number",
        "range": [
          0,
          0.3
        ],
        "default": 0.08
      },
      {
        "name": "alphaStroke",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.4
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "rotateJitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.2
      },
      {
        "name": "scaleJitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0
      },
      {
        "name": "center",
        "type": "array",
        "default": [
          0.5,
          0.5
        ]
      },
      {
        "name": "radiusScale",
        "type": "number",
        "range": [
          0.1,
          3
        ],
        "default": 1
      },
      {
        "name": "radiusClamp",
        "type": "number",
        "range": [
          0.1,
          1
        ],
        "default": 0.45
      },
      {
        "name": "radiusMin",
        "type": "number",
        "range": [
          0,
          2
        ],
        "default": 0.8
      },
      {
        "name": "radiusMax",
        "type": "number",
        "range": [
          0,
          2
        ],
        "default": 1.15
      },
      {
        "name": "translateJitter",
        "type": "number",
        "range": [
          0,
          0.5
        ],
        "default": 0
      },
      {
        "name": "scaleX",
        "type": "number",
        "range": [
          0.2,
          3
        ],
        "default": 1
      },
      {
        "name": "scaleY",
        "type": "number",
        "range": [
          0.2,
          3
        ],
        "default": 1
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 0
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 360
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 70
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 60
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 60
      },
      {
        "name": "strokeWeightRange",
        "type": "array",
        "default": [
          1,
          2.5
        ]
      }
    ]
  },
  "sigil_v1": {
    "id": "sigil_v1",
    "description": "Symmetric pixel-grid emblems.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "symmetry",
        "options": [
          "horizontal",
          "vertical",
          "quad"
        ],
        "type": "enum",
        "default": "quad"
      },
      {
        "name": "density",
        "type": "number",
        "range": [
          0.3,
          0.7
        ],
        "default": 0.5
      }
    ]
  },
  "glyph_text_v1": {
    "id": "glyph_text_v1",
    "description": "Text and glyph patterns — tiles, scatter, or handle stamps.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "mode",
        "options": [
          "tile",
          "scatter",
          "glyphs",
          "encode_handle"
        ],
        "type": "enum",
        "default": "glyphs"
      },
      {
        "name": "text",
        "type": "string"
      },
      {
        "name": "handle",
        "type": "string"
      },
      {
        "name": "glyphSet",
        "options": [
          "digits",
          "hex",
          "pi",
          "ascii"
        ],
        "type": "enum",
        "default": "digits"
      },
      {
        "name": "density",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.18
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "sans-serif"
      },
      {
        "name": "fontStyle",
        "options": [
          "normal",
          "italic"
        ],
        "type": "enum",
        "default": "normal"
      },
      {
        "name": "fontSizeRange",
        "type": "array",
        "default": [
          14,
          40
        ]
      },
      {
        "name": "skewX",
        "type": "number",
        "range": [
          -0.5,
          0.5
        ],
        "default": 0
      },
      {
        "name": "skewY",
        "type": "number",
        "range": [
          -0.5,
          0.5
        ],
        "default": 0
      },
      {
        "name": "skewOrigin",
        "options": [
          "origin",
          "center"
        ],
        "type": "enum",
        "default": "center"
      },
      {
        "name": "weightVariation",
        "type": "object",
        "default": {
          "mode": "none"
        }
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.3
      },
      {
        "name": "rotationJitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.35
      },
      {
        "name": "jitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.25
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "spacing",
        "type": "number",
        "range": [
          0.6,
          4
        ],
        "default": 1.4
      }
    ]
  },
  "text_statement_v1": {
    "id": "text_statement_v1",
    "description": "Legible statement text with alignment, stroke, and shadow.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "text",
        "type": "string"
      },
      {
        "name": "lines",
        "type": "string[]"
      },
      {
        "name": "lineSizes",
        "type": "number[]"
      },
      {
        "name": "fontSize",
        "type": "number",
        "range": [
          6,
          512
        ],
        "default": 140
      },
      {
        "name": "align",
        "options": [
          "center",
          "left",
          "right"
        ],
        "type": "enum",
        "default": "center"
      },
      {
        "name": "verticalAlign",
        "options": [
          "middle",
          "top",
          "bottom"
        ],
        "type": "enum",
        "default": "middle"
      },
      {
        "name": "rotation",
        "type": "number",
        "range": [
          -3600,
          3600
        ],
        "default": 0
      },
      {
        "name": "scale",
        "type": "number",
        "range": [
          0.2,
          4
        ],
        "default": 1
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "sans-serif"
      },
      {
        "name": "fontWeight",
        "options": [
          "normal",
          "bold",
          "black"
        ],
        "type": "enum",
        "default": "black"
      },
      {
        "name": "letterSpacing",
        "type": "number",
        "range": [
          -50,
          200
        ],
        "default": 0
      },
      {
        "name": "lineHeight",
        "type": "number",
        "range": [
          0.6,
          2
        ],
        "default": 1
      },
      {
        "name": "fill",
        "type": "string",
        "default": "#f8f8f8"
      },
      {
        "name": "stroke",
        "type": "object"
      },
      {
        "name": "shadow",
        "type": "object"
      }
    ]
  },
  "primitive_shape_v1": {
    "id": "primitive_shape_v1",
    "description": "Basic geometric primitives for composition and masking.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "shape",
        "options": [
          "circle",
          "rect",
          "ellipse",
          "line",
          "polygon"
        ],
        "type": "enum",
        "default": "circle"
      },
      {
        "name": "x",
        "type": "number"
      },
      {
        "name": "y",
        "type": "number"
      },
      {
        "name": "radius",
        "type": "number",
        "range": [
          1,
          4096
        ]
      },
      {
        "name": "width",
        "type": "number",
        "range": [
          1,
          4096
        ]
      },
      {
        "name": "height",
        "type": "number",
        "range": [
          1,
          4096
        ]
      },
      {
        "name": "x1",
        "type": "number"
      },
      {
        "name": "y1",
        "type": "number"
      },
      {
        "name": "x2",
        "type": "number"
      },
      {
        "name": "y2",
        "type": "number"
      },
      {
        "name": "points",
        "type": "array"
      },
      {
        "name": "fill",
        "type": "string",
        "default": "#ffffff"
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0,
          48
        ]
      },
      {
        "name": "stroke",
        "type": "object"
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      },
      {
        "name": "rings",
        "type": "object[]"
      },
      {
        "name": "ringCount",
        "type": "int",
        "range": [
          1,
          64
        ],
        "default": 1
      },
      {
        "name": "ringScaleStep",
        "type": "number",
        "range": [
          -0.9,
          0.9
        ],
        "default": -0.08
      },
      {
        "name": "ringOffsetStep",
        "type": "array",
        "default": [
          0,
          0
        ]
      },
      {
        "name": "ringRotateStep",
        "type": "number",
        "range": [
          -3.141592653589793,
          3.141592653589793
        ],
        "default": 0
      },
      {
        "name": "ringStrokeScale",
        "type": "number",
        "range": [
          0,
          2
        ],
        "default": 1
      },
      {
        "name": "ringOpacityStep",
        "type": "number",
        "range": [
          -1,
          1
        ],
        "default": 0
      }
    ]
  },
  "gradient_v1": {
    "id": "gradient_v1",
    "description": "Linear, radial, and conic gradients for utility layering.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "type",
        "options": [
          "linear",
          "radial",
          "conic"
        ],
        "type": "enum",
        "default": "linear"
      },
      {
        "name": "angle",
        "type": "number",
        "range": [
          0,
          360
        ],
        "default": 0
      },
      {
        "name": "center",
        "type": "array",
        "default": [
          0.5,
          0.5
        ]
      },
      {
        "name": "stops",
        "type": "object[]"
      }
    ]
  },
  "grid_pattern_v1": {
    "id": "grid_pattern_v1",
    "description": "Configurable dots, lines, and crosshatch grid patterns.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "mode",
        "options": [
          "dots",
          "lines",
          "crosshatch"
        ],
        "type": "enum",
        "default": "lines"
      },
      {
        "name": "spacing",
        "type": "number",
        "range": [
          4,
          200
        ],
        "default": 24
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.5,
          12
        ],
        "default": 1
      },
      {
        "name": "angle",
        "type": "number",
        "default": 0
      },
      {
        "name": "color",
        "type": "string",
        "default": "#ffffff"
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.5
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.5
      },
      {
        "name": "dotRadius",
        "type": "number",
        "range": [
          1,
          24
        ],
        "default": 2
      },
      {
        "name": "dotRadiusRange",
        "type": "array"
      }
    ]
  },
  "noise_texture_v1": {
    "id": "noise_texture_v1",
    "description": "Value-noise texture in grayscale or tinted color.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "scale",
        "type": "number",
        "range": [
          0.001,
          0.1
        ],
        "default": 0.01
      },
      {
        "name": "octaves",
        "type": "int",
        "range": [
          1,
          6
        ],
        "default": 4
      },
      {
        "name": "persistence",
        "type": "number",
        "range": [
          0.1,
          1
        ],
        "default": 0.5
      },
      {
        "name": "contrast",
        "type": "number",
        "range": [
          0.2,
          3
        ],
        "default": 1
      },
      {
        "name": "brightness",
        "type": "number",
        "range": [
          -1,
          1
        ],
        "default": 0
      },
      {
        "name": "tint",
        "type": "any",
        "default": null
      },
      {
        "name": "invert",
        "type": "boolean",
        "default": false
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 1
      }
    ]
  },
  "scatter_v1": {
    "id": "scatter_v1",
    "description": "Random or Poisson-like distributed primitive scatters.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "count",
        "type": "int",
        "range": [
          1,
          2000
        ],
        "default": 100
      },
      {
        "name": "shape",
        "options": [
          "circle",
          "square",
          "star"
        ],
        "type": "enum",
        "default": "circle"
      },
      {
        "name": "dotRadius",
        "type": "number",
        "range": [
          0.5,
          200
        ]
      },
      {
        "name": "dotRadiusRange",
        "type": "array"
      },
      {
        "name": "sizeRange",
        "type": "array",
        "default": [
          4,
          16
        ]
      },
      {
        "name": "distribution",
        "options": [
          "random",
          "poisson"
        ],
        "type": "enum",
        "default": "random"
      },
      {
        "name": "minDistance",
        "type": "number",
        "range": [
          2,
          200
        ],
        "default": 20
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.8
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.8
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "hueMin",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 220
      },
      {
        "name": "hueMax",
        "type": "number",
        "range": [
          0,
          720
        ],
        "default": 310
      },
      {
        "name": "sat",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 0
      },
      {
        "name": "lightnessMin",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 100
      },
      {
        "name": "lightnessMax",
        "type": "number",
        "range": [
          0,
          100
        ],
        "default": 100
      },
      {
        "name": "fill",
        "type": "any",
        "default": null
      }
    ]
  },
  "hatching_v1": {
    "id": "hatching_v1",
    "description": "Parallel line hatching with optional cross-hatching.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "auto"
      },
      {
        "name": "angle",
        "type": "number",
        "default": 45
      },
      {
        "name": "spacing",
        "type": "number",
        "range": [
          2,
          100
        ],
        "default": 8
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "range": [
          0.5,
          8
        ],
        "default": 1
      },
      {
        "name": "cross",
        "type": "boolean",
        "default": false
      },
      {
        "name": "crossAngle",
        "type": "any",
        "default": null
      },
      {
        "name": "jitter",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.6
      },
      {
        "name": "opacity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.6
      },
      {
        "name": "color",
        "type": "string",
        "default": "#ffffff"
      }
    ]
  },
  "blob_field_v1": {
    "id": "blob_field_v1",
    "description": "Organic metaball-like blobs for masks and texture layers.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "transparent"
      },
      {
        "name": "count",
        "type": "int",
        "range": [
          2,
          200
        ],
        "default": 40
      },
      {
        "name": "radiusMin",
        "type": "number",
        "range": [
          0.02,
          0.6
        ],
        "default": 0.08
      },
      {
        "name": "radiusMax",
        "type": "number",
        "range": [
          0.05,
          0.9
        ],
        "default": 0.22
      },
      {
        "name": "threshold",
        "type": "number",
        "range": [
          0.1,
          2.5
        ],
        "default": 1
      },
      {
        "name": "softness",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.25
      },
      {
        "name": "jitter",
        "type": "number",
        "range": [
          0,
          0.5
        ],
        "default": 0.08
      },
      {
        "name": "fill",
        "type": "string",
        "default": "#ffffff"
      },
      {
        "name": "outline",
        "type": "any",
        "default": null
      }
    ]
  },
  "stripes_v1": {
    "id": "stripes_v1",
    "description": "Evenly spaced stripes or bands with optional wave distortion.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "transparent"
      },
      {
        "name": "palette",
        "type": "string[]"
      },
      {
        "name": "spacing",
        "type": "number",
        "range": [
          4,
          200
        ],
        "default": 18
      },
      {
        "name": "width",
        "type": "number",
        "range": [
          1,
          200
        ],
        "default": 8
      },
      {
        "name": "angle",
        "type": "number",
        "range": [
          -180,
          180
        ],
        "default": 0
      },
      {
        "name": "offset",
        "type": "number",
        "range": [
          -200,
          200
        ],
        "default": 0
      },
      {
        "name": "count",
        "type": "any",
        "default": null
      },
      {
        "name": "waveAmp",
        "type": "number",
        "range": [
          0,
          200
        ],
        "default": 0
      },
      {
        "name": "waveFreq",
        "type": "number",
        "range": [
          0,
          20
        ],
        "default": 0
      },
      {
        "name": "wavePhase",
        "type": "number",
        "range": [
          0,
          6.283185307179586
        ],
        "default": 0
      },
      {
        "name": "color",
        "type": "string",
        "default": "#ffffff"
      },
      {
        "name": "alpha",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.8
      }
    ]
  },
  "cellular_automata_v1": {
    "id": "cellular_automata_v1",
    "description": "Deterministic 2D cellular automata grid for mask-friendly fills.",
    "params": [
      {
        "name": "background",
        "options": [
          "auto",
          "transparent"
        ],
        "type": "string",
        "default": "transparent"
      },
      {
        "name": "rows",
        "type": "int",
        "range": [
          10,
          240
        ],
        "default": 60
      },
      {
        "name": "cols",
        "type": "int",
        "range": [
          10,
          240
        ],
        "default": 40
      },
      {
        "name": "steps",
        "type": "int",
        "range": [
          1,
          80
        ],
        "default": 20
      },
      {
        "name": "seedDensity",
        "type": "number",
        "range": [
          0,
          1
        ],
        "default": 0.3
      },
      {
        "name": "wrap",
        "type": "boolean",
        "default": false
      },
      {
        "name": "birth",
        "type": "number[]",
        "default": [
          3
        ]
      },
      {
        "name": "survive",
        "type": "number[]",
        "default": [
          2,
          3,
          4,
          5
        ]
      },
      {
        "name": "foreground",
        "type": "string",
        "default": "#ffffff"
      },
      {
        "name": "invert",
        "type": "boolean",
        "default": false
      }
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

function mapSchemaType(schema) {
  // Handle anyOf: prefer consts as enum, otherwise fall back to type/default.
  if (Array.isArray(schema.anyOf)) {
    const consts = schema.anyOf.filter(s => Object.prototype.hasOwnProperty.call(s, 'const')).map(s => s.const);
    if (consts.length === schema.anyOf.length) return 'enum';
    if (consts.length > 0) return 'string';
  }
  if (schema.enum) return 'enum';
  if (schema.type === 'integer') return 'int';
  if (schema.type === 'number') return 'number';
  if (schema.type === 'string') return 'string';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'array') {
    const t = schema.items?.type;
    if (t === 'string') return 'string[]';
    if (t === 'number' || t === 'integer') return 'number[]';
    if (t === 'object') return 'object[]';
    return 'array';
  }
  if (schema.type === 'object') return 'object';
  if (schema.default !== undefined) {
    if (Array.isArray(schema.default)) return 'array';
    if (schema.default === null) return 'any';
    return typeof schema.default;
  }
  return 'any';
}

function mapSchemaParam(name, schema) {
  const param = { name };
  if (Array.isArray(schema.anyOf)) {
    const consts = schema.anyOf.filter(s => Object.prototype.hasOwnProperty.call(s, 'const')).map(s => s.const);
    if (consts.length) param.options = consts;
  }
  if (schema.enum) param.options = schema.enum;
  const type = mapSchemaType(schema);
  if (type) param.type = type;
  if (schema.minimum !== undefined && schema.maximum !== undefined) {
    param.range = [schema.minimum, schema.maximum];
  }
  if (schema.default !== undefined) param.default = schema.default;
  if (schema.description) param.description = schema.description;
  return param;
}

function mapDescriptorToGenerator(desc) {
  const props = desc.paramsSchema?.properties || {};
  const params = Object.entries(props).map(([k, v]) => mapSchemaParam(k, v));
  return {
    id: desc.generatorId,
    description: desc.description || desc.title || 'Generator',
    params
  };
}

export async function getCapabilitiesGenerators(forceRefresh = false) {
  try {
    const caps = await getCapabilities(forceRefresh);
    const descriptors = Array.isArray(caps.generators) ? caps.generators : [];
    if (descriptors.length) {
      return { generators: descriptors.map(mapDescriptorToGenerator), source: 'capabilities' };
    }
  } catch (err) {
    if (process.env.MOLTART_DEBUG) {
      console.error('[moltart] capabilities fetch failed:', err?.message || err);
    }
  }
  return { generators: Object.values(GENERATOR_METADATA), source: 'fallback' };
}

/**
 * Get generator metadata by ID
 */
export async function getGenerator(generatorId) {
  const { generators } = await getCapabilitiesGenerators();
  return generators.find(g => g.id === generatorId) || null;
}

/**
 * Get all generators with full metadata
 */
export async function getAllGenerators(forceRefresh = false) {
  const { generators } = await getCapabilitiesGenerators(forceRefresh);
  return generators;
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
