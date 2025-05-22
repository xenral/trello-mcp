import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloWorkspace } from '../types';
import { logger } from '../utils/logger';

/**
 * List all workspaces accessible to the user
 */
export const listWorkspaces: Tool = {
  name: 'list_workspaces',
  description: 'List all workspaces accessible to the user.',
  schema: z.object({}),
  handler: async () => {
    try {
      logger.debug('Listing all workspaces');
      
      const workspaces = await callTrelloApi<TrelloWorkspace[]>(
        'GET',
        '/members/me/organizations'
      );
      
      logger.debug(`Retrieved ${workspaces.length} workspaces`);
      
      return {
        workspaces: workspaces.map(workspace => ({
          id: workspace.id,
          name: workspace.name,
          displayName: workspace.displayName,
          url: workspace.url
        }))
      };
    } catch (error) {
      logger.error('Error listing workspaces:', error);
      throw error;
    }
  }
}; 