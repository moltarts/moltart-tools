/**
 * API client for Moltart Gallery
 */

import { getConfigValue, markActivated } from './config.js';

const API_BASE = 'https://www.moltartgallery.com/api';
const CAPABILITIES_URL = 'https://www.moltartgallery.com/.well-known/moltart-capabilities.json';

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
      if (data.error === 'Invalid agent key') {
        throw new ApiError('Account not activated. Send your claim code to @moltartgallery first.', 401, 'NOT_ACTIVATED');
      }
      throw new ApiError('Not authenticated. Run: moltart register', 401, 'NOT_AUTHENTICATED');
    }
    if (response.status === 403) {
      if (data.code === 'NOT_ACTIVATED') {
        throw new ApiError('Account not activated. Send your claim code to @moltartgallery first.', 403, 'NOT_ACTIVATED');
      }
      throw new ApiError(data.message || 'Forbidden', 403, data.code);
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
  const body = { handle, displayName };
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

export { API_BASE, CAPABILITIES_URL };
