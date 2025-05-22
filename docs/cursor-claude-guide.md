# Using Trello MCP with Claude in Cursor IDE

This guide will help you set up and use the Trello MCP integration with Claude in Cursor IDE to manage your Trello boards, lists, and cards directly through AI assistance.

## Setup

### 1. Install the Trello MCP Server

First, install the Trello MCP server globally:

```bash
npm install -g @xenral/trello-mcp
```

### 2. Configure Trello API Access

Create a `.env` file in your project directory with the following content:

```
# Trello API credentials
TRELLO_API_KEY=your-api-key
TRELLO_TOKEN=your-token

# Initial board ID (can be changed later using set_active_board)
TRELLO_BOARD_ID=your-board-id

# Server configuration
PORT=3000
LOG_LEVEL=info
```

To get your Trello API credentials:
1. Get your API Key from: https://trello.com/app-key
2. Generate a Token using your API Key
3. Find your Board ID in the URL of your Trello board: `https://trello.com/b/{BOARD_ID}/{board-name}`

### 3. Adding Trello MCP to Cursor

There are two ways to add the Trello MCP server to Cursor:

#### Option A: Add globally (recommended)

To make the Trello MCP available in all your projects:

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
            ]
        }
    }
}
```

#### Option B: Add to a specific project

If you only need the Trello MCP in a single project:

1. Create a `.cursor` directory in your project root if it doesn't exist
2. Create or edit `.cursor/mcp.json` with the same configuration as above

### 4. Start the MCP Server

After adding the configuration:

1. Go back to Cursor Settings > MCP 
2. Click the refresh button to detect the new MCP server
3. The Trello MCP server will start automatically when needed

Alternatively, you can start the server manually:

```bash
trello-mcp start
```

### 5. Configure Claude in Cursor

In Cursor, add the following to your Claude custom instructions:

```
You have access to a Trello integration via MCP.
When I ask about tasks or project management, you can interact with my Trello boards to:
1. View lists and cards
2. Create new cards
3. Update existing cards
4. Move cards between lists
5. Get board activity

Use this Trello integration to help me manage my projects and tasks efficiently.
```

## Using Trello MCP with Claude

### Basic Commands

Here are some example prompts to use with Claude in Cursor:

#### Viewing Trello Content

```
Show me all the lists on my current Trello board
```

```
What cards do I have in the "In Progress" list?
```

```
Show me the recent activity on my board
```

#### Creating and Managing Cards

```
Create a new card called "Implement user authentication" in the "To Do" list with a description explaining JWT and session management
```

```
Update the "Fix navbar responsiveness" card to include specific breakpoint issues
```

```
Move the "Database schema design" card from "To Do" to "In Progress"
```

### Advanced Workflows

#### Daily Planning

```
Show me all my Trello cards and help me plan what to work on today based on priorities and due dates
```

#### Sprint Planning

```
Help me organize my backlog by reviewing all cards in the "Backlog" list and suggesting which ones should be moved to "Sprint Planning"
```

#### Status Updates

```
Create a summary of all the work completed this week based on cards moved to the "Done" list
```

## Tool Reference

Claude in Cursor uses the following function call format for Trello MCP:

### Viewing Board Information

```javascript
// Get all lists from the active board
mcp_trello-mcp_get_lists({})

// List all available boards
mcp_trello-mcp_list_boards({})

// Get active board information
mcp_trello-mcp_get_active_board_info({})

// Get all cards in a specific list
mcp_trello-mcp_get_cards_by_list_id({
  listId: "LIST_ID"
})

// Get recent activity on the board
mcp_trello-mcp_get_recent_activity({
  limit: 10 // optional
})
```

### Managing Cards

```javascript
// Add a new card to a list
mcp_trello-mcp_add_card_to_list({
  listId: "LIST_ID",
  name: "Card Title",
  description: "Card description", // optional
  dueDate: "2023-12-31T12:00:00Z" // optional
})

// Update an existing card
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
```

### Switching Boards

```javascript
// Change the active board
mcp_trello-mcp_set_active_board({
  boardId: "BOARD_ID"
})
```

## Troubleshooting

### Common Issues

1. **Connection Errors**: Make sure the Trello MCP server is running at the specified port
2. **Authentication Errors**: Verify your API key and token in the `.env` file
3. **"Board not found" Errors**: Check that the board ID in your configuration is correct

### Verifying Server Status

To check if the server is running properly:

```bash
curl http://localhost:3000/health
```

You should receive a response indicating the server is running.

### MCP Server Not Found in Cursor

If Cursor doesn't detect your MCP server:
1. Go to Settings > MCP and click the refresh button
2. Verify your `mcp.json` file has the correct configuration
3. Try restarting Cursor

## Examples of Successful Workflows

### Example 1: Daily Task Management

1. Start your day by asking Claude: "Show me all cards on my Trello board"
2. Ask Claude to help prioritize: "Based on these cards, what should I focus on today?"
3. Throughout the day, update progress: "Move 'Implement login page' to 'In Progress'"
4. End the day with a summary: "Create a summary of what I accomplished today"

### Example 2: Project Planning

1. Ask Claude to help organize your project: "Help me create a task breakdown for our new user authentication feature"
2. Claude can create multiple cards: "Create cards for each subtask in the 'Backlog' list"
3. Organize the cards: "Help me prioritize these tasks and move the top 3 to 'To Do'"

## Advanced Tips

1. **Custom Filtering**: Ask Claude to filter cards based on complex criteria: "Show me all cards with 'API' in the title that are in the 'To Do' list"

2. **Regular Updates**: Set up a routine with Claude: "Every morning, show me a summary of my Trello board and suggest the top 3 tasks to focus on"

3. **Integration with Code**: Combine Trello management with coding tasks: "As we work on implementing this feature, create corresponding cards in Trello to track our progress" 