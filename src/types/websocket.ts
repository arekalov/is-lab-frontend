export type WebSocketType = 'FLAT' | 'HOUSE';

export type WebSocketAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface WebSocketUpdate {
    type: WebSocketType;
    action: WebSocketAction;
    id?: number;
}

export interface WebSocketMessage {
    type: string;
    data?: any;
}
