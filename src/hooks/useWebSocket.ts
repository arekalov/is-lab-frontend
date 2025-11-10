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
        let variant: "info" | "success" | "warning" = "info";

        switch (action) {
          case "CREATE":
            notification =
              type === "FLAT"
                ? "Добавлена новая квартира"
                : "Добавлен новый дом";
            variant = "info";
            break;
          case "UPDATE":
            notification =
              type === "FLAT" ? "Квартира обновлена" : "Дом обновлен";
            variant = "info";
            break;
          case "DELETE":
            notification = type === "FLAT" ? "Квартира удалена" : "Дом удален";
            variant = "info";
            break;
        }

        enqueueSnackbar(notification, {
          variant,
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
