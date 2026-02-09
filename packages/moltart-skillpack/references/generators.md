# Generator Reference

> All available generators and their parameters.

---

## Common Params

All generators accept:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `background` | `"auto" \| "transparent" \| string` | `"auto"` | `"auto"` preserves the generator’s legacy background behavior; `"transparent"` skips background fill; a CSS color fills with that color. (Legacy: `"rgba(0,0,0,0)"` is treated as transparent.) |

Alias precedence in Phase 2 is deterministic:
- `alpha` > `opacity`
- `strokeWidth` > (`strokeWeight` or generator-specific legacy width params)
- `color` > `palette` > auto-color (with legacy single-color aliases preserved where applicable)

Palette-capable generators (`flow_field_v1`, `noise_paths_v1`, `topo_lines_v1`, `voronoi_stain_v1`, `lsystem_garden_v1`, `stipple_shade_v1`, `ribbon_scribbles_v1`, `fractal_polygon_wash_v1`, `scatter_v1`, `stripes_v1`) accept:

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
| `strokeWidth` | number | 0.25–8 | 1 | Unified line thickness |
| `alpha` | number | 0–1 | 0.85 | Unified global opacity (preferred) |
| `opacity` | number | 0–1 | 0.85 | Legacy alias for `alpha` |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 220 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 310 | Auto-color hue range max |
| `sat` | number | 0–100 | 80 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 55 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 73 | Auto-color lightness max |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

Cost Notes: clamps steps when estimated path ops exceed 100000.

```json
{ "generatorId": "flow_field_v1", "seed": 42, "params": { "density": 0.7, "steps": 180 } }
```

```json
{ "generatorId": "flow_field_v1", "seed": 5, "params": { "density": 0.65, "steps": 180, "strokeWidth": 1.8, "alpha": 0.72 } }
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
| `strokeWidth` | number | 0.25–8 | 2 | Unified line thickness (preferred) |
| `strokeWeight` | number | 0.25–8 | 2 | Legacy alias for `strokeWidth` |
| `alpha` | number | 0–1 | 0.6 | Unified opacity (preferred) |
| `opacity` | number | 0–1 | 0.6 | Legacy alias for `alpha` |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `colorMode` | enum | "palette", "ramp", "bloom" | "palette" | Color strategy per path |
| `hueMin` | number | 0–360 | alias of `hueStart` | Preferred auto-color hue min |
| `hueMax` | number | 0–360 | alias of `hueEnd` | Preferred auto-color hue max |
| `hueStart` | number | 0–360 | 180 | Ramp/bloom start hue |
| `hueEnd` | number | 0–360 | 220 | Ramp/bloom end hue |
| `sat` | number | 0–100 | 80 | Saturation for ramp/bloom |
| `lightness` | number | 0–100 | 60 | Lightness for ramp/bloom |
| `bloomCenter` | number | 0–1 | 0.6 | Bloom center along path |
| `bloomWidth` | number | 0–1 | 0.1 | Bloom width around center |
| `bloomHueOffset` | number | -360–360 | 180 | Bloom hue offset |
| `bloomStrength` | number | 0–1 | 1 | Bloom mix strength |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

Cost Notes: clamps `steps` when `count * steps` exceeds 100000.

```json
{ "generatorId": "noise_paths_v1", "seed": 42, "params": { "count": 500, "steps": 160, "noiseScale": 0.004, "curl": 1.6 } }
```

```json
{
  "generatorId": "noise_paths_v1",
  "seed": 9,
  "params": {
    "count": 180,
    "steps": 120,
    "stepSize": 2,
    "noiseScale": 0.01,
    "curl": 1.4,
    "colorMode": "bloom",
    "hueStart": 150,
    "hueEnd": 190,
    "bloomCenter": 0.6,
    "bloomWidth": 0.1,
    "bloomHueOffset": 180,
    "bloomStrength": 1,
    "alpha": 0.7
  }
}
```

---

## voronoi_stain_v1

Organic watercolor-like blobs based on Voronoi cells.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `cells` | int | 3–120 | 34 | Number of cell centers |
| `bleed` | number | 0.1–1.2 | 0.65 | How much colors bleed outward |
| `layers` | int | 1–60 | 22 | Number of wash passes |
| `washAlpha` | number | 0–0.3 | 0.08 | Wash pass opacity |
| `radiusMin` | number | 0.02–0.4 | 0.12 | Min stain radius (fraction of size) |
| `radiusMax` | number | 0.05–0.8 | 0.44 | Max stain radius (fraction of size) |
| `layerScaleMin` | number | 0–1 | 0.25 | Min layer radius scale |
| `layerScaleMax` | number | 0.2–2 | 1.125 | Max layer radius scale |
| `jitter` | number | 0–40 | 10 | Center jitter in px |
| `hueMin` | number | 0–720 | 180 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 380 | Auto-color hue range max (wraps) |
| `sat` | number | 0–100 | 82 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 48 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 66 | Auto-color lightness max |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `outlineAlpha` | number | 0–1 | 0.12 | Outline stroke alpha |
| `outlineGlobalAlpha` | number | 0–1 | 0.45 | Outline pass global alpha |
| `outlineRadiusMin` | number | 0–0.2 | 0.02 | Outline radius min |
| `outlineRadiusMax` | number | 0–0.3 | 0.05 | Outline radius max |
| `outlineColor` | string | CSS color | "rgba(231,236,255,0.12)" | Outline color |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "voronoi_stain_v1", "seed": 42, "params": { "cells": 50, "bleed": 0.9 } }
```

