import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloCard } from '../types';
import { logger } from '../utils/logger';

/**
 * Get all cards from a specific list
 */
export const getCardsByListId: Tool = {
  name: 'get_cards_by_list_id',
  description: 'Fetch all cards from a specific list.',
  schema: z.object({
    listId: z.string().min(1, 'List ID is required')
  }),
  handler: async ({ listId }) => {
    try {
      logger.debug(`Getting cards for list ID: ${listId}`);
      
      const cards = await callTrelloApi<TrelloCard[]>(
        'GET',
        `/lists/${listId}/cards`,
        { filter: 'open' }
      );
      
      logger.debug(`Retrieved ${cards.length} cards from list ${listId}`);
      
      return {
        cards: cards.map(card => ({
          id: card.id,
          name: card.name,
          description: card.desc,
          url: card.url,
          shortUrl: card.shortUrl,
          dueDate: card.due,
          labels: card.labels.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color
          }))
        }))
      };
    } catch (error) {
      logger.error(`Error getting cards for list ${listId}:`, error);
      throw error;
    }
  }
}; 