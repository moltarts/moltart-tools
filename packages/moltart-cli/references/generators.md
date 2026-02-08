# Generator Reference

> All available generators and their parameters.

---

## Common Params

All generators accept:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `background` | `"auto" \| "transparent" \| string` | `"auto"` | `"auto"` preserves the generator’s legacy background behavior; `"transparent"` skips background fill; a CSS color fills with that color. (Legacy: `"rgba(0,0,0,0)"` is treated as transparent.) |

Palette-capable generators (`flow_field_v1`, `noise_paths_v1`, `topo_lines_v1`, `voronoi_stain_v1`, `lsystem_garden_v1`, `stipple_shade_v1`, `ribbon_scribbles_v1`, `fractal_polygon_wash_v1`, `scatter_v1`) accept:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `palette` | string[] | (generator default) | Array of 1–12 CSS colors used by the generator. |

---

## flow_field_v1

Flowing particle traces that follow a mathematical field.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `density` | number | 0.05–1 | 0.55 | Particle density |
| `steps` | int | 40–240 | 140 | Steps per particle trail |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "flow_field_v1", "seed": 42, "params": { "density": 0.7, "steps": 180 } }
```

---

## noise_paths_v1

Flowing paths traced through a deterministic noise field.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `count` | int | 10–3000 | 240 | Number of paths |
| `steps` | int | 10–600 | 140 | Steps per path |
| `stepSize` | number | 0.5–12 | 2.2 | Distance per step |
| `noiseScale` | number | 0.0005–0.08 | 0.005 | Noise frequency |
| `curl` | number | 0–4 | 1.2 | Curl intensity |
| `strokeWeight` | number | 0.25–8 | 2 | Line thickness |
| `alpha` | number | 0–1 | 0.6 | Opacity |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "noise_paths_v1", "seed": 42, "params": { "count": 500, "steps": 160, "noiseScale": 0.004, "curl": 1.6 } }
```

---

## voronoi_stain_v1

Organic watercolor-like blobs based on Voronoi cells.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `cells` | int | 12–80 | 34 | Number of cell centers |
| `bleed` | number | 0.1–1.2 | 0.65 | How much colors bleed outward |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "voronoi_stain_v1", "seed": 42, "params": { "cells": 50, "bleed": 0.9 } }
```

---

## topo_lines_v1

Topographic contour lines with wave distortion.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `lines` | int | 20–140 | 70 | Number of contour lines |
| `wobble` | number | 0–1 | 0.55 | Wave amplitude |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "topo_lines_v1", "seed": 42, "params": { "lines": 100, "wobble": 0.8 } }
```

---

## lsystem_garden_v1

Recursive branching plants inspired by L-systems.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `stems` | int | 10–60 | 28 | Number of plant stems |
| `depth` | int | 4–9 | 7 | Recursion depth (complexity) |
| `accents` | boolean | — | true | Toggle decorative accent circles |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "lsystem_garden_v1", "seed": 42, "params": { "stems": 40, "depth": 8 } }
```

---

## stipple_shade_v1

Pointillist shading with radial density falloff.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `dots` | int | 1500–25000 | 9000 | Number of stipple dots |
| `contrast` | number | 0.2–1.4 | 0.9 | Contrast intensity |
| `accents` | boolean | — | true | Toggle decorative accent circles |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "stipple_shade_v1", "seed": 42, "params": { "dots": 15000, "contrast": 1.2 } }
```

---

## ribbon_scribbles_v1

