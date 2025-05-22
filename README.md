# Trello MCP Server

A [Model Context Protocol](https://github.com/anthropics/model-context-protocol) server for Trello integration. This package allows AI assistants to interact with Trello boards, lists, and cards.

## Features

* **Full Trello Board Integration**: Interact with cards, lists, and board activities
* **Built-in Rate Limiting**: Respects Trello's API limits (300 requests/10s per API key, 100 requests/10s per token)
* **Type-Safe Implementation**: Written in TypeScript with comprehensive type definitions
* **Input Validation**: Robust validation for all API inputs with Zod
* **Error Handling**: Graceful error handling with informative messages
* **Dynamic Board Selection**: Switch between boards and workspaces without restarting
* **Claude & Cursor Integration**: Ready to use with Claude in Cursor IDE

## Installation

### Global Installation

```bash
npm install -g @xenral/trello-mcp
```

### Local Installation

```bash
npm install @xenral/trello-mcp
```

## Configuration

### Environment Variables

The server can be configured using environment variables in a `.env` file:

```
# Trello API credentials
TRELLO_API_KEY=your-api-key
TRELLO_TOKEN=your-token

# Initial board ID (can be changed later using set_active_board)
TRELLO_BOARD_ID=your-board-id

# Optional: Initial workspace ID (can be changed later using set_active_workspace)
TRELLO_WORKSPACE_ID=your-workspace-id

# Server configuration
PORT=3000
LOG_LEVEL=info # debug, info, warn, error

# Rate limiting configuration (requests per 10 seconds)
API_KEY_RATE_LIMIT=300
TOKEN_RATE_LIMIT=100
```

You can get these values from:

* API Key: https://trello.com/app-key
* Token: Generate using your API key
* Board ID: Found in the board URL (e.g., https://trello.com/b/BOARD_ID/board-name)
* Workspace ID: Found in workspace settings or using `list_workspaces` tool

## Usage

### Starting the Server

```bash
# If installed globally
trello-mcp start

# If installed locally
npx trello-mcp start

# Specify a custom port
trello-mcp start --port 8080

# Use a specific .env file
trello-mcp start --env-file /path/to/.env
```

## Using with Claude in Cursor IDE

### Setup in Cursor

1. Install the Trello MCP server:
   ```bash
   npm install -g @xenral/trello-mcp
   ```

2. Create a `.env` file with your Trello credentials (see Configuration section)

3. Add the Trello MCP to Cursor by either:

   **Option A: Add globally (recommended)**
   
   1. Go to Cursor Settings > MCP
   2. Click "Add new global MCP server"
   3. This will open the `~/.cursor/mcp.json` file
   4. Add the Trello MCP configuration:

   ```json
   {
       "mcpServers": {
           "trello-mcp": {
               "command": "npx",
               "args": [
                   "-y",
                   "@xenral/trello-mcp",
                   "start"
               ],
               "env": {
                   "TRELLO_API_KEY": "your-api-key-here",
                   "TRELLO_TOKEN": "your-token-here",
                   "TRELLO_BOARD_ID": "your-board-id-here",
                   "PORT": "3000"
               }
           }
       }
   }
   ```

   Replace the placeholder values with your actual Trello API credentials.

   **Option B: Add to a specific project**
   
   1. Create a `.cursor` directory in your project root
   2. Create a `.cursor/mcp.json` file with the same configuration as above

   **Option C: Using with an existing .env file**

   If you already have your Trello credentials in a `.env` file and prefer to use that:

   ```json
   {
       "mcpServers": {
           "trello-mcp": {
               "command": "npx",
               "args": [
                   "-y",
                   "@xenral/trello-mcp",
                   "start",
                   "--env-file",
                   "${workspaceFolder}/.env"
               ]
           }
       }
   }
   ```

4. In Cursor Settings > MCP, click the refresh button to detect the new MCP server

5. Configure Claude to use the Trello MCP by adding the following to your custom instructions:
   ```
   You have access to a Trello integration via MCP.
   When helping me manage tasks, you can create, update, and organize Trello cards.
   ```

### Example Claude Prompts

Here are some examples of how to ask Claude to interact with your Trello boards:

- "Show me all the lists on my current Trello board"
- "Create a new card titled 'Implement login feature' in the 'To Do' list"
- "Move the 'Fix navigation bug' card to the 'In Progress' list"
- "Show me all cards in the 'Code Review' list"
- "Update the 'Refactor authentication' card to include API endpoints in the description"

### MCP Tool Reference in Cursor

Claude in Cursor can use the following Trello MCP tools:

```typescript
// Get all lists from the active board
mcp_trello-mcp_get_lists({})

// Get all cards in a specific list
mcp_trello-mcp_get_cards_by_list_id({ 
  listId: "LIST_ID" 
})

// Add a new card to a list
mcp_trello-mcp_add_card_to_list({ 
  listId: "LIST_ID",
  name: "Card Title",
  description: "Card description",
  dueDate: "2023-12-31T12:00:00Z" // optional
})

// Update a card's details
mcp_trello-mcp_update_card_details({ 
  cardId: "CARD_ID",
  name: "Updated Title", // optional
  description: "Updated description" // optional
})

// Move a card to a different list
mcp_trello-mcp_move_card({ 
  cardId: "CARD_ID",
  listId: "TARGET_LIST_ID" 
})

// Get recent activity on the board
mcp_trello-mcp_get_recent_activity({
  limit: 10 // optional
})

// Change active board
mcp_trello-mcp_set_active_board({ 
  boardId: "BOARD_ID" 
})

// List available boards
mcp_trello-mcp_list_boards({})
```

## Available Tools

### get_lists

Retrieve all lists from the currently active board.

```json
{
  "name": "get_lists",
  "arguments": {}
}
```

### get_cards_by_list_id

Fetch all cards from a specific list.

```json
{
  "name": "get_cards_by_list_id",
  "arguments": {
    "listId": "string"
  }
}
```

### add_card_to_list

Add a new card to a specified list.

```json
{
  "name": "add_card_to_list",
  "arguments": {
    "listId": "string",
    "name": "string",
    "description": "string", // optional
    "dueDate": "string", // optional ISO 8601 date
    "labels": ["string"] // optional array of label IDs
  }
}
```

### update_card_details

Update an existing card's details.

```json
{
  "name": "update_card_details",
  "arguments": {
    "cardId": "string",
    "name": "string", // optional
    "description": "string", // optional
    "dueDate": "string", // optional ISO 8601 date
    "labels": ["string"] // optional array of label IDs
  }
}
```

### move_card

Move a card to a different list.

```json
{
  "name": "move_card",
  "arguments": {
    "cardId": "string",
    "listId": "string"
  }
}
```

### get_recent_activity

Fetch recent activity on the currently active board.

```json
{
  "name": "get_recent_activity",
  "arguments": {
    "limit": 10 // optional, default is 10
  }
}
```

### set_active_board

Set the active board for future operations.

```json
{
  "name": "set_active_board",
  "arguments": {
    "boardId": "string"
  }
}
```

### list_boards

Get a list of all available boards.

```json
{
  "name": "list_boards",
  "arguments": {}
}
```

## Workflow Example: Project Management with Claude and Trello

Here's a complete workflow example of using Claude in Cursor with Trello MCP:

1. **Start your day by asking Claude to summarize your Trello board**:
   ```
   "Show me all lists and cards on my current Trello board"
   ```

2. **Plan your day with Claude's help**:
   ```
   "Based on my current cards, what should I prioritize today?"
   ```

3. **Create new tasks as needed**:
   ```
   "Create cards for implementing user authentication in the 'To Do' list with these subtasks: 
   1. Set up JWT middleware
   2. Create login form
   3. Implement password reset flow"
   ```

4. **Update progress throughout the day**:
   ```
   "Move the 'Create login form' card to 'In Progress'"
   ```

5. **End of day review**:
   ```
   "Show me the recent activity on the board and summarize what was accomplished today"
   ```

## Development

### Prerequisites

* Node.js 16 or higher
* npm or yarn

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/xenral/trello-mcp.git
   cd trello-mcp
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the project
   ```bash
   npm run build
   ```

4. Run in development mode
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Summary

The Trello MCP Server provides a seamless integration between AI assistants and Trello boards, empowering AI agents to view, create, and manage Trello tasks efficiently. By implementing the Model Context Protocol (MCP), this server allows AI assistants to:

1. Browse boards, lists, and cards
2. Create and update cards
3. Move cards between lists
4. Track recent activity
5. Switch between different boards and workspaces

This implementation follows best practices for TypeScript development with comprehensive error handling, rate limiting for API calls, and detailed documentation. It's designed to be easily extendable with additional Trello API functionality as needed. 