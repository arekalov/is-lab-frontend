import { useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { websocketService } from '../services/websocketService';
import type { WebSocketType, WebSocketUpdate } from '../types/websocket';

interface UseWebSocketOptions {
  onDataChange?: () => void;
  showNotifications?: boolean;
}

export const useWebSocket = (type: WebSocketType, options: UseWebSocketOptions = {}) => {
    const { onDataChange, showNotifications = true } = options;
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdate = useCallback(({ action, data }: WebSocketUpdate) => {
        if (showNotifications) {
            let notification = '';
            const entityType = type === 'FLAT' ? 'квартира' : 'дом';
            
            switch (action) {
                case 'CREATE':
                    notification = `Добавлен новый ${entityType}`;
                    break;
                case 'UPDATE':
                    notification = `${entityType} обновлен(а)`;
                    break;
                case 'DELETE':
                    notification = `${entityType} удален(а)`;
                    break;
            }
            
            enqueueSnackbar(notification, {
                variant: 'info',
                autoHideDuration: 3000
            });
        }
        
        if (onDataChange) {
            onDataChange();
        }
    }, [enqueueSnackbar, onDataChange, showNotifications, type]);

    useEffect(() => {
        // Subscribe to WebSocket updates
        const unsubscribe = websocketService.subscribe(type, handleUpdate);

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [type, handleUpdate]);
};