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

  // Register MCP GET endpoint to expose tools to Cursor
  app.get('/mcp', (req, res) => {
    const toolDefinitions = tools.map(tool => {
      // Convert Zod schema to JSON Schema
      // This is a simplified conversion that works for our basic schemas
      const zodToJsonSchema = (schema: any) => {
        try {
          // For simple schemas, we can extract some basic information
          const shape = schema.shape || {};
          const properties: Record<string, any> = {};
          const required: string[] = [];
          
          // Process each property in the schema
          Object.entries(shape).forEach(([key, value]: [string, any]) => {
            // Determine if the field is required
            if (!value.isOptional?.()) {
              required.push(key);
            }
            
            // Determine the type
            let type: string;
            let items: any;
            
            if (value._def?.typeName === 'ZodString') {
              type = 'string';
            } else if (value._def?.typeName === 'ZodNumber') {
              type = 'number';
            } else if (value._def?.typeName === 'ZodBoolean') {
              type = 'boolean';
            } else if (value._def?.typeName === 'ZodArray') {
              type = 'array';
              items = zodToJsonSchema(value._def.type);
            } else if (value._def?.typeName === 'ZodObject') {
              type = 'object';
              const nestedSchema = zodToJsonSchema(value);
              properties[key] = nestedSchema;
              return;
            } else {
              type = 'string'; // Default to string for unknown types
            }
            
            // Add the property to our schema
            properties[key] = { type };
            if (type === 'array' && items) {
              properties[key].items = items;
            }
            
            // Add description if available
            if (value.description) {
              properties[key].description = value.description;
            }
          });
          
          return {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined
          };
        } catch (error) {
          logger.error('Error converting schema:', error);
          return { type: 'object', properties: {} };
        }
      };
      
      return {
        name: `trello-mcp_${tool.name}`,
        description: tool.description,
        input_schema: zodToJsonSchema(tool.schema)
      };
    });
    
    res.json({
      tools: toolDefinitions,
      version: "1.0.0",
      name: "trello-mcp"
    });
  });

  // Register MCP POST endpoint for tool execution
  app.post('/mcp', async (req, res) => {
    try {
      // Handle the case where the tool name has a prefix (e.g., "trello-mcp_get_lists")
      const request = { ...req.body };
      if (request.name && request.name.startsWith('trello-mcp_')) {
        request.name = request.name.replace('trello-mcp_', '');
      }
      
      const result = await handleMCPRequest(request);
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