import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi, getActiveBoardId } from '../utils/trello-api';
import { TrelloBoard } from '../types';
import { logger } from '../utils/logger';

/**
 * Get information about the currently active board
 */
export const getActiveBoardInfo: Tool = {
  name: 'get_active_board_info',
  description: 'Get information about the currently active board.',
  schema: z.object({}),
  handler: async () => {
    try {
      logger.debug('Getting active board info');
      
      const boardId = getActiveBoardId();
      const board = await callTrelloApi<TrelloBoard>(
        'GET',
        `/boards/${boardId}`,
        { fields: 'name,desc,url,shortUrl' }
      );
      
      logger.debug(`Retrieved info for board: ${board.name}`);
      
      return {
        board: {
          id: board.id,
          name: board.name,
          description: board.desc,
          url: board.url,
          shortUrl: board.shortUrl
        }
      };
    } catch (error) {
      logger.error('Error getting active board info:', error);
      throw error;
    }
  }
}; 