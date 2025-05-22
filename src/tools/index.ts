import { z } from 'zod';
import { Tool } from '../types';
import { getCardsByListId } from './get-cards-by-list-id';
import { getLists } from './get-lists';
import { getRecentActivity } from './get-recent-activity';
import { addCardToList } from './add-card-to-list';
import { updateCardDetails } from './update-card-details';
import { moveCard } from './move-card';
import { listBoards } from './list-boards';
import { setActiveBoard } from './set-active-board';
import { listWorkspaces } from './list-workspaces';
import { getActiveBoardInfo } from './get-active-board-info';

// Export all tools
export const tools: Tool[] = [
  getCardsByListId,
  getLists,
  getRecentActivity,
  addCardToList,
  updateCardDetails,
  moveCard,
  listBoards,
  setActiveBoard,
  listWorkspaces,
  getActiveBoardInfo
]; 