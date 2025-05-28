import axios from 'axios';
import { loadConfig } from './config';
import { logger } from './logger';
import { TokenBucket } from '../types';

// Base URL for Trello API
const API_BASE_URL = 'https://api.trello.com/1';

// Load initial configuration so we can set up rate limiting buckets. We will
// reload the configuration inside each function when up-to-date values are
// required.
const initialConfig = loadConfig();

// Create token buckets for rate limiting
// Trello API limits: 300 requests per 10 seconds per API key, 100 requests per 10 seconds per token
const apiKeyBucket: TokenBucket = {
  tokens: initialConfig.API_KEY_RATE_LIMIT || 300,
  lastRefill: Date.now(),
  capacity: initialConfig.API_KEY_RATE_LIMIT || 300,
  refillRate: 10000 // 10 seconds in milliseconds
};

const tokenBucket: TokenBucket = {
  tokens: initialConfig.TOKEN_RATE_LIMIT || 100,
  lastRefill: Date.now(),
  capacity: initialConfig.TOKEN_RATE_LIMIT || 100,
  refillRate: 10000 // 10 seconds in milliseconds
};

/**
 * Refill tokens in a bucket based on elapsed time
 */
function refillBucket(bucket: TokenBucket): void {
  const now = Date.now();
  const elapsedTime = now - bucket.lastRefill;
  
  if (elapsedTime >= bucket.refillRate) {
    // Refill tokens
    bucket.tokens = bucket.capacity;
    bucket.lastRefill = now;
  }
}

/**
 * Take a token from a bucket if available
 */
function takeToken(bucket: TokenBucket): boolean {
  refillBucket(bucket);
  
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }
  
  return false;
}

/**
 * Wait for rate limit to reset
 */
async function waitForRateLimit(): Promise<void> {
  logger.debug('Rate limit reached, waiting for reset...');
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Make a rate-limited API call to Trello
 */
export async function callTrelloApi<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  params: Record<string, any> = {},
  data: Record<string, any> = {}
): Promise<T> {
  // Load the latest configuration for credentials
  const { TRELLO_API_KEY, TRELLO_TOKEN } = loadConfig();

  // Add API key and token to params
  const apiParams = {
    ...params,
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN
  };

  // Apply rate limiting
  while (!takeToken(apiKeyBucket) || !takeToken(tokenBucket)) {
    await waitForRateLimit();
  }

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      params: apiParams,
      data: method !== 'GET' ? data : undefined
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        logger.error(`Trello API error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        throw new Error(`Trello API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        logger.error('Trello API request failed with no response');
        throw new Error('Trello API request failed with no response');
      }
    }
    
    logger.error(`Trello API error: ${error}`);
    throw error;
  }
}

/**
 * Get the active board ID
 */
export function getActiveBoardId(): string {
  const { TRELLO_BOARD_ID } = loadConfig();
  if (!TRELLO_BOARD_ID) {
    throw new Error('No active board ID set. Set TRELLO_BOARD_ID in environment or use set_active_board tool');
  }
  return TRELLO_BOARD_ID;
}

/**
 * Get the active workspace ID
 */
export function getActiveWorkspaceId(): string {
  const { TRELLO_WORKSPACE_ID } = loadConfig();
  if (!TRELLO_WORKSPACE_ID) {
    throw new Error('No active workspace ID set. Set TRELLO_WORKSPACE_ID in environment or use set_active_workspace tool');
  }
  return TRELLO_WORKSPACE_ID;
}
