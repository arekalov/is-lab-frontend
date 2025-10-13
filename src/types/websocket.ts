export type WebSocketAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type WebSocketType = 'FLAT' | 'HOUSE';

export interface WebSocketMessage {
  type: WebSocketType;
  action: WebSocketAction;
  data: any;
}

export interface WebSocketUpdate {
  action: WebSocketAction;
  data: any;
}

export type WebSocketListener = (update: WebSocketUpdate) => void;
