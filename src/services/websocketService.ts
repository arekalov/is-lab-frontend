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
    console.log("🚀 WebSocketService initialized");
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
      const wsUrl = `${WS_URL}/is-lab1/websocket/updates`;
      console.log("🔌 Attempting to connect to WebSocket:", wsUrl);
      this.setStatus(WebSocketStatus.CONNECTING);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ WebSocket connected successfully");
        this.reconnectAttempts = 0;
        this.setStatus(WebSocketStatus.CONNECTED);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", message);

          const { type, action, data } = message;

          // Валидация структуры сообщения
          if (!type || !action || data === undefined) {
            console.warn("Invalid WebSocket message format:", message);
            return;
          }

          // Валидация типа
          if (type !== "FLAT" && type !== "HOUSE") {
            console.warn("Unknown WebSocket message type:", type);
            return;
          }

          // Валидация действия
          if (
            action !== "CREATE" &&
            action !== "UPDATE" &&
            action !== "DELETE"
          ) {
            console.warn("Unknown WebSocket message action:", action);
            return;
          }

          // Для DELETE data - это просто ID (number)
          // Для CREATE и UPDATE data - это полный объект
          if (action === "DELETE") {
            if (typeof data !== "number") {
              console.warn("DELETE action expects ID as number:", message);
              return;
            }
          } else {
            // CREATE или UPDATE
            if (typeof data !== "object" || !data.id) {
              console.warn(
                "CREATE/UPDATE action expects object with id:",
                message
              );
              return;
            }
          }

          // Отправляем обновление подписчикам
          this.notifySubscribers(type as WebSocketType, {
            type: type as WebSocketType,
            action: action as WebSocketAction,
            data,
          });
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.setStatus(WebSocketStatus.ERROR);
      };

      this.ws.onclose = (event) => {
        console.log("🔌 WebSocket disconnected", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        this.setStatus(WebSocketStatus.DISCONNECTED);
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error("❌ Failed to establish WebSocket connection:", error);
      this.setStatus(WebSocketStatus.ERROR);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnection attempts reached. Giving up.");
      this.setStatus(WebSocketStatus.ERROR);
      return;
    }

    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    console.log(
      `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  private notifySubscribers(type: WebSocketType, update: WebSocketUpdate) {
    const callbacks = this.subscribers.get(type);
    if (callbacks && callbacks.size > 0) {
      console.log(
        `📢 Notifying ${callbacks.size} subscriber(s) for type: ${type}`
      );
      callbacks.forEach((callback) => {
        try {
          callback(update);
        } catch (error) {
          console.error("Error in subscriber callback:", error);
        }
      });
    } else {
      console.warn(`⚠️ No subscribers for type: ${type}`);
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
    console.log(
      `✅ Subscribed to ${type}. Total subscribers: ${
        this.subscribers.get(type)!.size
      }`
    );

    // Возвращаем функцию отписки
    return () => {
      const callbacks = this.subscribers.get(type);
      if (callbacks) {
        callbacks.delete(callback);
        console.log(
          `❌ Unsubscribed from ${type}. Remaining subscribers: ${callbacks.size}`
        );
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
