export type WebSocketType = "FLAT" | "HOUSE";

export type WebSocketAction = "CREATE" | "UPDATE" | "DELETE";

export interface WebSocketUpdate {
  type: WebSocketType;
  action: WebSocketAction;
  data: any; // Полный объект для CREATE/UPDATE, только ID (number) для DELETE
}

export interface WebSocketMessage {
  type: WebSocketType;
  action: WebSocketAction;
  data: any; // Полный объект для CREATE/UPDATE, только ID (number) для DELETE
}
