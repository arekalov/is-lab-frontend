import { WS_URL } from "../utils/config";
import type {
  WebSocketType,
  WebSocketUpdate,
  WebSocketMessage,
  WebSocketAction,
} from "../types/websocket";

type WebSocketCallback = (update: WebSocketUpdate) => void;

export const WebSocketStatus = {
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
} as const;

export type WebSocketStatus =
  (typeof WebSocketStatus)[keyof typeof WebSocketStatus];

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private subscribers: Map<WebSocketType, Set<WebSocketCallback>> = new Map();
  private statusSubscribers: Set<(status: WebSocketStatus) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000;
  private currentStatus: WebSocketStatus = WebSocketStatus.DISCONNECTED;

  constructor() {
    this.connect();
  }

  private setStatus(status: WebSocketStatus) {
    this.currentStatus = status;
    this.statusSubscribers.forEach((callback) => callback(status));
  }

  public subscribeToStatus(
    callback: (status: WebSocketStatus) => void
  ): () => void {
    this.statusSubscribers.add(callback);
    callback(this.currentStatus); // Сразу отправляем текущий статус
    return () => this.statusSubscribers.delete(callback);
  }

  public getStatus(): WebSocketStatus {
    return this.currentStatus;
  }

  private connect() {
    try {
      this.setStatus(WebSocketStatus.CONNECTING);
      this.ws = new WebSocket(`${WS_URL}/is-lab1/websocket/updates`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.setStatus(WebSocketStatus.CONNECTED);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("WebSocket message received:", message);

          const { type, action, data } = message;

          if (!type || !action || !data) {
            console.warn("Invalid WebSocket message format:", message);
            return;
          }

          if (!data.id) {
            console.warn("WebSocket message data missing ID:", message);
            return;
          }

          // Валидация типа и действия
          if (type !== "FLAT" && type !== "HOUSE") {
            console.warn("Unknown WebSocket message type:", type);
            return;
          }

          if (
            action !== "CREATE" &&
            action !== "UPDATE" &&
            action !== "DELETE"
          ) {
            console.warn("Unknown WebSocket message action:", action);
            return;
          }

          // Отправляем обновление подписчикам
          this.notifySubscribers(type as WebSocketType, {
            type: type as WebSocketType,
            action: action as WebSocketAction,
            id: data.id,
            data,
          });
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.setStatus(WebSocketStatus.ERROR);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.setStatus(WebSocketStatus.DISCONNECTED);
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Giving up.");
      return;
    }

    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  private notifySubscribers(type: WebSocketType, update: WebSocketUpdate) {
    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(update));
    }
  }

  public subscribe(
    type: WebSocketType,
    callback: WebSocketCallback
  ): () => void {
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