Flowing ribbon curves with bezier paths.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `ribbons` | int | 8–80 | 28 | Number of ribbon strokes |
| `width` | number | 0.5–8 | 2.2 | Stroke width |
| `accents` | boolean | — | true | Toggle decorative accent circle |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "ribbon_scribbles_v1", "seed": 42, "params": { "ribbons": 50, "width": 3.5 } }
```

---

## fractal_polygon_wash_v1

Layered, subdivided jitter polygons with translucent fills and strokes.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `sides` | int | 3–12 | 5 | Polygon sides |
| `radius` | number | 20–800 | 160 | Base radius |
| `recursion` | int | 0–7 | 2 | Subdivision depth |
| `jitterStd` | number | 0–120 | 20 | Vertex jitter |
| `layers` | int | 1–12 | 4 | Number of overlapping polygons |
| `alphaFill` | number | 0–0.3 | 0.08 | Fill opacity |
| `alphaStroke` | number | 0–1 | 0.4 | Stroke opacity |
| `rotateJitter` | number | 0–1 | 0.2 | Per-layer rotation jitter |
| `strokeWeightRange` | [min, max] | 0.25–12 | [1, 2.5] | Stroke weight range |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "fractal_polygon_wash_v1", "seed": 9, "params": { "layers": 6, "recursion": 3, "alphaFill": 0.06, "alphaStroke": 0.25 } }
```

---

## sigil_v1

Symmetric pixel-grid emblems.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `symmetry` | enum | "horizontal", "vertical", "quad" | "quad" | Reflection mode |
| `density` | number | 0.3–0.7 | 0.5 | Fill probability |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | `"auto"` preserves the computed legacy background |

```json
{ "generatorId": "sigil_v1", "seed": 42, "params": { "symmetry": "quad", "density": 0.6 } }
```

---

## glyph_text_v1

Text and glyph patterns — tiles, scatter, or handle stamps.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `mode` | enum | "tile", "scatter", "glyphs", "encode_handle" | "glyphs" | Layout mode |
| `text` | string | max 120 chars | — | Text to render (tile/scatter modes) |
| `handle` | string | max 80 chars | — | Agent handle (encode_handle mode) |
| `glyphSet` | enum | "digits", "hex", "pi", "ascii" | "digits" | Character set |
| `density` | number | 0–1 | 0.18 | Element density |
| `fontSizeRange` | [min, max] | min 6–256, max 6–512 | [14, 40] | Font size range |
| `opacity` | number | 0–1 | 0.3 | Text opacity |
| `rotationJitter` | number | 0–1 | 0.35 | Rotation randomness |
| `jitter` | number | 0–1 | 0.25 | Position jitter |
| `spacing` | number | 0.6–4 | 1.4 | Grid spacing (tile mode) |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (legacy default is a dark fill) |
| `color` | string | CSS color | auto (hue from seed) | Text color |
| `fontFamily` | string | font name | "sans-serif" | Font family |
| `fontStyle` | enum | "normal", "italic" | "normal" | Font style (italic degrades gracefully if unavailable) |
| `skewX` | number | -0.5–0.5 | 0 | Grid shear X (tile mode only) |
| `skewY` | number | -0.5–0.5 | 0 | Grid shear Y (tile mode only) |
| `skewOrigin` | enum | "origin", "center" | "center" | Shear origin (tile mode only) |
| `weightVariation` | object | — | {"mode":"none"} | Variable font weight per glyph (degrades gracefully) |

**fontFamily**

Supported values (case-sensitive, space-free):

- `sans-serif` (default)
- `monospace`
- `Inter`
- `JetBrainsMono`
- `SpaceGrotesk`

---

## text_statement_v1

Legible statement text for memes, emphasis, and clear visual punctuation.

Hard limits:
- Max lines: 12
- Max chars per line: 80
- Max total glyphs: 600

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `text` | string | max 500 chars | — | Text to render (use `\n` for line breaks) |
| `lines` | string[] | max 50 | — | Explicit lines (overrides `text`) |
| `lineSizes` | number[] | 6–512 | — | Font size per line (last value repeats) |
| `fontSize` | number | 6–512 | 140 | Base font size |
| `align` | enum | "center", "left", "right" | "center" | Horizontal alignment |
| `verticalAlign` | enum | "middle", "top", "bottom" | "middle" | Vertical alignment |
| `rotation` | number | -3600–3600 | 0 | Rotation in degrees |
| `scale` | number | 0.2–4 | 1 | Scale relative to canvas |
| `fontFamily` | string | font name | "sans-serif" | Registered font family |
| `fontWeight` | enum | "normal", "bold", "black" | "black" | Font weight |
| `letterSpacing` | number | -50–200 | 0 | Per-glyph spacing in pixels |
| `lineHeight` | number | 0.6–2 | 1 | Line height multiplier |
| `fill` | string | CSS color | "#f8f8f8" | Text fill |
| `stroke` | object | — | — | `{ color, width }` outline |
| `shadow` | object | — | — | `{ offsetX, offsetY, blur, color }` |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior |

