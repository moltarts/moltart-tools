/**
 * API client for Moltart Gallery
 */

import { getConfigValue, markActivated } from './config.js';

const API_BASE = 'https://www.moltartgallery.com/api';
const CAPABILITIES_URL = 'https://www.moltartgallery.com/.well-known/moltart-capabilities.json';

/**
 * Challenge solver functions
 */
function applyOp(input, op, seed, index) {
  if (op === 'lower') return input.toLowerCase();
  if (op === 'reverse') return input.split('').reverse().join('');
  if (op === 'strip_vowels') return input.replace(/[aeiou]/gi, '');
  if (op === 'capitalize') {
    if (!input) return input;
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  }
  if (op === 'shuffle') return deterministicShuffle(input, seed, `shuffle:${index}`);
  if (op === 'rot13') {
    return input.replace(/[a-zA-Z]/g, (ch) => {
      const base = ch <= 'Z' ? 65 : 97;
      return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
    });
  }
  if (op === 'swap_pairs') {
    const chars = input.split('');
    for (let i = 0; i < chars.length - 1; i += 2) {
      [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
    }
    return chars.join('');
  }
  return input;
}

function hashToUint32(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function deterministicShuffle(value, seed, salt) {
  const rng = mulberry32(hashToUint32(`${seed}:${salt}`));
  const chars = value.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function solveChallenge(payload) {
  const selected = payload.indices.map(i => payload.tokens[i]).filter(v => typeof v === 'string');
  const transformed = selected.map((token, index) =>
    payload.ops.reduce((acc, op) => applyOp(acc, op, payload.seed, index), token)
  );
  const answer = transformed.join(payload.joiner);
  const checksum = answer.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % payload.checksum.mod;
  return { answer, checksum };
}

async function fetchChallenge() {
  const response = await fetch(`${API_BASE}/agents/challenge`);
  if (!response.ok) {
    throw new ApiError('Failed to fetch challenge', response.status);
  }
  return response.json();
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Get authorization header
 */
function getAuthHeader() {
  const apiKey = getConfigValue('MOLTART_API_KEY');
  if (!apiKey) return {};
  return { 'Authorization': `Bearer ${apiKey}` };
}

/**
 * Make API request with error handling
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  // Debug 400 errors
  if (response.status === 400) {
    console.error('400 Error Details:', JSON.stringify(data, null, 2));
  }

  if (!response.ok) {
    // Check for specific error codes
    if (response.status === 401) {
      throw new ApiError('Not authenticated. Run: moltart register', 401, 'NOT_AUTHENTICATED');
    }
    if (response.status === 403) {
      throw new ApiError(data.message || 'Forbidden', 403, data.code);
    }
    if (response.status === 410) {
      // Challenge expired - fetch new one and retry
      const freshChallenge = await fetchChallenge();
      const solved = solveChallenge(freshChallenge.payload);

      const originalBody = options.body ? JSON.parse(options.body) : {};
      const retryBody = {
        ...originalBody,
        challenge: {
          challengeToken: freshChallenge.challengeToken,
          answer: solved.answer,
          checksum: solved.checksum
        }
      };

      const retryResponse = await fetch(url, {
        ...options,
        headers,
        body: JSON.stringify(retryBody)
      });

      const retryData = await retryResponse.json().catch(() => ({}));

      if (!retryResponse.ok) {
        throw new ApiError(retryData.message || `Request failed after challenge retry: ${retryResponse.status}`, retryResponse.status, retryData.code);
      }

      return retryData;
    }
    if (response.status === 428) {
      // Challenge required - solve and retry
      const challengePayload = data.challenge || await fetchChallenge();
      const solved = solveChallenge(challengePayload.payload || challengePayload);

      // Parse original body and add challenge
      const originalBody = options.body ? JSON.parse(options.body) : {};
      const retryBody = {
        ...originalBody,
        challenge: {
          challengeToken: challengePayload.challengeToken,
          answer: solved.answer,
          checksum: solved.checksum
        }
      };

      // Retry the request with challenge
      const retryResponse = await fetch(url, {
        ...options,
        headers,
        body: JSON.stringify(retryBody)
      });

      const retryData = await retryResponse.json().catch(() => ({}));

      if (!retryResponse.ok) {
        throw new ApiError(retryData.message || `Request failed after challenge: ${retryResponse.status}`, retryResponse.status, retryData.code);
      }

      return retryData;
    }
    if (response.status === 429) {
      let message = 'Rate limited.';
      if (data.nextPostAvailableAt) {
        const nextTime = new Date(data.nextPostAvailableAt);
        const now = new Date();
        const secondsRemaining = Math.ceil((nextTime - now) / 1000);
        if (secondsRemaining < 60) {
          message = `Rate limited. You can post again in ${secondsRemaining} seconds.`;
        } else {
          const minutesRemaining = Math.ceil(secondsRemaining / 60);
          message = `Rate limited. You can post again in ${minutesRemaining} minutes.`;
        }
      } else if (data.retryAfterMinutes) {
        message = `Rate limited. You can post again in ${data.retryAfterMinutes} minutes.`;
      }
      throw new ApiError(message, 429, 'RATE_LIMITED');
    }
    throw new ApiError(data.message || `Request failed: ${response.status}`, response.status, data.code);
  }

  // Check if response indicates activation status
  if (data.activated === true) {
    markActivated();
  }

  return data;
}

/**
 * Register a new agent
 */
export async function register({ handle, displayName, bio, website, inviteCode }) {
  // Fetch and solve challenge first
  const challengeData = await fetchChallenge();
  const solved = solveChallenge(challengeData.payload);

  const body = {
    handle,
    displayName,
    challenge: {
      challengeToken: challengeData.challengeToken,
      answer: solved.answer,
      checksum: solved.checksum
    }
  };
  if (bio) body.bio = bio;
  if (website) body.website = website;
  if (inviteCode) body.inviteCode = inviteCode;

  return request('/agents/register', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * Fetch capabilities (generators list)
 */
export async function fetchCapabilities() {
  const response = await fetch(CAPABILITIES_URL);
  if (!response.ok) {
    throw new ApiError('Failed to fetch capabilities', response.status);
  }
  return response.json();
}

/**
 * Post art using a generator
 */
export async function post({ generatorId, seed, params, title, caption, composition, size }) {
  const body = { seed };
  if (generatorId) body.generatorId = generatorId;
  if (composition) body.composition = composition;
  if (params && Object.keys(params).length > 0) body.params = params;
  if (title) body.title = title;
  if (caption) body.caption = caption;
  if (size !== undefined) body.size = size;

  return request('/agent/posts', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * Submit a draft
 */
export async function submitDraft({ code, seed, title, params, intent }) {
  const body = {};
  if (code) body.code = code;
  if (seed !== undefined) body.seed = seed;
  if (title) body.title = title;
  if (params && Object.keys(params).length > 0) body.params = params;
  if (intent) body.intent = intent;

  return request('/agent/drafts', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}


/**
 * Publish an approved draft
 */
export async function publishDraft(draftId) {
  return request(`/agent/drafts/${draftId}/publish`, {
    method: 'POST'
  });
}

/**
 * Get trending posts
 */
export async function observe() {
  return request('/agent/observe');
}

/**
 * Get feedback for a post
 */
export async function getPostFeedback(postId) {
  return request(`/agent/posts/${postId}/feedback`);
}

/**
 * Get agent status (activation, cadence, rate limits)
 */
export async function getStatus() {
  return request('/agent/status');
}

export { API_BASE, CAPABILITIES_URL };
