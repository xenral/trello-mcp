# Trello MCP Server

A [Model Context Protocol](https://github.com/anthropics/model-context-protocol) server for Trello integration. This package allows AI assistants to interact with Trello boards, lists, and cards.

## Features

* **Full Trello Board Integration**: Interact with cards, lists, and board activities
* **Built-in Rate Limiting**: Respects Trello's API limits (300 requests/10s per API key, 100 requests/10s per token)
* **Type-Safe Implementation**: Written in TypeScript with comprehensive type definitions
* **Input Validation**: Robust validation for all API inputs with Zod
* **Error Handling**: Graceful error handling with informative messages
* **Dynamic Board Selection**: Switch between boards and workspaces without restarting

## Installation

### Global Installation

```bash
npm install -g @trello-mcp/server
```

### Local Installation

```bash
npm install @trello-mcp/server
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
```

### Using with AI Assistants

Configure your AI assistant to use the MCP endpoint at `http://localhost:3000/mcp` (or your custom port).

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

## Development

### Prerequisites

* Node.js 16 or higher
* npm or yarn

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/trello-mcp.git
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