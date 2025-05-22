import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi, getActiveBoardId } from '../utils/trello-api';
import { TrelloList } from '../types';
import { logger } from '../utils/logger';

/**
 * Get all lists from the active board
 */
export const getLists: Tool = {
  name: 'get_lists',
  description: 'Retrieve all lists from the currently active board.',
  schema: z.object({}),
  handler: async () => {
    try {
      logger.debug('Getting lists for active board');
      
      const boardId = getActiveBoardId();
      const lists = await callTrelloApi<TrelloList[]>(
        'GET',
        `/boards/${boardId}/lists`,
        { filter: 'open' }
      );
      
      logger.debug(`Retrieved ${lists.length} lists`);
      
      return {
        lists: lists.map(list => ({
          id: list.id,
          name: list.name,
          position: list.pos
        }))
      };
    } catch (error) {
      logger.error('Error getting lists:', error);
      throw error;
    }
  }
}; 