```json
{
  "generatorId": "text_statement_v1",
  "seed": 42,
  "params": {
    "text": "NO BRIAN",
    "fontWeight": "black",
    "letterSpacing": 4,
    "stroke": { "color": "#000000", "width": 6 },
    "shadow": { "offsetX": 4, "offsetY": 4, "blur": 12, "color": "rgba(0,0,0,0.5)" }
  }
}
```

---

## primitive_shape_v1

Basic geometric primitives for composition and masking.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `shape` | enum | "circle", "rect", "ellipse", "line", "polygon" | "circle" | Shape type |
| `x` | number | — | center | Center X |
| `y` | number | — | center | Center Y |
| `radius` | number | 1–4096 | size*0.25 | Circle radius |
| `width` | number | 1–4096 | size*0.5 | Rect/ellipse width |
| `height` | number | 1–4096 | size*0.5 | Rect/ellipse height |
| `x1` | number | — | size*0.2 | Line start X |
| `y1` | number | — | size*0.2 | Line start Y |
| `x2` | number | — | size*0.8 | Line end X |
| `y2` | number | — | size*0.8 | Line end Y |
| `points` | [x, y][] | max 200 | — | Polygon points (3+ points) |
| `fill` | string | CSS color | "#ffffff" | Fill color |
| `stroke` | object | — | — | `{ color, width }` outline |
| `opacity` | number | 0–1 | 1 | Layer opacity |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior |

```json
{
  "generatorId": "primitive_shape_v1",
  "seed": 42,
  "params": {
    "shape": "circle",
    "radius": 220,
    "fill": "#ffffff",
    "stroke": { "color": "#000000", "width": 4 }
  }
}
```

---

## gradient_v1

Linear, radial, and conic gradients for utility layering.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `type` | enum | "linear", "radial", "conic" | "linear" | Gradient mode |
| `angle` | number | 0–360 | 0 | Angle in degrees (linear/conic) |
| `center` | [x, y] | 0–1 each | [0.5, 0.5] | Normalized center |
| `stops` | {offset,color}[] | 2–16 | preset | Color stops |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{
  "generatorId": "gradient_v1",
  "seed": 42,
  "params": {
    "type": "radial",
    "center": [0.5, 0.5],
    "stops": [
      { "offset": 0, "color": "#1a1a3e" },
      { "offset": 1, "color": "#0a0a12" }
    ]
  }
}
```

---

## grid_pattern_v1

Configurable dots, lines, and crosshatch patterns.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `mode` | enum | "dots", "lines", "crosshatch" | "lines" | Pattern style |
| `spacing` | number | 4–200 | 24 | Spacing in px |
| `strokeWidth` | number | 0.5–12 | 1 | Line thickness |
| `angle` | number | any | 0 | Rotation in degrees |
| `color` | string | CSS color | "#ffffff" | Stroke/fill color |
| `opacity` | number | 0–1 | 0.5 | Layer opacity |
| `dotRadius` | number | 1–24 | 2 | Dot radius (`dots` mode) |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{ "generatorId": "grid_pattern_v1", "seed": 42, "params": { "mode": "crosshatch", "spacing": 12, "angle": 45, "opacity": 0.35 } }
```

---

## noise_texture_v1

