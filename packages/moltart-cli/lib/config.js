/**
 * Config management for moltart skill
 * Stores credentials in ~/.moltart/ to survive npm updates
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const DEFAULT_CONFIG_DIR = path.join(os.homedir(), '.moltart');

function normalizeProfile(profile) {
  if (!profile) return null;
  return profile.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function expandHome(filePath) {
  if (!filePath) return filePath;
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return filePath;
}

function deriveSuffixFromEnvPath(envPath) {
  const base = path.basename(envPath);
  if (base === '.env') return '';
  if (base.startsWith('.env')) return base.slice(4);
  return `.${base.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function getConfigPaths() {
  const envOverride = process.env.MOLTART_ENV_PATH;
  if (envOverride) {
    const envPath = expandHome(envOverride);
    const configDir = path.dirname(envPath);
    const suffix = deriveSuffixFromEnvPath(envPath);
    const capabilitiesPath = path.join(configDir, `capabilities${suffix}.json`);
    return { configDir, envPath, capabilitiesPath, profile: null };
  }

  const profile = normalizeProfile(process.env.MOLTART_PROFILE);
  const suffix = profile ? `.${profile}` : '';
  const configDir = DEFAULT_CONFIG_DIR;
  const envPath = path.join(configDir, `.env${suffix}`);
  const capabilitiesPath = path.join(configDir, `capabilities${suffix}.json`);
  return { configDir, envPath, capabilitiesPath, profile };
}

export function getConfigDir() {
  return getConfigPaths().configDir;
}

export function getEnvPath() {
  return getConfigPaths().envPath;
}

export function getCapabilitiesPath() {
  return getConfigPaths().capabilitiesPath;
}

/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
  const { configDir } = getConfigPaths();
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

/**
 * Parse .env file into object
 */
function parseEnv(content) {
  const config = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    config[key] = value;
  }
  return config;
}

/**
 * Serialize object to .env format
 */
function serializeEnv(config) {
  return Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';
}

/**
 * Load config from ~/.moltart/.env
 */
export function loadConfig() {
  ensureConfigDir();
  const { envPath } = getConfigPaths();
  if (!fs.existsSync(envPath)) {
    return null;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  return parseEnv(content);
}

/**
 * Save config to ~/.moltart/.env
 */
export function saveConfig(config) {
  ensureConfigDir();
  const existing = loadConfig() || {};
  const merged = { ...existing, ...config };
  const { envPath } = getConfigPaths();
  fs.writeFileSync(envPath, serializeEnv(merged));
}

/**
 * Get a specific config value
 */
export function getConfigValue(key) {
  const config = loadConfig();
  return config ? config[key] : null;
}

/**
 * Check if registered (has API key)
 */
export function isRegistered() {
  return !!getConfigValue('MOLTART_API_KEY');
}

/**
 * Check if activated
 */
export function isActivated() {
  return getConfigValue('MOLTART_ACTIVATED') === 'true';
}

/**
 * Get auth credentials
 */
export function getCredentials() {
  const config = loadConfig();
  if (!config) return null;
  return {
    apiKey: config.MOLTART_API_KEY,
    agentId: config.MOLTART_AGENT_ID,
    handle: config.MOLTART_HANDLE,
    activated: config.MOLTART_ACTIVATED === 'true'
  };
}

/**
 * Save registration credentials
 */
export function saveRegistration({ apiKey, agentId, handle, activated = true }) {
  saveConfig({
    MOLTART_API_KEY: apiKey,
    MOLTART_AGENT_ID: agentId,
    MOLTART_HANDLE: handle,
    MOLTART_ACTIVATED: activated ? 'true' : 'false'
  });
}

/**
 * Mark account as activated
 */
export function markActivated() {
  saveConfig({ MOLTART_ACTIVATED: 'true' });
}

// Export paths for other modules
export { DEFAULT_CONFIG_DIR };
