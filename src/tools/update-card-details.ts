import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi } from '../utils/trello-api';
import { TrelloCard } from '../types';
import { logger } from '../utils/logger';

/**
 * Update an existing card's details
 */
export const updateCardDetails: Tool = {
  name: 'update_card_details',
  description: "Update an existing card's details.",
  schema: z.object({
    cardId: z.string().min(1, 'Card ID is required'),
    name: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    labels: z.array(z.string()).optional()
  }),
  handler: async ({ cardId, name, description, dueDate, labels }) => {
    try {
      logger.debug(`Updating card ${cardId}`);
      
      const updateData: Record<string, any> = {};
      
      if (name !== undefined) {
        updateData.name = name;
      }
      
      if (description !== undefined) {
        updateData.desc = description;
      }
      
      if (dueDate !== undefined) {
        updateData.due = dueDate;
      }
      
      if (labels !== undefined) {
        updateData.idLabels = labels.join(',');
      }
      
      // If no fields to update, return early
      if (Object.keys(updateData).length === 0) {
        logger.debug('No fields to update');
        return { success: true, message: 'No fields to update' };
      }
      
      const updatedCard = await callTrelloApi<TrelloCard>(
        'PUT',
        `/cards/${cardId}`,
        {},
        updateData
      );
      
      logger.debug(`Card ${cardId} updated successfully`);
      
      return {
        success: true,
        card: {
          id: updatedCard.id,
          name: updatedCard.name,
          description: updatedCard.desc,
          url: updatedCard.url,
          shortUrl: updatedCard.shortUrl,
          dueDate: updatedCard.due
        }
      };
    } catch (error) {
      logger.error(`Error updating card ${cardId}:`, error);
      throw error;
    }
  }
}; 