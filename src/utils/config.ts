

// Для WebSocket используем localhost:281234 (проброшенный порт через SSH)
export const WS_URL = 'ws://localhost:28123/websocket/updates';

// Эндпоинты API
export const API_ENDPOINTS = {
    // Основные операции с квартирами
    flats: '/flats',
    
    // Основные операции с домами
    houses: '/houses',
    
    // Специальные операции
    specialOps: {
        // Количество квартир с количеством комнат больше заданного
        countByRoomsGreaterThan: (minRooms: number) => `/flats/count/rooms-greater-than/${minRooms}`,
        
        // Поиск квартир по подстроке в названии
        findByNameContaining: '/flats/search/by-name',
        
        // Поиск квартир с жилой площадью меньше заданной
        findByLivingSpaceLessThan: (maxSpace: number) => `/flats/search/by-living-space-less-than/${maxSpace}`,
        
        // Поиск самой дешевой квартиры с балконом
        findCheapestWithBalcony: '/flats/search/cheapest-with-balcony',
        
        // Получение списка квартир, отсортированного по времени до метро
        findAllSortedByMetroTime: '/flats/sorted-by-metro-time'
    }
} as const;