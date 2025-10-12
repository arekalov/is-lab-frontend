import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { WS_URL } from '../utils/config';
import { useSnackbar } from 'notistack';

type WebSocketEvent = 'flat:created' | 'flat:updated' | 'flat:deleted';

export const useWebSocket = (onDataChange: () => void) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleEvent = useCallback((event: WebSocketEvent, message: any) => {
        let notification = '';
        switch (event) {
            case 'flat:created':
                notification = 'Добавлена новая квартира';
                break;
            case 'flat:updated':
                notification = 'Квартира обновлена';
                break;
            case 'flat:deleted':
                notification = 'Квартира удалена';
                break;
        }
        
        enqueueSnackbar(notification, {
            variant: 'info',
            autoHideDuration: 3000
        });
        
        onDataChange();
    }, [enqueueSnackbar, onDataChange]);

    useEffect(() => {
        const socket = io(WS_URL);

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        // Подписываемся на события
        socket.on('flat:created', () => handleEvent('flat:created', null));
        socket.on('flat:updated', () => handleEvent('flat:updated', null));
        socket.on('flat:deleted', () => handleEvent('flat:deleted', null));

        return () => {
            socket.disconnect();
        };
    }, [handleEvent]);
};