```json
{
  "generatorId": "voronoi_stain_v1",
  "seed": 7,
  "params": {
    "cells": 6,
    "layers": 18,
    "radiusMin": 0.18,
    "radiusMax": 0.6,
    "bleed": 0.9,
    "washAlpha": 0.1
  }
}
```

---

## topo_lines_v1

Topographic contour lines with wave distortion.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `lines` | int | 20–140 | 70 | Number of contour lines |
| `wobble` | number | 0–1 | 0.55 | Wave amplitude |
| `strokeWidth` | number | 0.25–8 | 1 | Unified stroke width (preferred) |
| `lineWidth` | number | 0.25–8 | 1 | Legacy alias for `strokeWidth` |
| `alpha` | number | 0–1 | 0.9 | Global opacity (preferred) |
| `opacity` | number | 0–1 | 0.9 | Legacy alias for `alpha` |
| `margin` | number | 0–0.2 | 0.06 | Margin fraction of canvas |
| `step` | number | 2–20 | 6 | X sampling step |
| `spacing` | number \| null | 4–200 | null | Optional spacing; overrides `lines` |
| `wobbleScale` | number | 0–3 | 1 | Multiplier on wobble amplitude |
| `offsetJitter` | number | 0–0.5 | 0 | Per-line vertical offset jitter |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 200 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 320 | Auto-color hue range max |
| `sat` | number | 0–100 | 75 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 52 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 62 | Auto-color lightness max |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "topo_lines_v1", "seed": 42, "params": { "lines": 100, "wobble": 0.8 } }
```

```json
{ "generatorId": "topo_lines_v1", "seed": 42, "params": { "strokeWidth": 2.5, "spacing": 18, "alpha": 0.6, "wobble": 0.35 } }
```

---

## lsystem_garden_v1

Recursive branching plants inspired by L-systems.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `stems` | int | 10–60 | 28 | Number of plant stems |
| `depth` | int | 4–9 | 7 | Recursion depth (complexity) |
| `bandTop` | number | 0–1 | 0.82 | Top of seed band (normalized Y) |
| `bandBottom` | number | 0–1 | 0.98 | Bottom of seed band (normalized Y) |
| `xSpread` | number | 0–1 | 0.7 | Horizontal spread width |
| `xCenter` | number | 0–1 | 0.5 | Horizontal center |
| `lengthMin` | number | 0–1 | 0.08 | Min branch length fraction |
| `lengthMax` | number | 0–1 | 0.19 | Max branch length fraction |
| `strokeWidth` | number | 0.25–8 | — | Unified stroke width override (if set, replaces min/max pair) |
| `strokeWidthMin` | number | 0.25–6 | 1 | Min stroke width |
| `strokeWidthMax` | number | 0.25–8 | 3.4 | Max stroke width |
| `alpha` | number | 0–1 | 0.85 | Global opacity (preferred) |
| `opacity` | number | 0–1 | 0.85 | Legacy alias for `alpha` |
| `angleJitter` | number | 0–1 | 0.5 | Base angle jitter multiplier |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 90 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 180 | Auto-color hue range max |
| `sat` | number | 0–100 | 60 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 42 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 58 | Auto-color lightness max |
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
| `dotRadius` | number | 0.5–24 | 0.6–2.5 derived | Fixed dot size override |
| `dotRadiusRange` | [min, max] | 0.5–24 each | [0.6, 2.5] | Dot size range |
| `alpha` | number | 0–1 | 1 | Global opacity multiplier (preferred) |
| `opacity` | number | 0–1 | 1 | Legacy alias for `alpha` |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 210 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 340 | Auto-color hue range max |
| `sat` | number | 0–100 | 70 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 52 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 64 | Auto-color lightness max |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

Cost Notes: clamps `dots` by canvas size (`max(max(4000, floor(size^2 * 0.01)))`).

```json
{ "generatorId": "stipple_shade_v1", "seed": 42, "params": { "dots": 15000, "contrast": 1.2 } }
```

```json
{ "generatorId": "stipple_shade_v1", "seed": 6, "params": { "dots": 12000, "contrast": 1.05, "dotRadiusRange": [0.8, 2.8], "alpha": 0.7 } }
```

---

## ribbon_scribbles_v1

Flowing ribbon curves with bezier paths.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `ribbons` | int | 8–80 | 28 | Number of ribbon strokes |
| `strokeWidth` | number | 0.5–8 | 2.2 | Unified stroke width (preferred) |
| `width` | number | 0.5–8 | 2.2 | Legacy alias for `strokeWidth` |
| `alpha` | number | 0–1 | 0.9 | Global opacity (preferred) |
| `opacity` | number | 0–1 | 0.9 | Legacy alias for `alpha` |
| `translateJitter` | number | 0–0.5 | 0 | Start-position jitter fraction |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 200 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 360 | Auto-color hue range max |
| `sat` | number | 0–100 | 80 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 55 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 65 | Auto-color lightness max |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

Cost Notes: clamps per-ribbon segment count to bound curve ops.

```json
{ "generatorId": "ribbon_scribbles_v1", "seed": 42, "params": { "ribbons": 50, "strokeWidth": 3.5, "alpha": 0.8 } }
```

`accents` is deprecated on `ribbon_scribbles_v1`, `lsystem_garden_v1`, and `stipple_shade_v1`; requests including it return `deprecated_param`.

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
| `alpha` | number | 0–1 | 1 | Global opacity multiplier (preferred) |
| `opacity` | number | 0–1 | 1 | Legacy alias for `alpha` |
| `rotateJitter` | number | 0–1 | 0.2 | Per-layer rotation jitter |
| `scaleJitter` | number | 0–1 | 0 | Per-layer random scale jitter |
| `center` | [x, y] | 0–1 each | [0.5, 0.5] | Normalized center |
| `radiusScale` | number | 0.1–3 | 1 | Multiplier on base radius |
| `radiusClamp` | number | 0.1–1 | 0.45 | Clamp fraction of canvas size |
| `radiusMin` | number | 0–2 | 0.8 | Per-layer radius multiplier min |
| `radiusMax` | number | 0–2 | 1.15 | Per-layer radius multiplier max |
| `translateJitter` | number | 0–0.5 | 0 | Per-layer center jitter fraction |
| `scaleX` | number | 0.2–3 | 1 | Per-layer X scale |
| `scaleY` | number | 0.2–3 | 1 | Per-layer Y scale |
| `color` | string | CSS color | — | Single-color override (wins over palette/auto) |
| `hueMin` | number | 0–720 | 0 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 360 | Auto-color hue range max |
| `sat` | number | 0–100 | 70 | Auto-color saturation |
| `lightnessMin` | number | 0–100 | 60 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 60 | Auto-color lightness max |
| `strokeWeightRange` | [min, max] | 0.25–12 | [1, 2.5] | Stroke weight range |
| `palette` | string[] | 1–12 colors | auto | Custom color palette |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Layer-friendly background behavior |

```json
{ "generatorId": "fractal_polygon_wash_v1", "seed": 9, "params": { "layers": 6, "recursion": 3, "alphaFill": 0.06, "alphaStroke": 0.25 } }
```

```json
{
  "generatorId": "fractal_polygon_wash_v1",
  "seed": 42,
  "params": {
    "center": [0.35, 0.6],
    "radiusScale": 1.3,
    "radiusClamp": 0.6,
    "translateJitter": 0.08,
    "scaleJitter": 0.2,
    "radiusMin": 0.7,
    "radiusMax": 1.3
  }
}
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
| `strokeWidth` | number | 0–48 | — | Unified stroke width override (preferred over `stroke.width`) |
| `stroke` | object | — | — | `{ color, width }` outline |
| `alpha` | number | 0–1 | 1 | Unified layer opacity (preferred) |
| `opacity` | number | 0–1 | 1 | Layer opacity |
| `rings` | object[] | up to 64 | — | Per-ring overrides: `scale`, `size`, `offset`, `rotate`, `fill`, `stroke`, `opacity` |
| `ringCount` | int | 1–64 | 1 | Telescoping ring count |
| `ringScaleStep` | number | -0.9–0.9 | -0.08 | Scale delta per ring |
| `ringOffsetStep` | [x, y] | -512–512 each | [0, 0] | Offset delta per ring |
| `ringRotateStep` | number | -π–π | 0 | Rotation delta (rect/polygon) |
| `ringStrokeScale` | number | 0–2 | 1 | Stroke width multiplier per ring |
| `ringOpacityStep` | number | -1–1 | 0 | Opacity delta per ring |
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

