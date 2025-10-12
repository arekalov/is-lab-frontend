import { api } from './api';
import { API_ENDPOINTS } from '../utils/config';
import type { Flat, PagedResponse } from '../types/models';

export const flatsService = {
    /**
     * Получение списка квартир с пагинацией и сортировкой
     * @param page Номер страницы (начиная с 0)
     * @param size Размер страницы
     * @param sortBy Поле для сортировки
     */
    getFlats: async (page: number, size: number, sortBy = 'id') => {
        console.log('getFlats called with:', { page, size, sortBy });
        try {
            const response = await api.get<{
                data: Flat[];
                total: number;
                page: number;
                size: number;
                totalPages: number;
            }>(API_ENDPOINTS.flats, { 
                params: { page, size, sortBy }
            });
            
            // Преобразуем формат ответа от бэкенда в наш формат
            const transformedResponse: PagedResponse<Flat> = {
                items: response.data.data, // data содержит массив квартир
                total: response.data.total,
                page: response.data.page,
                size: response.data.size
            };
            
            console.log('getFlats transformed response:', transformedResponse);
            return transformedResponse;
        } catch (error) {
            console.error('getFlats error:', error);
            throw error;
        }
    },

    /**
     * Получение квартиры по ID
     * @param id ID квартиры
     * @throws {Error} Если квартира не найдена
     */
    getFlatById: async (id: number) => {
        const response = await api.get<Flat>(`${API_ENDPOINTS.flats}/${id}`);
        return response.data;
    },

    /**
     * Создание новой квартиры
     * @param flat Данные новой квартиры
     * @throws {Error} Если данные невалидны или произошла ошибка при создании
     */
    createFlat: async (flat: Omit<Flat, 'id' | 'creationDate'>) => {
        const response = await api.post<Flat>(API_ENDPOINTS.flats, flat);
        return response.data;
    },

    /**
     * Обновление существующей квартиры
     * @param id ID квартиры
     * @param flat Обновленные данные квартиры
     * @throws {Error} Если квартира не найдена или данные невалидны
     */
    updateFlat: async (id: number, flat: Omit<Flat, 'id' | 'creationDate'>) => {
        const response = await api.put<Flat>(`${API_ENDPOINTS.flats}/${id}`, flat);
        return response.data;
    },

    /**
     * Удаление квартиры
     * @param id ID квартиры
     * @throws {Error} Если квартира не найдена
     */
    deleteFlat: async (id: number) => {
        await api.delete(`${API_ENDPOINTS.flats}/${id}`);
    },

    // Специальные операции

    /**
     * Подсчет количества квартир с количеством комнат больше заданного
     * @param minRooms Минимальное количество комнат
     */
    countByRoomsGreaterThan: async (minRooms: number) => {
        const response = await api.get<number>(
            API_ENDPOINTS.specialOps.countByRoomsGreaterThan(minRooms)
        );
        return response.data;
    },

    /**
     * Поиск квартир по подстроке в названии
     * @param substring Подстрока для поиска
     */
    findByNameContaining: async (substring: string) => {
        const response = await api.get<Flat[]>(
            API_ENDPOINTS.specialOps.findByNameContaining, 
            { params: { substring } }
        );
        return response.data;
    },

    /**
     * Поиск квартир с жилой площадью меньше заданной
     * @param maxSpace Максимальная жилая площадь
     */
    findByLivingSpaceLessThan: async (maxSpace: number) => {
        const response = await api.get<Flat[]>(
            API_ENDPOINTS.specialOps.findByLivingSpaceLessThan(maxSpace)
        );
        return response.data;
    },

    /**
     * Поиск самой дешевой квартиры с балконом
     * @throws {Error} Если квартиры с балконом не найдены
     */
    findCheapestWithBalcony: async () => {
        const response = await api.get<Flat>(
            API_ENDPOINTS.specialOps.findCheapestWithBalcony
        );
        return response.data;
    },

    /**
     * Получение списка квартир, отсортированного по времени до метро
     */
    findAllSortedByMetroTime: async () => {
        const response = await api.get<Flat[]>(
            API_ENDPOINTS.specialOps.findAllSortedByMetroTime
        );
        return response.data;
    }
};