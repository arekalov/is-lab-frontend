export type WebSocketType = "FLAT" | "HOUSE";

export type WebSocketAction = "CREATE" | "UPDATE" | "DELETE";

export interface WebSocketUpdate {
  type: WebSocketType;
  action: WebSocketAction;
  id: number;
  data: any;
}

export interface WebSocketMessage {
  type: WebSocketType;
  action: WebSocketAction;
  data: {
    id: number;
    [key: string]: any;
  };
}
