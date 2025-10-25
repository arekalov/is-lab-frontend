import { api } from './api';
import { API_ENDPOINTS } from '../utils/config';
import type { House, PagedResponse } from '../types/models';

export const housesService = {
    /**
     * Получение списка всех домов с пагинацией и сортировкой
     * @param page Номер страницы (начиная с 0)
     * @param size Количество элементов на странице
     * @param sortBy Поле для сортировки
     */
    getHouses: async (page: number = 0, size: number = 10, sortBy: string = 'id'): Promise<PagedResponse<House>> => {
        try {
            const response = await api.get<PagedResponse<House>>(API_ENDPOINTS.houses, {
                params: {
                    page,
                    size,
                    sortBy
                }
            });
            
            // Проверяем, что backend вернул корректную структуру
            if (response.data && typeof response.data === 'object') {
                // Если backend вернул данные в поле data
                const data = (response.data as any).data;
                if (data && Array.isArray(data)) {
                    return {
                        items: data,
                        total: (response.data as any).total || data.length,
                        page: (response.data as any).page || page,
                        size: (response.data as any).size || size
                    };
                }
                
                // Если backend вернул данные напрямую в структуре PagedResponse
                if (Array.isArray((response.data as any).items)) {
                    return response.data as PagedResponse<House>;
                }
                
                // Если backend вернул просто массив
                if (Array.isArray(response.data)) {
                    return {
                        items: response.data,
                        total: response.data.length,
                        page,
                        size
                    };
                }
            }
            
            console.error('Unexpected response format:', response.data);
            return { items: [], total: 0, page, size };
        } catch (error) {
            console.error('Failed to fetch houses:', error);
            return { items: [], total: 0, page, size };
        }
    },

    /**
     * Получение дома по ID
     * @param id ID дома
     * @throws {Error} Если дом не найден
     */
    getHouseById: async (id: number) => {
        const response = await api.get<House>(`${API_ENDPOINTS.houses}/${id}`);
        return response.data;
    },

    /**
     * Создание нового дома
     * @param house Данные нового дома
     * @throws {Error} Если данные невалидны или произошла ошибка при создании
     */
    createHouse: async (house: Omit<House, 'id'>) => {
        const response = await api.post<House>(API_ENDPOINTS.houses, house);
        return response.data;
    },

    /**
     * Обновление существующего дома
     * @param id ID дома
     * @param house Обновленные данные дома
     * @throws {Error} Если дом не найден или данные невалидны
     */
    updateHouse: async (id: number, house: Omit<House, 'id'>) => {
        const response = await api.put<House>(`${API_ENDPOINTS.houses}/${id}`, house);
        return response.data;
    },

    /**
     * Удаление дома
     * @param id ID дома
     * @throws {Error} Если дом не найден или есть связанные квартиры
     */
    deleteHouse: async (id: number) => {
        await api.delete(`${API_ENDPOINTS.houses}/${id}`);
    }
};