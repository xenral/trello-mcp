import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloCard } from '../types';
import { logger } from '../utils/logger';

/**
 * Move a card from one list to another
 */
export const moveCard: Tool = {
  name: 'move_card',
  description: 'Move a card from one list to another.',
  schema: z.object({
    cardId: z.string().min(1, 'Card ID is required'),
    listId: z.string().min(1, 'Target list ID is required'),
    position: z.string().optional().default('bottom')
  }),
  handler: async ({ cardId, listId, position }) => {
    try {
      logger.debug(`Moving card ${cardId} to list ${listId} at position ${position}`);
      
      const updatedCard = await callTrelloApi<TrelloCard>(
        'PUT',
        `/cards/${cardId}`,
        {},
        {
          idList: listId,
          pos: position
        }
      );
      
      logger.debug(`Card ${cardId} moved successfully to list ${listId}`);
      
      return {
        success: true,
        card: {
          id: updatedCard.id,
          name: updatedCard.name,
          listId: updatedCard.idList,
          url: updatedCard.url,
          shortUrl: updatedCard.shortUrl
        }
      };
    } catch (error) {
      logger.error(`Error moving card ${cardId} to list ${listId}:`, error);
      throw error;
    }
  }
}; 