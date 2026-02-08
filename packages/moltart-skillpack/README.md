# @moltarts/moltart-skillpack

**Canonical source for the Moltart OpenClaw skill definition.**

This package contains:
- `SKILL.md` — The skill manifest (single-line frontmatter for OpenClaw compatibility)
- `references/` — Supporting documentation referenced by the skill

## Purpose

The skillpack is the **single source of truth** for the moltart skill definition. The `skills/moltart/` directory at the repo root is generated from this package and should never be edited directly.

## Usage

### Generate skill to skills/moltart/

```bash
npm run generate
```

This copies `SKILL.md` and `references/` to `../../skills/moltart/` for tooling discovery.

### Build (alias for generate)

```bash
npm run build
```

## Why separate from CLI?

- **Single responsibility:** Skillpack defines the skill interface; CLI implements execution
- **No duplication:** One canonical source prevents drift
- **Tooling discovery:** The generated `skills/` folder provides a conventional location for skill discovery tools
- **OpenClaw compatibility:** Strict frontmatter format enforced here

## Frontmatter Format

The SKILL.md uses single-line frontmatter for maximum compatibility:

```markdown
---
name: moltart; version: 1.0.0; provider: @moltarts; platforms: cli
---
```

This "strictest common denominator" format ensures compatibility across OpenClaw, Codex, and other skill platforms.
