import { WS_URL } from '../utils/config';
import type { WebSocketType, WebSocketUpdate, WebSocketMessage } from '../types/websocket';

type WebSocketCallback = (update: WebSocketUpdate) => void;

class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimeout: number | null = null;
    private subscribers: Map<WebSocketType, Set<WebSocketCallback>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;
    private reconnectDelay = 5000;

    constructor() {
        this.connect();
    }

    private connect() {
        try {
            this.ws = new WebSocket(`${WS_URL}/is-lab1/websocket`);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log('WebSocket message received:', message);

                    // Парсим тип сообщения
                    // Ожидаем формат: "flatCreated", "flatUpdated", "flatDeleted", "houseCreated", etc.
                    const messageType = message.type.toLowerCase();
                    
                    let entityType: WebSocketType | null = null;
                    let action: 'CREATE' | 'UPDATE' | 'DELETE' | null = null;

                    if (messageType.startsWith('flat')) {
                        entityType = 'FLAT';
                    } else if (messageType.startsWith('house')) {
                        entityType = 'HOUSE';
                    }

                    if (messageType.includes('created')) {
                        action = 'CREATE';
                    } else if (messageType.includes('updated')) {
                        action = 'UPDATE';
                    } else if (messageType.includes('deleted')) {
                        action = 'DELETE';
                    }

                    if (entityType && action) {
                        this.notifySubscribers(entityType, { type: entityType, action });
                    } else {
                        console.warn('Unknown WebSocket message type:', message.type);
                    }
                } catch (error) {
                    console.error('Error processing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.scheduleReconnect();
            };
        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached. Giving up.');
            return;
        }

        if (this.reconnectTimeout) {
            window.clearTimeout(this.reconnectTimeout);
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        this.reconnectTimeout = window.setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }

    private notifySubscribers(type: WebSocketType, update: WebSocketUpdate) {
        const callbacks = this.subscribers.get(type);
        if (callbacks) {
            callbacks.forEach(callback => callback(update));
        }
    }

    public subscribe(type: WebSocketType, callback: WebSocketCallback): () => void {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }

        this.subscribers.get(type)!.add(callback);

        // Возвращаем функцию отписки
        return () => {
            const callbacks = this.subscribers.get(type);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    public disconnect() {
        if (this.reconnectTimeout) {
            window.clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.subscribers.clear();
    }
}

export const websocketService = new WebSocketService();
