import { type FC, useState, useEffect } from 'react';
import { Box, Badge, Tooltip } from '@chakra-ui/react';
import { websocketService, WebSocketStatus as WSStatus } from '../../services/websocketService';

export const WebSocketStatus: FC = () => {
    const [status, setStatus] = useState<WSStatus>(websocketService.getStatus());

    useEffect(() => {
        const unsubscribe = websocketService.subscribeToStatus(setStatus);
        return unsubscribe;
    }, []);

    const getStatusProps = () => {
        switch (status) {
            case WSStatus.CONNECTED:
                return {
                    colorScheme: 'green',
                    label: 'Подключено',
                    tooltip: 'WebSocket подключен. Данные обновляются в реальном времени.'
                };
            case WSStatus.CONNECTING:
                return {
                    colorScheme: 'yellow',
                    label: 'Подключение...',
                    tooltip: 'Подключение к серверу...'
                };
            case WSStatus.DISCONNECTED:
                return {
                    colorScheme: 'gray',
                    label: 'Отключено',
                    tooltip: 'WebSocket отключен. Данные могут быть неактуальны.'
                };
            case WSStatus.ERROR:
                return {
                    colorScheme: 'red',
                    label: 'Ошибка',
                    tooltip: 'Ошибка подключения. Попытка переподключения...'
                };
            default:
                return {
                    colorScheme: 'gray',
                    label: 'Неизвестно',
                    tooltip: 'Неизвестный статус подключения'
                };
        }
    };

    const { colorScheme, label, tooltip } = getStatusProps();

    return (
        <Tooltip label={tooltip} placement="bottom">
            <Box display="inline-block">
                <Badge colorScheme={colorScheme} fontSize="sm" px={3} py={1} borderRadius="md">
                    {label}
                </Badge>
            </Box>
        </Tooltip>
    );
};

