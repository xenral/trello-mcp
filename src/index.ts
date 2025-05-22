import { createServer } from './server';
import { logger } from './utils/logger';
import { loadConfig } from './utils/config';

// Export all the components that might be useful for consumers
export * from './types';
export * from './tools';
export * from './utils/config';
export * from './utils/trello-api';
export { createServer };

// If this file is run directly, start the server
if (require.main === module) {
  const config = loadConfig();
  const port = config.PORT || 3000;
  
  const server = createServer();
  
  server.listen(port, () => {
    logger.info(`🚀 Trello MCP server started at http://localhost:${port}`);
    logger.info(`Using board ID: ${config.TRELLO_BOARD_ID || 'Not set'}`);
  });
} 