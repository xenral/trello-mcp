import { z } from 'zod';
import { Tool } from '../types';
import { callTrelloApi, getActiveBoardId } from '../utils/trello-api';
import { TrelloActivity } from '../types';
import { logger } from '../utils/logger';

/**
 * Get recent activity on the active board
 */
export const getRecentActivity: Tool = {
  name: 'get_recent_activity',
  description: 'Fetch recent activity on the currently active board.',
  schema: z.object({
    limit: z.number().optional().default(10)
  }),
  handler: async ({ limit }) => {
    try {
      logger.debug(`Getting recent activity (limit: ${limit})`);
      
      const boardId = getActiveBoardId();
      const activities = await callTrelloApi<TrelloActivity[]>(
        'GET',
        `/boards/${boardId}/actions`,
        { limit }
      );
      
      logger.debug(`Retrieved ${activities.length} activities`);
      
      return {
        activities: activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          date: activity.date,
          memberCreator: {
            id: activity.memberCreator.id,
            fullName: activity.memberCreator.fullName,
            username: activity.memberCreator.username
          },
          data: activity.data
        }))
      };
    } catch (error) {
      logger.error('Error getting recent activity:', error);
      throw error;
    }
  }
}; 