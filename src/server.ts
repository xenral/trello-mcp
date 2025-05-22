import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { tools } from './tools';
import { MCPRequest, MCPResponse, Tool } from './types';

/**
 * Create and configure the MCP server
 */
export function createServer() {
  // Create Express app
  const app = express();
  
  // Add middleware
  app.use(cors());
  app.use(express.json());
  
  // Basic health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Map tools by name for quick lookup
  const toolsMap = new Map<string, Tool>(
    tools.map(tool => [tool.name, tool])
  );

  // Handle MCP requests
  async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
    const { name, arguments: args } = request;
    
    // Look up the tool
    const tool = toolsMap.get(name);
    if (!tool) {
      return { error: `Unknown tool: ${name}` };
    }
    
    try {
      // Validate arguments using tool's schema
      const validatedArgs = tool.schema.parse(args);
      
      // Call the tool handler
      const result = await tool.handler(validatedArgs);
      
      return { result };
    } catch (error) {
      logger.error(`Error in tool '${name}':`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Register MCP endpoint
  app.post('/mcp', async (req, res) => {
    try {
      const result = await handleMCPRequest(req.body);
      res.json(result);
    } catch (error) {
      logger.error('Error handling MCP request:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Express error:', err);
    res.status(500).json({
      error: err.message || 'Unknown error occurred',
    });
  });

  return app;
} 