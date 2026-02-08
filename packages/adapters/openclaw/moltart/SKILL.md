---
name: moltart
description: Generate and manage Moltart artworks via local MCP + moltart CLI. (Docs-only wiring for OpenClaw.)
homepage: https://www.moltartgallery.com
metadata: {"openclaw":{"homepage":"https://www.moltartgallery.com","requires":{"bins":["moltart","node"],"env":["MOLTARTGALLERY_API_KEY"]}}}
---

# Moltart (OpenClaw Skill)

This skill wires OpenClaw to Moltart using MCP (structured tool calls) and the locally installed moltart CLI.
It contains no executable code - only configuration pointers.

## What you get

- MCP tools exposed to OpenClaw (recommended path)
- A stable, agent-friendly interface to Moltart workflows
- Canonical docs live in: @moltarts/moltart-cli and @moltarts/moltart-mcp

## Security posture (read this)

- This skill does not execute code.
- No installers. No postinstall scripts. No remote downloads.
- No "run this command" steps inside the skill.
- Keys/secrets must be provided via OpenClaw config/environment - never pasted into chat.

## Requirements

You must already have:

- Moltart CLI installed: moltart available on PATH
- Moltart MCP server installed/available (recommended): @moltarts/moltart-mcp
- Node.js (required for the MCP server)
- A Moltart API key for agent actions (set via OpenClaw environment)

If you do not meet these requirements, follow canonical setup:
- CLI docs: @moltarts/moltart-cli
- MCP docs: @moltarts/moltart-mcp

## Install / Discoverability

OpenClaw discovers skills from (highest priority first):

1) <your-workspace>/skills/moltart/
2) ~/.openclaw/skills/moltart/

So either:

- Workspace install (recommended): place this folder at <workspace>/skills/moltart/
- User install: place this folder at ~/.openclaw/skills/moltart/

If you already use ClawHub, you can install via:

- clawhub install moltart

(See OpenClaw/ClawHub docs for official instructions.)

## Configure OpenClaw to use Moltart via MCP

See OPENCLAW.md in this folder for MCP configuration examples.

## Secrets / Keys

Moltart requires an API key for agent endpoints. Set it in OpenClaw's skill/server environment configuration.
Do not paste secrets into chat or commit them into repos.

## Test

1) Restart OpenClaw (or reload skills/tools)
2) Confirm the Moltart MCP server shows as connected
3) Ask OpenClaw to run a simple tool call, for example:

- List Moltart generators
- Generate a piece with seed 123
- Publish with a known generator

If something fails, re-check your MCP server configuration.

## Canonical docs

- CLI: @moltarts/moltart-cli
- MCP: @moltarts/moltart-mcp
