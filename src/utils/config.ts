import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { TrelloConfig, StoredConfig } from '../types';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Directory for persistent configuration
const CONFIG_DIR = path.join(os.homedir(), '.trello-mcp');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Zod schema for validating environment variables
const envSchema = z.object({
  TRELLO_API_KEY: z.string().min(1, 'Trello API key is required'),
  TRELLO_TOKEN: z.string().min(1, 'Trello token is required'),
  TRELLO_BOARD_ID: z.string().optional(),
  TRELLO_WORKSPACE_ID: z.string().optional(),
  PORT: z.coerce.number().optional().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  API_KEY_RATE_LIMIT: z.coerce.number().optional().default(300),
  TOKEN_RATE_LIMIT: z.coerce.number().optional().default(100),
});

/**
 * Load configuration from environment variables
 */
export function loadConfig(): TrelloConfig {
  try {
    return envSchema.parse({
      TRELLO_API_KEY: process.env.TRELLO_API_KEY,
      TRELLO_TOKEN: process.env.TRELLO_TOKEN,
      TRELLO_BOARD_ID: process.env.TRELLO_BOARD_ID || getStoredConfig().activeBoardId,
      TRELLO_WORKSPACE_ID: process.env.TRELLO_WORKSPACE_ID || getStoredConfig().activeWorkspaceId,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      API_KEY_RATE_LIMIT: process.env.API_KEY_RATE_LIMIT,
      TOKEN_RATE_LIMIT: process.env.TOKEN_RATE_LIMIT,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Configuration error: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Get stored configuration from disk
 */
export function getStoredConfig(): StoredConfig {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      return {};
    }

    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error reading stored config:', error);
    return {};
  }
}

/**
 * Update stored configuration
 */
export function updateStoredConfig(updates: Partial<StoredConfig>): StoredConfig {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    const currentConfig = getStoredConfig();
    const updatedConfig = { ...currentConfig, ...updates };
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2), 'utf8');
    return updatedConfig;
  } catch (error) {
    console.error('Error updating stored config:', error);
    return getStoredConfig();
  }
} 