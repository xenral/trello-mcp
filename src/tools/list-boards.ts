import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloBoard } from '../types';
import { logger } from '../utils/logger';

/**
 * List all boards accessible to the user
 */
export const listBoards: Tool = {
  name: 'list_boards',
  description: 'List all boards accessible to the user.',
  schema: z.object({}),
  handler: async () => {
    try {
      logger.debug('Listing all boards');
      
      const boards = await callTrelloApi<TrelloBoard[]>(
        'GET',
        '/members/me/boards',
        { filter: 'open' }
      );
      
      logger.debug(`Retrieved ${boards.length} boards`);
      
      return {
        boards: boards.map(board => ({
          id: board.id,
          name: board.name,
          description: board.desc,
          url: board.url,
          shortUrl: board.shortUrl
        }))
      };
    } catch (error) {
      logger.error('Error listing boards:', error);
      throw error;
    }
  }
}; 