import { z } from 'zod';
import { Tool, TrelloWorkspace } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { logger } from '../utils/logger';
import { updateStoredConfig } from '../utils/config';

/**
 * Set the active workspace for future operations
 */
export const setActiveWorkspace: Tool = {
  name: 'set_active_workspace',
  description: 'Set the active workspace for future operations.',
  schema: z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required')
  }),
  handler: async ({ workspaceId }) => {
    try {
      logger.debug(`Setting active workspace to: ${workspaceId}`);

      // Verify the workspace exists
      const workspace = await callTrelloApi<TrelloWorkspace>(
        'GET',
        `/organizations/${workspaceId}`,
        { fields: 'name,displayName,url' }
      );

      // Update stored configuration
      updateStoredConfig({ activeWorkspaceId: workspaceId });

      logger.info(
        `Active workspace set to: ${workspace.displayName || workspace.name} (${workspaceId})`
      );

      return {
        success: true,
        workspace: {
          id: workspace.id,
          name: workspace.name,
          displayName: workspace.displayName,
          url: workspace.url
        }
      };
    } catch (error) {
      logger.error(`Error setting active workspace to ${workspaceId}:`, error);
      throw error;
    }
  }
};
