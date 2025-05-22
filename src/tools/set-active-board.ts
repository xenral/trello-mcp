import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloBoard } from '../types';
import { logger } from '../utils/logger';
import { updateStoredConfig } from '../utils/config';

/**
 * Set the active board for future operations
 */
export const setActiveBoard: Tool = {
  name: 'set_active_board',
  description: 'Set the active board for future operations.',
  schema: z.object({
    boardId: z.string().min(1, 'Board ID is required')
  }),
  handler: async ({ boardId }) => {
    try {
      logger.debug(`Setting active board to: ${boardId}`);
      
      // Verify the board exists and is accessible
      const board = await callTrelloApi<TrelloBoard>(
        'GET',
        `/boards/${boardId}`,
        { fields: 'name,url,shortUrl' }
      );
      
      // Update stored configuration
      updateStoredConfig({ activeBoardId: boardId });
      
      logger.info(`Active board set to: ${board.name} (${boardId})`);
      
      return {
        success: true,
        board: {
          id: board.id,
          name: board.name,
          url: board.url,
          shortUrl: board.shortUrl
        }
      };
    } catch (error) {
      logger.error(`Error setting active board to ${boardId}:`, error);
      throw error;
    }
  }
}; 