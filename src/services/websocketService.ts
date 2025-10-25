import { WS_URL } from "../utils/config";
import type { WebSocketMessage, WebSocketListener } from "../types/websocket";

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, WebSocketListener[]> = new Map();
  private reconnectTimeoutId: number | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.handleMessage(message);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeoutId = window.setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect();
      }, 3000);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const { type, action, data } = message;
    const typeListeners = this.listeners.get(type) || [];
    typeListeners.forEach((listener) => listener({ action, data }));
  }

  public subscribe(type: string, callback: WebSocketListener) {
    const typeListeners = this.listeners.get(type) || [];
    typeListeners.push(callback);
    this.listeners.set(type, typeListeners);

    // Return unsubscribe function
    return () => this.unsubscribe(type, callback);
  }

  private unsubscribe(type: string, callback: WebSocketListener) {
    const typeListeners = this.listeners.get(type) || [];
    const index = typeListeners.indexOf(callback);
    if (index !== -1) {
      typeListeners.splice(index, 1);
      this.listeners.set(type, typeListeners);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    this.listeners.clear();
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
