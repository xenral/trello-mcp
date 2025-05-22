// Configuration types
export interface TrelloConfig {
  TRELLO_API_KEY: string;
  TRELLO_TOKEN: string;
  TRELLO_BOARD_ID?: string;
  TRELLO_WORKSPACE_ID?: string;
  PORT?: number;
  LOG_LEVEL?: string;
  API_KEY_RATE_LIMIT?: number;
  TOKEN_RATE_LIMIT?: number;
}

// MCP types
export interface Tool<TArgs = any, TResult = any> {
  name: string;
  description: string;
  schema: any; // Zod schema
  handler: (args: TArgs) => Promise<TResult>;
}

export interface MCPRequest {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPResponse {
  result?: any;
  error?: string;
}

// Trello API types
export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
  idBoard: string;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  idList: string;
  idBoard: string;
  idMembers: string[];
  labels: TrelloLabel[];
  due: string | null;
  dueComplete: boolean;
  url: string;
  shortUrl: string;
  pos: number;
  closed: boolean;
}

export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}

export interface TrelloActivity {
  id: string;
  idMemberCreator: string;
  data: Record<string, any>;
  type: string;
  date: string;
  memberCreator: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  shortUrl: string;
  closed: boolean;
}

export interface TrelloWorkspace {
  id: string;
  name: string;
  displayName: string;
  url: string;
}

// Persistent configuration
export interface StoredConfig {
  activeBoardId?: string;
  activeWorkspaceId?: string;
}

// Rate limiting
export interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number;
}

// Tool argument types
export interface ListIdArg {
  listId: string;
}

export interface CardIdArg {
  cardId: string;
}

export interface AddCardArgs {
  listId: string;
  name: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
}

export interface UpdateCardArgs {
  cardId: string;
  name?: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
}

export interface MoveCardArgs {
  cardId: string;
  listId: string;
}

export interface AddListArgs {
  name: string;
}

export interface GetActivityArgs {
  limit?: number;
}

export interface AttachImageArgs {
  cardId: string;
  imageUrl: string;
  name?: string;
}

export interface BoardIdArg {
  boardId: string;
}

export interface WorkspaceIdArg {
  workspaceId: string;
}

export interface ListBoardsInWorkspaceArgs {
  workspaceId: string;
} 