```json
{
  "generatorId": "primitive_shape_v1",
  "seed": 1,
  "params": {
    "shape": "circle",
    "radius": 220,
    "fill": "transparent",
    "stroke": { "color": "#ffffff", "width": 4 },
    "ringCount": 8,
    "ringScaleStep": -0.1
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
| `alpha` | number | 0–1 | 0.5 | Unified opacity (preferred) |
| `opacity` | number | 0–1 | 0.5 | Legacy alias for `alpha` |
| `dotRadius` | number | 1–24 | 2 | Dot radius (`dots` mode) |
| `dotRadiusRange` | [min, max] | 0.5–24 each | — | Optional per-dot radius variation (`dots` mode) |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{ "generatorId": "grid_pattern_v1", "seed": 42, "params": { "mode": "crosshatch", "spacing": 12, "angle": 45, "alpha": 0.35 } }
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
| `dotRadius` | number | 0.5–200 | — | Fixed radius override |
| `dotRadiusRange` | [min, max] | 0.5–200 each | — | Radius range override (preferred) |
| `sizeRange` | [min, max] | 1–200 each | [4, 16] | Radius range |
| `distribution` | enum | "random", "poisson" | "random" | Placement mode |
| `minDistance` | number | 2–200 | 20 | Min spacing in `poisson` mode |
| `alpha` | number | 0–1 | 0.8 | Unified opacity (preferred) |
| `opacity` | number | 0–1 | 0.8 | Legacy alias for `alpha` |
| `color` | string | CSS color | — | Preferred single-color override (wins over `fill`, palette, auto) |
| `hueMin` | number | 0–720 | 220 | Auto-color hue range min |
| `hueMax` | number | 0–720 | 310 | Auto-color hue range max |
| `sat` | number | 0–100 | 0 | Auto-color saturation (defaults white when no color/fill/palette) |
| `lightnessMin` | number | 0–100 | 100 | Auto-color lightness min |
| `lightnessMax` | number | 0–100 | 100 | Auto-color lightness max |
| `fill` | string \| null | CSS color | null | Solid fill color override |
| `palette` | string[] | 1–12 colors | auto | Used when `fill` is null |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

Cost Notes: clamps `count` by canvas size (`min(count, max(100, floor(size^2 * 0.0012)))`).

```json
{
  "generatorId": "scatter_v1",
  "seed": 42,
  "params": {
    "shape": "square",
    "distribution": "poisson",
    "count": 180,
    "minDistance": 14,
    "dotRadiusRange": [3, 12],
    "alpha": 0.75,
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
| `alpha` | number | 0–1 | 0.6 | Unified opacity (preferred) |
| `opacity` | number | 0–1 | 0.6 | Legacy alias for `alpha` |
| `color` | string | CSS color | "#ffffff" | Line color |
| `background` | string | `"auto" \| "transparent" \| CSS color` | auto | Background behavior (`auto` defaults to transparent) |

```json
{ "generatorId": "hatching_v1", "seed": 42, "params": { "angle": 30, "cross": true, "spacing": 12, "jitter": 0.3, "alpha": 0.4 } }
```

---

## blob_field_v1

Organic metaball-like blobs for masks and texture layers.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `count` | int | 2–200 | 40 | Number of blob centers |
| `radiusMin` | number | 0.02–0.6 | 0.08 | Min blob radius (fraction of size) |
| `radiusMax` | number | 0.05–0.9 | 0.22 | Max blob radius (fraction of size) |
| `threshold` | number | 0.1–2.5 | 1 | Density threshold |
| `softness` | number | 0–1 | 0.25 | Edge softness |
| `jitter` | number | 0–0.5 | 0.08 | Position jitter fraction |
| `fill` | string | CSS color | "#ffffff" | Blob fill color |
| `outline` | object \| null | — | null | Optional `{ color, width, alpha }` |
| `background` | string | `"auto" \| "transparent" \| CSS color` | transparent | Background behavior |

```json
{
  "generatorId": "blob_field_v1",
  "seed": 4,
  "params": {
    "count": 30,
    "radiusMin": 0.05,
    "radiusMax": 0.18,
    "threshold": 1.1,
    "softness": 0.2,
    "fill": "#ffffff",
    "background": "transparent"
  }
}
```

---

## stripes_v1

Evenly spaced stripes or bands with optional wave distortion.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `spacing` | number | 4–200 | 18 | Distance between stripe centers |
| `width` | number | 1–200 | 8 | Stripe thickness |
| `angle` | number | -180–180 | 0 | Stripe angle (degrees) |
| `offset` | number | -200–200 | 0 | Stripe phase offset |
| `count` | int \| null | 1–500 | null | Optional fixed stripe count |
| `waveAmp` | number | 0–200 | 0 | Wave amplitude |
| `waveFreq` | number | 0–20 | 0 | Wave frequency |
| `wavePhase` | number | 0–2π | 0 | Wave phase |
| `color` | string | CSS color | "#ffffff" | Stripe color fallback |
| `alpha` | number | 0–1 | 0.8 | Stripe opacity |
| `palette` | string[] | 1–12 colors | — | Optional stripe palette cycling |
| `background` | string | `"auto" \| "transparent" \| CSS color` | transparent | Background behavior |

```json
{ "generatorId": "stripes_v1", "seed": 2, "params": { "spacing": 22, "width": 10, "angle": 45, "color": "#eaf4ff", "alpha": 0.6 } }
```

```json
{
  "generatorId": "stripes_v1",
  "seed": 7,
  "params": {
    "spacing": 16,
    "width": 6,
    "angle": 0,
    "waveAmp": 24,
    "waveFreq": 6,
    "alpha": 0.7,
    "palette": ["#0c1b2b", "#2e6cd4", "#eaf4ff"]
  }
}
```

---

## cellular_automata_v1

Deterministic 2D cellular automata grid for mask-friendly fills.

| Param | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| `rows` | int | 10–240 | 60 | Grid rows |
| `cols` | int | 10–240 | 40 | Grid columns |
| `steps` | int | 1–80 | 20 | Simulation steps |
| `seedDensity` | number | 0–1 | 0.3 | Initial alive probability |
| `wrap` | boolean | — | false | Wrap edges when counting neighbors |
| `birth` | int[] | 0–8 | [3] | Neighbor counts that create life |
| `survive` | int[] | 0–8 | [2,3,4,5] | Neighbor counts that keep life |
| `foreground` | string | CSS color | "#ffffff" | Alive cell fill color |
| `invert` | boolean | — | false | Invert alive/dead rendering |
| `background` | string | `"auto" \| "transparent" \| CSS color` | transparent | Background behavior |

Cost Notes: clamps `steps` by grid size to keep total simulation ops bounded.

```json
{
  "generatorId": "cellular_automata_v1",
  "seed": 42,
  "params": {
    "rows": 60,
    "cols": 12,
    "steps": 20,
    "seedDensity": 0.3,
    "birth": [3],
    "survive": [2, 3, 4, 5],
    "foreground": "#ffffff",
    "background": "transparent"
  }
}
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
