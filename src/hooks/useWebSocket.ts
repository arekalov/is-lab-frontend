import { useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { websocketService } from "../services/websocketService";
import type { WebSocketType, WebSocketUpdate } from "../types/websocket";

interface UseWebSocketOptions {
  onDataChange?: () => void;
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
  onDelete?: (id: number) => void;
  showNotifications?: boolean;
}

export const useWebSocket = (
  type: WebSocketType,
  options: UseWebSocketOptions = {}
) => {
  const {
    onDataChange,
    onCreate,
    onUpdate,
    onDelete,
    showNotifications = true,
  } = options;
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = useCallback(
    (update: WebSocketUpdate) => {
      const { action, data } = update;

      if (showNotifications) {
        let notification = "";
        const entityType = type === "FLAT" ? "квартира" : "дом";

        switch (action) {
          case "CREATE":
            notification = `Добавлен новый ${entityType}`;
            break;
          case "UPDATE":
            notification = `${entityType} обновлен(а)`;
            break;
          case "DELETE":
            notification = `${entityType} удален(а)`;
            break;
        }

        enqueueSnackbar(notification, {
          variant: "info",
          autoHideDuration: 3000,
        });
      }

      // Вызываем специфичные колбэки
      switch (action) {
        case "CREATE":
          if (onCreate) onCreate(data);
          break;
        case "UPDATE":
          if (onUpdate) onUpdate(data);
          break;
        case "DELETE":
          if (onDelete) onDelete(data as number);
          break;
      }

      // Вызываем общий колбэк для перезагрузки данных
      if (onDataChange) {
        onDataChange();
      }
    },
    [
      enqueueSnackbar,
      onDataChange,
      onCreate,
      onUpdate,
      onDelete,
      showNotifications,
      type,
    ]
  );

  useEffect(() => {
    // Subscribe to WebSocket updates
    const unsubscribe = websocketService.subscribe(type, handleUpdate);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [type, handleUpdate]);
};