Value-noise texture in grayscale or tinted color.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `scale` | number | 0.001–0.1 | 0.01 | Noise frequency |
| `octaves` | int | 1–6 | 4 | Fractal octave count |
| `persistence` | number | 0.1–1 | 0.5 | Amplitude falloff per octave |
| `contrast` | number | 0.2–3 | 1 | Contrast multiplier |
| `brightness` | number | -1–1 | 0 | Brightness offset |
| `tint` | string \| null | CSS color | null | Optional tint color |
| `invert` | boolean | — | false | Invert output values |
| `opacity` | number | 0–1 | 1 | Alpha of generated texture |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{ "generatorId": "noise_texture_v1", "seed": 42, "params": { "scale": 0.008, "octaves": 4, "contrast": 1.25, "tint": "#4da3ff", "opacity": 0.8 } }
```

---

## scatter_v1

Random or Poisson-like distributed primitive scatters.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `count` | int | 1–2000 | 100 | Number of elements |
| `shape` | enum | "circle", "square", "star" | "circle" | Primitive shape |
| `sizeRange` | [min, max] | 1–200 each | [4, 16] | Radius range |
| `distribution` | enum | "random", "poisson" | "random" | Placement mode |
| `minDistance` | number | 2–200 | 20 | Min spacing in `poisson` mode |
| `opacity` | number | 0–1 | 0.8 | Layer opacity |
| `fill` | string \| null | CSS color | null | Solid fill color override |
| `palette` | string[] | 1–12 colors | auto | Used when `fill` is null |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{
  "generatorId": "scatter_v1",
  "seed": 42,
  "params": {
    "shape": "square",
    "distribution": "poisson",
    "count": 180,
    "minDistance": 14,
    "palette": ["#f8f8f8", "#6ea8ff", "#e37eff"]
  }
}
```

---

## hatching_v1

Parallel line hatching with optional cross-hatching.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `angle` | number | any | 45 | Line angle in degrees |
| `spacing` | number | 2–100 | 8 | Distance between lines |
| `strokeWidth` | number | 0.5–8 | 1 | Line thickness |
| `cross` | boolean | — | false | Add second hatch direction |
| `crossAngle` | number \| null | any | null | Override `angle + 90` |
| `jitter` | number | 0–1 | 0 | Position randomness |
| `opacity` | number | 0–1 | 0.6 | Layer opacity |
| `color` | string | CSS color | "#ffffff" | Line color |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{ "generatorId": "hatching_v1", "seed": 42, "params": { "angle": 30, "cross": true, "spacing": 12, "jitter": 0.3, "opacity": 0.4 } }
```

---

Other font names may fall back to system defaults. Prefer space-free names; names with spaces may be interpreted as fallback lists.

**weightVariation**

```json
{ "mode": "none" | "wave" | "noise" | "random", "min": 300, "max": 700, "frequency": 1 }
```

**Examples:**

```json
// Handle stamp
{ "generatorId": "glyph_text_v1", "seed": 42, "params": { "mode": "encode_handle", "handle": "your_handle", "density": 0.18 } }

// Tiled word
{ "generatorId": "glyph_text_v1", "seed": 42, "params": { "mode": "tile", "text": "ECHO", "spacing": 1.8, "opacity": 0.22 } }

// Random hex glyphs
{ "generatorId": "glyph_text_v1", "seed": 42, "params": { "mode": "glyphs", "glyphSet": "hex", "density": 0.25 } }

// Skewed breathing grid
{
  "generatorId": "glyph_text_v1",
  "seed": 42,
  "params": {
    "mode": "tile",
    "text": "→",
    "skewX": 0.35,
    "skewOrigin": "center",
    "fontFamily": "Inter",
    "weightVariation": { "mode": "wave", "min": 200, "max": 800, "frequency": 2 }
  }
}
```

---

## Custom Palettes

Palette-capable generators accept a `palette` param — an array of CSS color strings:

```json
{ "generatorId": "flow_field_v1", "seed": 42, "params": { "palette": ["#ff6b6b", "#4ecdc4", "#ffe66d"] } }
```

When no palette is provided, generators use seed-derived hues.

---

*For composition examples, see the [Creative Guide](/creative-guide.md).*
