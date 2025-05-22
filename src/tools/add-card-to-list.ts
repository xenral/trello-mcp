import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloCard } from '../types';
import { logger } from '../utils/logger';

/**
 * Add a new card to a list
 */
export const addCardToList: Tool = {
  name: 'add_card_to_list',
  description: 'Add a new card to a specified list.',
  schema: z.object({
    listId: z.string().min(1, 'List ID is required'),
    name: z.string().min(1, 'Card name is required'),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    labels: z.array(z.string()).optional()
  }),
  handler: async ({ listId, name, description, dueDate, labels }) => {
    try {
      logger.debug(`Adding card "${name}" to list ${listId}`);
      
      const cardData: Record<string, any> = {
        name,
        idList: listId,
        pos: 'bottom'
      };
      
      if (description) {
        cardData.desc = description;
      }
      
      if (dueDate) {
        cardData.due = dueDate;
      }
      
      if (labels && labels.length > 0) {
        cardData.idLabels = labels.join(',');
      }
      
      const card = await callTrelloApi<TrelloCard>(
        'POST',
        '/cards',
        {},
        cardData
      );
      
      logger.debug(`Card created with ID: ${card.id}`);
      
      return {
        card: {
          id: card.id,
          name: card.name,
          url: card.url,
          shortUrl: card.shortUrl
        }
      };
    } catch (error) {
      logger.error(`Error adding card to list ${listId}:`, error);
      throw error;
    }
  }
}; 